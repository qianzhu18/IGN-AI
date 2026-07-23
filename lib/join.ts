import { promises as fs } from 'fs'
import path from 'path'
import { createHash, randomUUID, timingSafeEqual } from 'crypto'
import type { IncomingMessage } from 'http'

import {
  getSupabaseServerClient,
  isJoinDatabaseEnabled,
  joinStatusOptions,
  type JoinApplicationMetadata,
  type JoinApplicationRecord,
  type JoinApplicationStatus,
  type JoinMemberProfileDraft
} from '@/lib/supabase'

export type JoinExperienceMode = 'database' | 'local' | 'external' | 'email'

type RawJoinPayload = {
  name?: unknown
  contact?: unknown
  role?: unknown
  message?: unknown
  interests?: unknown
  memberProfile?: unknown
  source?: unknown
}

export type JoinSubmissionInput = {
  name: string
  contact: string
  role: string
  message: string
  interests: string[]
  source: string
  metadata: JoinApplicationMetadata
}

const JOIN_DATA_DIR = path.join(process.cwd(), '.data')
const JOIN_DATA_FILE = path.join(JOIN_DATA_DIR, 'join-applications.json')
const OPS_COOKIE_NAME = 'ignai_ops_session'
const JOIN_RATE_LIMIT_WINDOW_MS = Number(
  process.env.JOIN_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000
)
const JOIN_RATE_LIMIT_MAX_PER_IP = Number(
  process.env.JOIN_RATE_LIMIT_MAX_PER_IP || 80
)
const JOIN_RATE_LIMIT_MAX_PER_CONTACT = Number(
  process.env.JOIN_RATE_LIMIT_MAX_PER_CONTACT || 3
)
const JOIN_DUPLICATE_WINDOW_MS = Number(
  process.env.JOIN_DUPLICATE_WINDOW_MS || 30 * 60 * 1000
)
const NOTION_WRITE_RETRY_COUNT = Number(
  process.env.JOIN_NOTION_RETRY_COUNT || 3
)
const NOTION_WRITE_MIN_INTERVAL_MS = Number(
  process.env.JOIN_NOTION_MIN_INTERVAL_MS || 350
)

type JoinApplicationRow = Record<string, unknown>
type JoinRateLimitBucket = { count: number; resetAt: number }
type JoinRuntimeState = {
  ipBuckets: Map<string, JoinRateLimitBucket>
  contactBuckets: Map<string, JoinRateLimitBucket>
  recentFingerprints: Map<string, number>
  notionWriteQueue: Promise<unknown>
  lastNotionWriteAt: number
}

const joinRuntimeState = (() => {
  const key = '__ignaiJoinRuntimeState'
  const root = globalThis as typeof globalThis &
    Record<string, JoinRuntimeState | undefined>
  if (!root[key]) {
    root[key] = {
      ipBuckets: new Map(),
      contactBuckets: new Map(),
      recentFingerprints: new Map(),
      notionWriteQueue: Promise.resolve(),
      lastNotionWriteAt: 0
    }
  }
  return root[key]
})()

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function normalizeContactKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

function getJoinFingerprint(input: JoinSubmissionInput) {
  return sha256(
    [
      normalizeContactKey(input.contact),
      input.name.trim().toLowerCase(),
      input.role.trim().toLowerCase()
    ].join('|')
  )
}

function getClientIp(req: IncomingMessage) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim()
  return req.socket.remoteAddress || 'unknown'
}

function pruneRuntimeState(now = Date.now()) {
  for (const [key, bucket] of Array.from(
    joinRuntimeState.ipBuckets.entries()
  )) {
    if (bucket.resetAt <= now) joinRuntimeState.ipBuckets.delete(key)
  }
  for (const [key, bucket] of Array.from(
    joinRuntimeState.contactBuckets.entries()
  )) {
    if (bucket.resetAt <= now) joinRuntimeState.contactBuckets.delete(key)
  }
  for (const [key, expiresAt] of Array.from(
    joinRuntimeState.recentFingerprints.entries()
  )) {
    if (expiresAt <= now) joinRuntimeState.recentFingerprints.delete(key)
  }
}

