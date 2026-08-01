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
  links?: Array<{ label: string; href: string }>
}

export const recordTypeLabel: Record<RecordType, string> = {
  recap: '活动现场',
  story: '社区故事',
  resource: '社区观察',
  project: '项目与见面'
}

function categoryLabelToType(label: string | undefined): RecordType {
  const map: Record<string, RecordType> = {
    活动现场: 'recap',
    社区故事: 'story',
    社区观察: 'resource',
    项目与见面: 'project'
  }
  return map[label || ''] || 'story'
}

function formatRecordDateRange(start?: string, end?: string): string {
  if (!start) return ''
  if (!end || end === start) return start
  return `${start} – ${end}`
}

function readStringArray(...values: unknown[]): string[] {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === 'string')
        .map(item => item.trim())
        .filter(Boolean)
    }
    if (typeof value === 'string' && value.trim()) {
      return value
        .split(/[,，、\n]/)
        .map(item => item.trim())
        .filter(Boolean)
    }
  }
  return []
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
  const start = page?.date?.start
  const end = page?.date?.end
  const record: RecordItem = {
    slug: page?.slug ?? '',
    title: page?.title ?? '',
    type: categoryLabelToType(page?.category),
    dateText: formatRecordDateRange(start, end),
    dateStatus: start ? 'confirmed' : 'unknown',
    cover: page?.cover || page?.pageCoverThumbnail || '',
    excerpt: page?.summary ?? '',
    tags: Array.isArray(page?.tags) ? page.tags : []
  }

  if (page?.id) record.id = page.id

  // Read from top-level date property (Notion date with optional end).
  if (start) record.timelineDate = start
  if (end) record.timelineEndDate = end

  // Read from top-level location property.
  if (page?.location) record.location = page.location

  const relatedEventSlugs = readStringArray(
    page?.relatedEventSlugs,
    page?.relatedEventSlug
  )
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
