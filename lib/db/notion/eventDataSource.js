import BLOG from '@/blog.config'
import {
  findDataSourcePropertyKey,
  readDataSourcePropertyValue
} from './memberDataSource'
import { readOfficialImage } from './officialImage'

function compactCandidateNames(values = []) {
  return [
    ...new Set(
      values.filter(value => typeof value === 'string' && value.trim())
    )
  ]
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
    ]),
    eventStatus: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_EVENT_STATUS,
      'event_status',
      'eventStatus',
      'Event Status'
    ]),
    format: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_FORMAT,
      'event_format',
      'format',
      'Event Format'
    ]),
    publicListing: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_PUBLIC_LISTING,
      'public_listing',
      'publicListing',
      'Public Listing'
    ]),
    registrationQrImage: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_REGISTRATION_QR,
      'registration_qr',
      'registrationQrImage',
      'Registration QR'
    ]),
    coverPosition: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_COVER_POSITION,
      'cover_position',
      'coverPosition',
      'Cover Position'
    ]),
    organizerSlugs: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_ORGANIZER_SLUGS,
      'organizer_slugs',
      'organizerSlugs',
      'Organizer Slugs'
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
  const organizerSlugs = readFirstArray(getValue('organizerSlugs'))
  const cover = readFirstString(readOfficialImage(page?.cover, page?.id))
  const icon = readOfficialImage(page?.icon, page?.id)

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
    cover,
    pageCover: cover,
    pageCoverThumbnail: cover,
    location: readFirstString(getValue('location')),
    website: readFirstString(getValue('website')),
    eventStatus: readFirstString(getValue('eventStatus')),
    format: readFirstString(getValue('format')),
    publicListing: getValue('publicListing') === true,
    registrationQrImage: readFirstString(getValue('registrationQrImage')),
    coverPosition: readFirstString(getValue('coverPosition')),
    organizer_slugs: organizerSlugs,
    date: {
      start: dateStart,
      end: dateEnd
    },
    event_start: eventStart ? { start: eventStart } : null,
    event_end: eventEnd ? { start: eventEnd } : null
  }
}