function bumpBucket(
  map: Map<string, JoinRateLimitBucket>,
  key: string,
  limit: number,
  now = Date.now()
) {
  const current = map.get(key)
  if (!current || current.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + JOIN_RATE_LIMIT_WINDOW_MS })
    return
  }
  current.count += 1
  if (current.count > limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    )
    const error = new Error('RATE_LIMITED')
    Object.assign(error, { retryAfterSeconds })
    throw error
  }
}

export function enforceJoinSubmissionGuard(
  req: IncomingMessage,
  input: JoinSubmissionInput
) {
  const now = Date.now()
  pruneRuntimeState(now)

  const ip = getClientIp(req)
  const contactKey = normalizeContactKey(input.contact)
  const fingerprint = getJoinFingerprint(input)

  if (joinRuntimeState.recentFingerprints.has(fingerprint)) {
    throw new Error('DUPLICATE_SUBMISSION')
  }

  bumpBucket(joinRuntimeState.ipBuckets, ip, JOIN_RATE_LIMIT_MAX_PER_IP, now)
  bumpBucket(
    joinRuntimeState.contactBuckets,
    contactKey,
    JOIN_RATE_LIMIT_MAX_PER_CONTACT,
    now
  )

  joinRuntimeState.recentFingerprints.set(
    fingerprint,
    now + JOIN_DUPLICATE_WINDOW_MS
  )
}

async function delay(ms: number) {
  if (ms <= 0) return
  await new Promise(resolve => setTimeout(resolve, ms))
}

async function enqueueNotionWrite<T>(task: () => Promise<T>) {
  const run = async () => {
    const waitMs = Math.max(
      0,
      joinRuntimeState.lastNotionWriteAt +
        NOTION_WRITE_MIN_INTERVAL_MS -
        Date.now()
    )
    await delay(waitMs)
    joinRuntimeState.lastNotionWriteAt = Date.now()
    return task()
  }

  const queued = joinRuntimeState.notionWriteQueue.then(run, run)
  joinRuntimeState.notionWriteQueue = queued.catch(() => undefined)
  return queued
}

function normalizeOptionalUrl(value: unknown) {
  const input = readString(value)
  if (!input) return ''
  if (/^https?:\/\//i.test(input) || /^mailto:/i.test(input)) {
    return input
  }
  return `https://${input}`
}

function normalizeMemberProfile(
  raw: unknown
): JoinMemberProfileDraft | undefined {
  if (!raw || typeof raw !== 'object') return undefined

  const record = raw as Record<string, unknown>
  const memberProfile: JoinMemberProfileDraft = {
    avatarUrl: normalizeOptionalUrl(record.avatarUrl),
    headline: readString(record.headline),
    website: normalizeOptionalUrl(record.website),
    github: normalizeOptionalUrl(record.github),
    xiaohongshu: normalizeOptionalUrl(record.xiaohongshu)
  }

  const hasValue = Object.values(memberProfile).some(Boolean)
  return hasValue ? memberProfile : undefined
}

export function normalizeJoinSubmission(
  payload: RawJoinPayload
): JoinSubmissionInput {
  const name = readString(payload.name)
  const contact = readString(payload.contact)
  const role = readString(payload.role)
  const message = readString(payload.message)
  const source = readString(payload.source) || 'website'
  const interests = Array.isArray(payload.interests)
    ? payload.interests
        .map(value => readString(value))
        .filter(Boolean)
        .slice(0, 12)
    : []

  const memberProfile = normalizeMemberProfile(payload.memberProfile)

  if (!name || !contact || !role) {
    throw new Error('MISSING_REQUIRED_FIELDS')
  }

  return {
    name,
    contact,
    role,
    message,
    source,
    interests,
    metadata: memberProfile ? { member_profile: memberProfile } : {}
  }
}

