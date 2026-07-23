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

export function normalizeRecord(page: BasePage): RecordItem {
  const record: RecordItem = {
    slug: page?.slug ?? '',
    title: page?.title ?? '',
    type: categoryLabelToType(page?.category),
    dateText: '',
    dateStatus: 'unknown',
    cover: page?.pageCoverThumbnail || '',
    excerpt: page?.summary ?? '',
    tags: Array.isArray(page?.tags) ? page.tags : []
  }

  if (page?.id) record.id = page.id

  // Read from top-level date property (Notion date with optional end).
  if (page?.date?.start) record.timelineDate = page.date.start
  if (page?.date?.end) record.timelineEndDate = page.date.end

  // Read from top-level location property.
  if (page?.location) record.location = page.location

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
