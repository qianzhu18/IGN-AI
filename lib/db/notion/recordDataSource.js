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

function parseJsonObject(value) {
  if (!value || typeof value !== 'string') return {}

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch (error) {
    console.warn('[RECORD-SYNC] Invalid ext JSON:', value)
    return {}
  }
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
    ext: compactCandidateNames([
      process.env.NOTION_RECORDS_PROP_EXT,
      fieldNames.ext,
      'ext',
      'Ext'
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
  const rawExt = readFirstString(getValue('ext'))
  const ext = parseJsonObject(rawExt)
  const rawSlug = readFirstString(getValue('slug'))
  const slug = normalizeRecordSlug(rawSlug, title, page?.id)
  const tags = readFirstArray(getValue('tags'))
  const cover = readFirstString(readOfficialImage(page?.cover), ext.cover, ext.coverUrl)
  const icon = readOfficialImage(page?.icon)

  const recordExt = {
    ...ext,
    recordType: ext.recordType || ext.record_type || ext.type || 'story',
    dateText: ext.dateText || ext.date_text || '',
    timelineDate: ext.timelineDate || ext.timeline_date || '',
    timelineEndDate: ext.timelineEndDate || ext.timeline_end_date || '',
    dateStatus: ext.dateStatus || ext.date_status || 'unknown',
    location: ext.location || '',
    outcomes: Array.isArray(ext.outcomes) ? ext.outcomes : [],
    cover: ext.cover || ext.coverUrl || '',
    sourceFolder: ext.sourceFolder || ext.source_folder || ''
  }

  const timelineStart = recordExt.timelineDate || ''
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
    ext: recordExt
  }
}