function ensureStatus(value: unknown): JoinApplicationStatus {
  return joinStatusOptions.includes(value as JoinApplicationStatus)
    ? (value as JoinApplicationStatus)
    : 'submitted'
}

async function ensureJoinFile() {
  await fs.mkdir(JOIN_DATA_DIR, { recursive: true })
  try {
    await fs.access(JOIN_DATA_FILE)
  } catch {
    await fs.writeFile(JOIN_DATA_FILE, '[]\n', 'utf8')
  }
}

async function readLocalJoinApplications(): Promise<JoinApplicationRecord[]> {
  await ensureJoinFile()
  const raw = await fs.readFile(JOIN_DATA_FILE, 'utf8')
  const data: unknown = JSON.parse(raw)
  return Array.isArray(data)
    ? data.map(item => normalizeJoinApplicationRecord(item))
    : []
}

async function writeLocalJoinApplications(items: JoinApplicationRecord[]) {
  await ensureJoinFile()
  await fs.writeFile(
    JOIN_DATA_FILE,
    `${JSON.stringify(items, null, 2)}\n`,
    'utf8'
  )
}

function normalizeJoinApplicationRecord(row: unknown): JoinApplicationRecord {
  const item = (row || {}) as JoinApplicationRow

  return {
    id: readString(item.id) || randomUUID(),
    name: readString(item.name),
    contact: readString(item.contact),
    role: readString(item.role),
    interests: Array.isArray(item.interests)
      ? item.interests.map(value => readString(value)).filter(Boolean)
      : [],
    message: readString(item.message),
    source: readString(item.source) || 'website',
    status: ensureStatus(item.status),
    created_at: readString(item.created_at) || new Date(0).toISOString(),
    updated_at:
      readString(item.updated_at) ||
      readString(item.created_at) ||
      new Date(0).toISOString(),
    metadata:
      item.metadata && typeof item.metadata === 'object'
        ? (item.metadata as JoinApplicationMetadata)
        : {}
  }
}

function hasSameContact(
  item: JoinApplicationRecord,
  input: JoinSubmissionInput
) {
  return (
    normalizeContactKey(item.contact) === normalizeContactKey(input.contact)
  )
}

async function findExistingJoinApplication(
  input: JoinSubmissionInput
): Promise<JoinApplicationRecord | null> {
  const client = getSupabaseServerClient()

  if (client) {
    const result = await client
      .from('join_applications')
      .select('*')
      .eq('contact', input.contact)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!result.error && result.data?.[0]) {
      return normalizeJoinApplicationRecord(result.data[0])
    }
  }

  try {
    const items = await readLocalJoinApplications()
    return items.find(item => hasSameContact(item, input)) || null
  } catch {
    return null
  }
}

// 新版 Notion API 以 data source 作为父级。保留 database id 变量只为兼容
// 尚未迁移的部署，生产环境必须显式配置 data source id，避免写入被固定到某个库。
const NOTION_MEMBERS_DATA_SOURCE_ID =
  process.env.NOTION_MEMBERS_DATA_SOURCE_ID || ''
const NOTION_MEMBERS_DB_ID =
  process.env.NOTION_MEMBERS_DATABASE_ID ||
  'a3ae45c4-da1e-821e-8e69-010ad0a42134'
const NOTION_MEMBER_DRAFT_STATUS =
  process.env.NOTION_MEMBERS_STATUS_DRAFT_VALUE || 'Invisible'

