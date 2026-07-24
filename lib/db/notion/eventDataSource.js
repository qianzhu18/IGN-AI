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

function readOfficialImage(image) {
  if (!image || typeof image !== 'object') return ''
  if (image.type === 'external') return image.external?.url || ''
  if (image.type === 'file') return image.file?.url || ''
  if (image.type === 'emoji') return image.emoji || ''
  return ''
}

function normalizeEventSlug(rawSlug, title, pageId) {
  const cleaned = readFirstString(rawSlug).replace(/^\/+|\/+$/g, '')

  if (cleaned && !/^https?:\/\//i.test(cleaned)) {
    const parts = cleaned.split('/').filter(Boolean)
    const terminal = parts[parts.length - 1]
    if (terminal) return terminal
  }

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

  return `event-${stableId || Date.now()}`
}

export function getEventDataSourcePropertyCandidates() {
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}

  return {
    title: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_TITLE,
      fieldNames.title,
      'title',
      'Title'
    ]),
    type: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_TYPE,
      fieldNames.type,
      'type',
      'Type'
    ]),
    status: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_STATUS,
      fieldNames.status,
      'status',
      'Status'
    ]),
    slug: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_SLUG,
      fieldNames.slug,
      'slug',
      'Slug'
    ]),
    summary: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_SUMMARY,
      fieldNames.summary,
      'summary',
      'Summary'
    ]),
    tags: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_TAGS,
      fieldNames.tags,
      'tags',
      'Tags'
    ]),
    category: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_CATEGORY,
      fieldNames.category,
      'category',
      'Category'
    ]),
    date: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_DATE,
      fieldNames.date,
      'date',
      'Date'
    ]),
    location: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_LOCATION,
      'location',
      'Location'
    ]),
    website: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_WEBSITE,
      'website',
      'Website',
      'registrationUrl',
      'registration_url'
    ]),
    event_start: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_START,
      'event_start',
      'Event Start',
      'start_date'
    ]),
    event_end: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_END,
      'event_end',
      'Event End',
      'end_date'
    ])
  }
}

export function mapOfficialEventPage(page, dataSource) {
  const propertyCandidates = getEventDataSourcePropertyCandidates()

  const getValue = logicalName => {
    const key = findDataSourcePropertyKey(
      dataSource,
      propertyCandidates[logicalName] || []
    )
    return key ? readDataSourcePropertyValue(page?.properties?.[key]) : null
  }

  const title = readFirstString(getValue('title'))
  const slug = normalizeEventSlug(getValue('slug'), title, page?.id)
  const tags = readFirstArray(getValue('tags'))
  const cover = readFirstString(readOfficialImage(page?.cover))
  const icon = readOfficialImage(page?.icon)

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
  const dateStart = dateValue?.start || ''
  const dateEnd = dateValue?.end || ''

  // Read event_start and event_end (legacy, for backward compat)
  const eventStartValue = getDateProperty('event_start')
  const eventEndValue = getDateProperty('event_end')
  const eventStart = eventStartValue?.start || dateStart
  const eventEnd = eventEndValue?.start || dateEnd

  const publishDate = eventStart
    ? new Date(eventStart).getTime()
    : new Date(page?.created_time).getTime()

  return {
    id: page.id,
    title,
    slug,
    href: `/events/${slug}`,
    summary: readFirstString(getValue('summary')),
    type: 'Event',
    status: readFirstString(getValue('status'), 'Published'),
    category: readFirstString(getValue('category')),
    tags,
    publishDate,
    publishDay: eventStart || dateStart,
    lastEditedDate: new Date(page?.last_edited_time),
    pageIcon: icon || '',
    pageCover: cover,
    pageCoverThumbnail: cover,
    location: readFirstString(getValue('location')),
    website: readFirstString(getValue('website')),
    date: {
      start: dateStart,
      end: dateEnd
    },
    event_start: eventStart ? { start: eventStart } : null,
    event_end: eventEnd ? { start: eventEnd } : null
  }
}
