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

function isHttpUrl(value) {
  return /^https?:\/\//i.test(readFirstString(value))
}

function parseJsonObject(value) {
  if (!value || typeof value !== 'string') return {}

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch (error) {
    console.warn('[EVENT-SYNC] Invalid ext JSON:', value)
    return {}
  }
}

function slugifyEventTitle(title, pageId) {
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

function normalizeEventSlug(rawSlug, title, pageId) {
  const cleaned = readFirstString(rawSlug).replace(/^\/+|\/+$/g, '')

  if (cleaned && !/^https?:\/\//i.test(cleaned)) {
    const parts = cleaned.split('/').filter(Boolean)
    const terminal = parts[parts.length - 1]
    if (terminal) return terminal
  }

  return slugifyEventTitle(title, pageId)
}

function readOfficialDate(property) {
  if (!property || property.type !== 'date') return null
  const date = property.date
  if (!date?.start) return null

  return {
    start_date: date.start,
    end_date: date.end || undefined,
    time_zone: date.time_zone || undefined
  }
}

function readOfficialImage(image) {
  if (!image || typeof image !== 'object') return ''
  if (image.type === 'external') return image.external?.url || ''
  if (image.type === 'file') return image.file?.url || ''
  if (image.type === 'emoji') return image.emoji || ''
  return ''
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
    eventStart: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_EVENT_START,
      'event_start',
      'eventStart',
      'Event Start'
    ]),
    eventEnd: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_EVENT_END,
      'event_end',
      'eventEnd',
      'Event End'
    ]),
    location: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_LOCATION,
      'location',
      'Location'
    ]),
    organizerSlugs: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_ORGANIZER_SLUGS,
      'organizer_slugs',
      'organizerSlugs',
      'Organizer Slugs'
    ]),
    registrationUrl: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_REGISTRATION_URL,
      'registration_url',
      'registrationUrl',
      'Registration URL'
    ]),
    registrationQrImage: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_REGISTRATION_QR_IMAGE,
      'registration_qr_image',
      'registrationQrImage',
      'Registration QR Image'
    ]),
    ext: compactCandidateNames([
      process.env.NOTION_EVENTS_PROP_EXT,
      'ext',
      'Ext'
    ])
  }
}

export function mapOfficialEventPage(page, dataSource) {
  const propertyCandidates = getEventDataSourcePropertyCandidates()

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
  const slug = normalizeEventSlug(rawSlug, title, page?.id)
  const dateKey = getKey('date')
  const eventStartKey = getKey('eventStart')
  const eventEndKey = getKey('eventEnd')
  const date =
    readOfficialDate(page?.properties?.[eventStartKey]) ||
    readOfficialDate(page?.properties?.[dateKey]) ||
    {}
  const eventEndDate = readOfficialDate(page?.properties?.[eventEndKey])
  if (eventEndDate?.start_date && !date.end_date) {
    date.end_date = eventEndDate.start_date
  }

  const location = readFirstString(getValue('location'))
  const organizerSlugs = readFirstArray(getValue('organizerSlugs'))
  const registrationUrl = readFirstString(getValue('registrationUrl'))
  const registrationQrImage = readFirstString(getValue('registrationQrImage'))
  const cover = readFirstString(readOfficialImage(page?.cover), ext.cover, ext.coverUrl)
  const icon = readOfficialImage(page?.icon)
  const externalUrl = readFirstString(
    ext.externalUrl,
    ext.external_url,
    ext.eventUrl,
    ext.event_url,
    ext.officialUrl,
    ext.official_url,
    isHttpUrl(rawSlug) ? rawSlug : ''
  )

  const eventExt = {
    ...ext
  }
  if (location && !eventExt.location) eventExt.location = location
  if (organizerSlugs.length > 0 && !eventExt.organizer_slugs) {
    eventExt.organizer_slugs = organizerSlugs
  }
  if (registrationUrl && !eventExt.registrationUrl) {
    eventExt.registrationUrl = registrationUrl
  }
  if (registrationQrImage && !eventExt.registrationQrImage) {
    eventExt.registrationQrImage = registrationQrImage
  }
  if (externalUrl && !eventExt.externalUrl) {
    eventExt.externalUrl = externalUrl
  }

  return {
    id: page.id,
    title,
    slug,
    href: `/events/${slug}`,
    summary: readFirstString(getValue('summary')),
    type: 'Event',
    status: readFirstString(getValue('status'), 'Published'),
    category: readFirstString(getValue('category')),
    tags: readFirstArray(getValue('tags')),
    date,
    publishDate: new Date(date?.start_date || page?.created_time).getTime(),
    publishDay: date?.start_date || '',
    lastEditedDate: new Date(page?.last_edited_time),
    location,
    organizer_slugs: organizerSlugs,
    event_start: date?.start_date || '',
    event_end: date?.end_date || '',
    registrationUrl,
    registrationQrImage,
    externalUrl,
    pageIcon: icon || '',
    pageCover: cover,
    pageCoverThumbnail: cover,
    ext: eventExt
  }
}