function formatDateOnly(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isJoinNotionEnabled(): boolean {
  return Boolean(
    process.env.NOTION_API_TOKEN?.trim() &&
      (NOTION_MEMBERS_DATA_SOURCE_ID || NOTION_MEMBERS_DB_ID)
  )
}

async function createNotionMemberApplication(
  input: JoinSubmissionInput
): Promise<JoinApplicationRecord | null> {
  const token = process.env.NOTION_API_TOKEN
  if (!token) return null

  const profile = input.metadata?.member_profile
  const now = new Date().toISOString()
  const submittedDate = formatDateOnly(new Date(now))

  // 将 interests + message + 小红书拼入 bio
  const bioParts: string[] = []
  if (input.message) bioParts.push(input.message)
  if (input.interests.length > 0)
    bioParts.push(`兴趣方向：${input.interests.join('、')}`)
  if (profile?.xiaohongshu) bioParts.push(`小红书：${profile.xiaohongshu}`)
  bioParts.push(`联系方式：${input.contact}`)
  bioParts.push(`来源：${input.source}`)
  bioParts.push(`提交日期：${submittedDate}`)
  const bio = bioParts.join('\n\n')

  const properties: Record<string, unknown> = {
    title: { title: [{ text: { content: input.name } }] },
    role: { rich_text: [{ text: { content: input.role.slice(0, 200) } }] },
    bio: { rich_text: [{ text: { content: bio.slice(0, 2000) } }] },
    status: { select: { name: NOTION_MEMBER_DRAFT_STATUS } },
    type: { select: { name: 'Member' } },
    featured: { checkbox: false },
    verified: { checkbox: false }
  }

  if (profile?.headline) {
    properties.summary = {
      rich_text: [{ text: { content: profile.headline.slice(0, 200) } }]
    }
  }
  if (profile?.avatarUrl) {
    properties.avatar = { url: profile.avatarUrl }
  }
  if (profile?.website) {
    properties.website = { url: profile.website }
  }
  if (profile?.github) {
    properties.social_github = { url: profile.github }
  }

  try {
    const response = await enqueueNotionWrite(() =>
      fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': process.env.NOTION_API_VERSION || '2026-03-11',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parent: NOTION_MEMBERS_DATA_SOURCE_ID
            ? { data_source_id: NOTION_MEMBERS_DATA_SOURCE_ID }
            : { database_id: NOTION_MEMBERS_DB_ID },
          properties,
          ...(profile?.avatarUrl
            ? { icon: { external: { url: profile.avatarUrl } } }
            : {})
        })
      })
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[join:notion] page creation failed', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.slice(0, 500)
      })
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`NOTION_RETRYABLE_${response.status}`)
      }
      return null
    }

    const page = (await response.json()) as { id?: string }
    if (!page?.id) {
      console.warn(
        '[join:notion] page creation succeeded but response id is missing'
      )
      return null
    }

    return {
      id: page.id,
      name: input.name,
      contact: input.contact,
      role: input.role,
      interests: input.interests,
      message: input.message,
      source: input.source,
      status: 'submitted',
      created_at: now,
      updated_at: now,
      metadata: {
        ...input.metadata,
        notion_page_id: page.id,
        join_writeback_target: 'notion'
      }
    }
  } catch (error) {
    console.error('[join:notion] page creation threw', error)
    return null
  }
}

async function createNotionMemberApplicationWithRetry(
  input: JoinSubmissionInput
): Promise<JoinApplicationRecord | null> {
  for (let attempt = 1; attempt <= NOTION_WRITE_RETRY_COUNT; attempt += 1) {
    const result = await createNotionMemberApplication(input)
    if (result) return result
    if (attempt < NOTION_WRITE_RETRY_COUNT) {
      await delay(300 * attempt * attempt)
    }
  }
  return null
}

