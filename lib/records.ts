import type { BasePage } from '@/lib/site/site.types'

export type RecordType = 'recap' | 'story' | 'resource' | 'project'

export type RecordDateStatus = 'confirmed' | 'approximate' | 'unknown'

export type RecordMedia = {
  src: string
  alt: string
  caption: string
  orientation?: 'portrait'
}

export type RecordItem = {
  id?: string
  slug: string
  title: string
  type: RecordType
  dateText: string
  timelineDate?: string
  timelineEndDate?: string
  dateStatus: RecordDateStatus
  location?: string
  cover: string
  excerpt: string
  outcomes?: string[]
  tags: string[]
  relatedEventSlugs?: string[]
  content: Array<{ heading: string; body: string; media?: RecordMedia[] }>
  links?: Array<{ label: string; href: string }>
}

export const recordTypeLabel: Record<RecordType, string> = {
  recap: '活动现场',
  story: '社区故事',
  resource: '社区观察',
  project: '项目与见面'
}

type RecordExt = {
  recordType?: string
  dateText?: string
  timelineDate?: string
  timelineEndDate?: string
  dateStatus?: string
  location?: string
  outcomes?: unknown[]
  cover?: string
  sourceFolder?: string
  relatedEventSlug?: string
  relatedEventSlugs?: unknown[]
}

function asRecordType(value: unknown): RecordType {
  if (
    value === 'recap' ||
    value === 'story' ||
    value === 'resource' ||
    value === 'project'
  ) {
    return value
  }
  return 'story'
}

function asDateStatus(value: unknown): RecordDateStatus {
  if (value === 'confirmed' || value === 'approximate' || value === 'unknown') {
    return value
  }
  return 'unknown'
}

function asStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const filtered = value.filter(
      (v): v is string => typeof v === 'string' && v.trim().length > 0
    )
    return filtered.length > 0 ? filtered : undefined
  }
  if (typeof value === 'string') {
    const values = value
      .split(/[,，、\n]/)
      .map(item => item.trim())
      .filter(Boolean)
    return values.length > 0 ? values : undefined
  }
  return undefined
}

function normalizeRelatedSlug(value: string): string {
  return (
    value
      .trim()
      .replace(/^https?:\/\/[^/]+/i, '')
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean)
      .pop() || ''
  )
}

export function normalizeRecord(page: BasePage): RecordItem {
  const ext = (page?.ext ?? {}) as RecordExt

  const record: RecordItem = {
    slug: page?.slug ?? '',
    title: page?.title ?? '',
    type: asRecordType(ext.recordType),
    dateText: ext.dateText ?? '',
    dateStatus: asDateStatus(ext.dateStatus),
    cover: page?.pageCoverThumbnail || ext.cover || '',
    excerpt: page?.summary ?? '',
    tags: Array.isArray(page?.tags) ? page.tags : [],
    content: []
  }

  if (page?.id) record.id = page.id
  if (ext.timelineDate) record.timelineDate = ext.timelineDate
  if (ext.timelineEndDate) record.timelineEndDate = ext.timelineEndDate
  if (ext.location) record.location = ext.location
  const outcomes = asStringArray(ext.outcomes)
  if (outcomes) record.outcomes = outcomes
  const relatedEventSlugs = [
    ...(asStringArray(ext.relatedEventSlugs) || []),
    ...(asStringArray(ext.relatedEventSlug) || [])
  ]
    .map(normalizeRelatedSlug)
    .filter(Boolean)
  if (relatedEventSlugs.length > 0) {
    record.relatedEventSlugs = Array.from(new Set(relatedEventSlugs))
  }

  return record
}

export function sortRecordsByTimeline(items: RecordItem[] = []): RecordItem[] {
  return [...items].sort((left, right) => {
    if (!left.timelineDate && !right.timelineDate) return 0
    if (!left.timelineDate) return 1
    if (!right.timelineDate) return -1
    return right.timelineDate.localeCompare(left.timelineDate)
  })
}

export function getAllRecords(allRecords: BasePage[] = []): RecordItem[] {
  return sortRecordsByTimeline(allRecords.map(normalizeRecord))
}

export function getFeaturedRecords(
  allRecords: BasePage[] = [],
  limit = 3
): RecordItem[] {
  return sortRecordsByTimeline(allRecords.map(normalizeRecord))
    .filter(record => record.timelineDate)
    .slice(0, limit)
}

export function getRecordBySlug(
  allRecords: BasePage[] = [],
  slug: string
): RecordItem | null {
  const normalized = allRecords.map(normalizeRecord)
  return normalized.find(record => record.slug === slug) ?? null
}
