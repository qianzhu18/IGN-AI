#!/usr/bin/env node

/*
 * One-time migration for legacy IGNAI Event metadata.
 *
 * Notion is the editing source of truth. This script moves supported values
 * out of `ext` and into first-class Notion properties / the native page cover.
 * It is intentionally dry-run by default. Use --apply only after reviewing the
 * complete plan. Unknown ext keys block clearing so content is never dropped.
 */
const fs = require('fs')
const path = require('path')

const API_BASE = 'https://api.notion.com/v1'
const SITE_ORIGIN = 'https://www.ignai.cn'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'

const CATEGORY_BY_KIND = Object.freeze({
  hosted: '主办',
  cohosted: '联合承办',
  promoted: '协助宣发',
  participating: '参与'
})

const SUPPORTED_EXT_KEYS = new Set([
  'status',
  'kind',
  'format',
  'eventDateText',
  'cover',
  'coverPosition',
  'location',
  'relatedRecordSlugs'
])

const IGNORED_EXT_KEYS = new Set(['eventDateText', 'relatedRecordSlugs'])

function loadEnvFile(filename) {
  if (!filename || !fs.existsSync(filename)) return
  for (const line of fs.readFileSync(filename, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 0) continue
    const key = trimmed.slice(0, index).trim()
    if (!key || process.env[key]) continue
    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function loadProjectEnv() {
  const explicit = process.env.NOTION_ENV_FILE
  const candidates = [
    explicit,
    path.join(process.cwd(), '.env.notion.local'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '..', '..', '.env.notion.local'),
    path.join(process.cwd(), '..', '..', '.env.local'),
    path.join(process.cwd(), '..', '..', '.env')
  ]
  for (const candidate of candidates) loadEnvFile(candidate)
}

function resolveSiteAssetUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return ''
  const value = rawUrl.trim()
  if (/^https?:\/\//i.test(value)) return value
  if (!value.startsWith('/')) return ''
  return new URL(value, SITE_ORIGIN).toString()
}

function planLegacyEventMigration(row) {
  const result = {
    id: row?.id || '',
    slug: row?.slug || '',
    blocked: false,
    changes: {},
    ignoredKeys: [],
    unknownKeys: []
  }

  if (row?.type !== 'Event' || !row?.ext) return result

  let ext
  try {
    ext = JSON.parse(row.ext)
  } catch (error) {
    result.blocked = true
    result.error = `Invalid ext JSON: ${error.message}`
    return result
  }

  if (Array.isArray(ext)) {
    if (ext.length === 0) {
      result.changes.clearExt = true
      return result
    }
    result.blocked = true
    result.error = 'Invalid ext JSON: non-empty arrays require manual review'
    return result
  }

  if (!ext || typeof ext !== 'object') {
    result.blocked = true
    result.error = 'Invalid ext JSON: expected an object'
    return result
  }

  if (Object.keys(ext).length === 0) {
    result.changes.clearExt = true
    return result
  }

  result.unknownKeys = Object.keys(ext)
    .filter(key => !SUPPORTED_EXT_KEYS.has(key))
    .sort()
  result.ignoredKeys = Object.keys(ext)
    .filter(key => IGNORED_EXT_KEYS.has(key))
    .sort()

  const category = CATEGORY_BY_KIND[ext.kind]
  if (category) result.changes.category = category
  if (ext.status) result.changes.eventStatus = String(ext.status)
  if (ext.format) result.changes.eventFormat = String(ext.format)
  if (ext.location) result.changes.location = String(ext.location)
  if (ext.coverPosition)
    result.changes.coverPosition = String(ext.coverPosition)

  const coverUrl = resolveSiteAssetUrl(ext.cover)
  if (!row.cover && coverUrl) {
    result.changes.cover = {
      type: 'external',
      external: { url: coverUrl }
    }
  }

  if (result.unknownKeys.length > 0) {
    result.blocked = true
  } else {
    result.changes.clearExt = true
  }

  return result
}

function text(property) {
  const items = property?.title || property?.rich_text || []
  return items
    .map(item => item?.plain_text || item?.text?.content || '')
    .join('')
    .trim()
}

function value(property) {
  if (!property) return ''
  if (property.type === 'title' || property.type === 'rich_text')
    return text(property)
  if (property.type === 'select') return property.select?.name || ''
  if (property.type === 'status') return property.status?.name || ''
  if (property.type === 'url') return property.url || ''
  if (property.type === 'checkbox') return Boolean(property.checkbox)
  return ''
}

function findProperty(dataSource, name) {
  if (dataSource.properties?.[name]) {
    return { key: name, schema: dataSource.properties[name] }
  }
  for (const [key, schema] of Object.entries(dataSource.properties || {})) {
    if (schema?.name === name) return { key, schema }
  }
  throw new Error(`Missing Notion property: ${name}`)
}

function writeProperty(schema, rawValue) {
  if (schema.type === 'rich_text') {
    return rawValue === ''
      ? { rich_text: [] }
      : { rich_text: [{ text: { content: String(rawValue) } }] }
  }
  if (schema.type === 'select') {
    return rawValue === ''
      ? { select: null }
      : { select: { name: String(rawValue) } }
  }
  if (schema.type === 'status') {
    return rawValue === ''
      ? { status: null }
      : { status: { name: String(rawValue) } }
  }
  throw new Error(`Unsupported migration property type: ${schema.type}`)
}

function slugFromPage(page, fields) {
  return (
    value(page.properties?.[fields.slug.key])
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean)
      .pop() || ''
  )
}

function normalizePage(page, fields) {
  return {
    id: page.id,
    type: value(page.properties?.[fields.type.key]),
    slug: slugFromPage(page, fields),
    category: value(page.properties?.[fields.category.key]),
    eventStatus: value(page.properties?.[fields.eventStatus.key]),
    eventFormat: value(page.properties?.[fields.eventFormat.key]),
    location: value(page.properties?.[fields.location.key]),
    coverPosition: value(page.properties?.[fields.coverPosition.key]),
    ext: value(page.properties?.[fields.ext.key]),
    cover: page.cover || null
  }
}

function buildPatch(plan, fields) {
  const properties = {}
  const propertyChanges = [
    ['category', 'category'],
    ['eventStatus', 'eventStatus'],
    ['eventFormat', 'eventFormat'],
    ['location', 'location'],
    ['coverPosition', 'coverPosition']
  ]
  for (const [changeName, fieldName] of propertyChanges) {
    if (plan.changes[changeName] === undefined) continue
    const field = fields[fieldName]
    properties[field.key] = writeProperty(
      field.schema,
      plan.changes[changeName]
    )
  }
  if (plan.changes.clearExt) {
    properties[fields.ext.key] = writeProperty(fields.ext.schema, '')
  }

  const patch = { properties }
  if (plan.changes.cover) patch.cover = plan.changes.cover
  return patch
}

async function run() {
  loadProjectEnv()
  const token =
    process.env.NOTION_API_TOKEN || process.env.NOTION_ACCESS_TOKEN || ''
  const dataSourceId =
    process.env.NOTION_CONTENT_DATA_SOURCE_ID ||
    process.env.NOTION_RECORDS_DATA_SOURCE_ID ||
    process.env.NOTION_EVENTS_DATA_SOURCE_ID ||
    process.env.NOTION_MEMBERS_DATA_SOURCE_ID ||
    ''
  const apply = process.argv.includes('--apply')

  if (!token) throw new Error('Missing NOTION_API_TOKEN')
  if (!dataSourceId) throw new Error('Missing a NOTION_*_DATA_SOURCE_ID')

  async function notion(pathname, options = {}) {
    const response = await fetch(`${API_BASE}${pathname}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    })
    const body = await response.text()
    const data = body ? JSON.parse(body) : {}
    if (!response.ok) {
      throw new Error(
        `Notion ${options.method || 'GET'} ${pathname} failed (${response.status}): ${data.message || body}`
      )
    }
    return data
  }

  const dataSource = await notion(`/data_sources/${dataSourceId}`)
  const fields = {
    type: findProperty(dataSource, 'type'),
    slug: findProperty(dataSource, 'slug'),
    category: findProperty(dataSource, 'category'),
    eventStatus: findProperty(dataSource, 'event_status'),
    eventFormat: findProperty(dataSource, 'event_format'),
    location: findProperty(dataSource, 'location'),
    coverPosition: findProperty(dataSource, 'cover_position'),
    ext: findProperty(dataSource, 'ext')
  }

  const pages = []
  let cursor = null
  do {
    const query = { page_size: 100 }
    if (cursor) query.start_cursor = cursor
    const response = await notion(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(query)
    })
    pages.push(...(response.results || []))
    cursor = response.has_more ? response.next_cursor : null
  } while (cursor)

  const plans = pages
    .map(page => planLegacyEventMigration(normalizePage(page, fields)))
    .filter(plan => plan.blocked || Object.keys(plan.changes).length > 0)

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        totalPages: pages.length,
        planned: plans.map(plan => ({
          id: plan.id,
          slug: plan.slug,
          blocked: plan.blocked,
          changes: plan.changes,
          ignoredKeys: plan.ignoredKeys,
          unknownKeys: plan.unknownKeys,
          error: plan.error || null
        }))
      },
      null,
      2
    )
  )

  const blocked = plans.filter(plan => plan.blocked)
  if (blocked.length > 0) {
    throw new Error(
      `Blocked by unsafe ext data: ${blocked.map(plan => plan.slug || plan.id).join(', ')}`
    )
  }
  if (!apply) return

  for (const plan of plans) {
    await notion(`/pages/${plan.id}`, {
      method: 'PATCH',
      body: JSON.stringify(buildPatch(plan, fields))
    })
    console.log(`applied event migration: ${plan.slug}`)
  }

  for (const plan of plans) {
    const updated = normalizePage(await notion(`/pages/${plan.id}`), fields)
    if (updated.ext) {
      throw new Error(`Verification failed: ext is not empty for ${plan.slug}`)
    }
    if (plan.changes.cover && !updated.cover) {
      throw new Error(`Verification failed: cover is missing for ${plan.slug}`)
    }
    for (const field of [
      'category',
      'eventStatus',
      'eventFormat',
      'location',
      'coverPosition'
    ]) {
      if (
        plan.changes[field] !== undefined &&
        updated[field] !== plan.changes[field]
      ) {
        throw new Error(
          `Verification failed: ${field} mismatch for ${plan.slug}`
        )
      }
    }
    console.log(`verified event migration: ${plan.slug}`)
  }
}

module.exports = {
  CATEGORY_BY_KIND,
  buildPatch,
  planLegacyEventMigration,
  resolveSiteAssetUrl
}

if (require.main === module) {
  run().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}