export async function createJoinApplication(
  input: JoinSubmissionInput
): Promise<JoinApplicationRecord> {
  const existing = await findExistingJoinApplication(input)
  if (existing) {
    return {
      ...existing,
      metadata: {
        ...existing.metadata,
        duplicate_detected: true
      }
    }
  }

  // 优先写入 Notion Members 数据库（Status=Draft，不会出现在前台）
  const notionResult = await createNotionMemberApplicationWithRetry(input)
  if (notionResult) return notionResult

  const client = getSupabaseServerClient()

  if (client) {
    const now = new Date().toISOString()
    const result = await client
      .from('join_applications')
      .insert({
        name: input.name,
        contact: input.contact,
        role: input.role,
        interests: input.interests,
        message: input.message,
        source: input.source,
        status: 'submitted',
        metadata: input.metadata,
        created_at: now,
        updated_at: now,
        last_activity_at: now
      })
      .select('*')
      .single()

    if (result.error) throw result.error

    return normalizeJoinApplicationRecord(result.data)
  }

  const now = new Date().toISOString()
  const record: JoinApplicationRecord = {
    id: randomUUID(),
    name: input.name,
    contact: input.contact,
    role: input.role,
    interests: input.interests,
    message: input.message,
    source: input.source,
    status: 'submitted',
    created_at: now,
    updated_at: now,
    metadata: input.metadata
  }

  const items = await readLocalJoinApplications()
  items.unshift(record)
  await writeLocalJoinApplications(items)
  return record
}

export async function listJoinApplications(): Promise<JoinApplicationRecord[]> {
  const client = getSupabaseServerClient()

  if (client) {
    const result = await client
      .from('join_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (result.error) throw result.error

    return (result.data || []).map(item => normalizeJoinApplicationRecord(item))
  }

  return readLocalJoinApplications()
}

export async function updateJoinApplicationStatus(
  id: string,
  status: JoinApplicationStatus
): Promise<JoinApplicationRecord | null> {
  if (!joinStatusOptions.includes(status)) {
    throw new Error('INVALID_STATUS')
  }

  const client = getSupabaseServerClient()

  if (client) {
    const now = new Date().toISOString()
    const result = await client
      .from('join_applications')
      .update({
        status,
        updated_at: now,
        last_activity_at: now
      })
      .eq('id', id)
      .select('*')
      .single()

    if (result.error) throw result.error
    if (!result.data) return null

    return normalizeJoinApplicationRecord(result.data)
  }

  const items = await readLocalJoinApplications()
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return null

  const existing = items[index]
  if (!existing) return null

  const updated = normalizeJoinApplicationRecord({
    ...existing,
    status,
    updated_at: new Date().toISOString()
  })
  items[index] = updated
  await writeLocalJoinApplications(items)
  return updated
}

export function getJoinExperienceMode(): JoinExperienceMode {
  const configured = process.env.NEXT_PUBLIC_JOIN_FORM_URL?.trim()
  const forced = process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE?.trim()

  if (
    forced === 'external' ||
    forced === 'email' ||
    forced === 'local' ||
    forced === 'database'
  ) {
    return forced
  }
  if (configured) return 'external'
  if (isJoinNotionEnabled()) return 'database'
  if (isJoinDatabaseEnabled()) return 'database'
  return 'local'
}

function getOpsPasswordHash(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export function isOpsPasswordConfigured(): boolean {
  return Boolean(process.env.OPS_ACCESS_PASSWORD?.trim())
}

export function buildOpsSessionCookie(password: string) {
  const value = getOpsPasswordHash(password)
  const parts = [
    `${OPS_COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=2592000'
  ]

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  return parts.join('; ')
}

export function buildOpsLogoutCookie() {
  return `${OPS_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

function readCookieValue(req: IncomingMessage, key: string) {
  const raw = req.headers.cookie || ''
  const chunks = raw.split(';').map(part => part.trim())
  for (const chunk of chunks) {
    if (chunk.startsWith(`${key}=`)) {
      return decodeURIComponent(chunk.slice(key.length + 1))
    }
  }
  return ''
}

export function isOpsAuthorized(req: IncomingMessage): boolean {
  const configured = process.env.OPS_ACCESS_PASSWORD?.trim()
  if (!configured) return false

  const expected = Buffer.from(getOpsPasswordHash(configured))
  const actual = Buffer.from(readCookieValue(req, OPS_COOKIE_NAME))

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
