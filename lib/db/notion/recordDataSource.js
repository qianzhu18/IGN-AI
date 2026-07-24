import BLOG from '@/blog.config'
import {
  findDataSourcePropertyKey,
  readDataSourcePropertyValue
} from './memberDataSource'

function compactCandidateNames(values = []) {
  return [...new Set(values.filter(value => typeof value === 'string' && value.trim()))]
}

function readFirstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return ''
}

function readFirstArray(...values) {
  for (const value of values) {
    if (Array.isArray(value)) return value.filter(Boolean)
    if (typeof value === 'string' && value.trim()) {
      return value
        .split(/[,，、\n]/)
        .map(item => item.trim())
        .filter(Boolean)
    }
  }
  return []
}

function slugifyRecordTitle(title, pageId) {
  const asciiSlug = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (asciiSlug) return asciiSlug

  const stableId = String(pageId || '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
    .slice(-12)

  return `record-${stableId || Date.now()}`
}

function normalizeRecordSlug(rawSlug, title, pageId) {
  const cleaned = readFirstString(rawSlug).replace(/^\/+|\/+$/g, '')

  if (cleaned && !/^https?:\/\//i.test(cleaned)) {
    const parts = cleaned.split('/').filter(Boolean)
    const terminal = parts[parts.length - 1]
    if (terminal) return terminal
  }

  return slugifyRecordTitle(title, pageId)
}

function readOfficialImage(image) {
  if (!image || typeof image !== 'object') return ''
  if (image.type === 'external') return image.external?.url || ''
  if (image.type === 'file') return image.file?.url || ''
  if (image.type === 'emoji') return image.emoji || ''
  return ''
}

export function getRecordDataSourcePropertyCandidates() {
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}

  return {
    title: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_TITLE,
      fieldNames.title,
      'title',
      'Title'
    ]),
    type: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_TYPE,
      fieldNames.type,
      'type',
      'Type'
    ]),
    status: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_STATUS,
      fieldNames.status,
      'status',
      'Status'
    ]),
    slug: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_SLUG,
      fieldNames.slug,
      'slug',
      'Slug'
    ]),
    summary: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_SUMMARY,
      fieldNames.summary,
      'summary',
      'Summary'
    ]),
    tags: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_TAGS,
      fieldNames.tags,
      'tags',
      'Tags'
    ]),
    category: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_CATEGORY,
      fieldNames.category,
      'category',
      'Category'
    ]),
    date: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_DATE,
      fieldNames.date,
      'date',
      'Date'
    ]),
    location: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_LOCATION,
      'location',
      'Location'
    ])
  }
}

export function mapOfficialRecordPage(page, dataSource) {
  const propertyCandidates = getRecordDataSourcePropertyCandidates()

  const getKey = logicalName =>
    findDataSourcePropertyKey(dataSource, propertyCandidates[logicalName] || [])

  const getValue = logicalName => {
    const key = getKey(logicalName)
    return key ? readDataSourcePropertyValue(page?.properties?.[key]) : null
  }

  const title = readFirstString(getValue('title'))
  const rawSlug = readFirstString(getValue('slug'))
  const slug = normalizeRecordSlug(rawSlug, title, page?.id)
  const tags = readFirstArray(getValue('tags'))
  const cover = readFirstString(readOfficialImage(page?.cover))
  const icon = readOfficialImage(page?.icon)

  // Read category (maps to recordType)
  const category = readFirstString(getValue('category'))
  const recordType = category || 'story'

  // Read location
  const location = readFirstString(getValue('location'))

  // Read date property as object (supports start/end for ranges)
  const getDateProperty = logicalName => {
    const key = findDataSourcePropertyKey(
      dataSource,
      propertyCandidates[logicalName] || []
    )
    const prop = key ? page?.properties?.[key] : null
    if (!prop || prop.type !== 'date' || !prop.date) return null
    return {
      start: prop.date.start || '',
      end: prop.date.end || ''
    }
  }

  const dateValue = getDateProperty('date')
  const timelineStart = dateValue?.start || ''
  const timelineEnd = dateValue?.end || ''

  const publishDate = timelineStart
    ? new Date(timelineStart).getTime()
    : new Date(page?.created_time).getTime()

  return {
    id: page.id,
    title,
    slug,
    href: `/records/${slug}`,
    summary: readFirstString(getValue('summary')),
    type: 'Record',
    status: readFirstString(getValue('status'), 'Published'),
    tags,
    publishDate,
    publishDay: timelineStart,
    lastEditedDate: new Date(page?.last_edited_time),
    pageIcon: icon || '',
    pageCover: cover,
    pageCoverThumbnail: cover,
    category,
    location,
    date: {
      start: timelineStart,
      end: timelineEnd
    }
  }
}
