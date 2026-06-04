import { events as staticEvents } from '@/src/content/events'

const EVENT_STATUSES = new Set([
  'planning',
  'ongoing',
  'recap',
  'open',
  'closed',
  'finished'
])
const EVENT_FORMATS = new Set(['offline', 'online', 'hybrid'])
const EVENT_KINDS = new Set(['hosted', 'cohosted', 'promoted', 'participating'])

function readFirstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
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

function normalizeEventStatus(value) {
  const status = readFirstString(value).toLowerCase()
  return EVENT_STATUSES.has(status) ? status : 'planning'
}

function normalizeEventStatusWithAliases(value) {
  const status = readFirstString(value).toLowerCase()
  const aliases = {
    preparing: 'planning',
    prepare: 'planning',
    draft: 'planning',
    active: 'ongoing',
    live: 'ongoing',
    voting: 'ongoing',
    vote: 'ongoing',
    running: 'ongoing',
    summary: 'recap',
    summarized: 'recap',
    recapped: 'recap',
    review: 'recap',
    done: 'recap'
  }

  return normalizeEventStatus(aliases[status] || status)
}

function normalizeEventFormat(value) {
  const format = readFirstString(value).toLowerCase()
  return EVENT_FORMATS.has(format) ? format : 'offline'
}

function normalizeEventKind(value) {
  const kind = readFirstString(value).toLowerCase()
  if (EVENT_KINDS.has(kind)) return kind

  const aliases = {
    owned: 'hosted',
    organizer: 'hosted',
    organized: 'hosted',
    host: 'hosted',
    partner: 'cohosted',
    partnership: 'cohosted',
    joint: 'cohosted',
    linked: 'cohosted',
    pr: 'promoted',
    promotion: 'promoted',
    publicity: 'promoted',
    media: 'promoted',
    attend: 'participating',
    attended: 'participating',
    participant: 'participating',
    joined: 'participating'
  }

  return aliases[kind] || 'hosted'
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(readFirstString(value))
}

function normalizeContentBlocks(value) {
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const heading = readFirstString(item.heading, item.title)
      const body = readFirstString(item.body, item.content, item.text)
      if (!heading && !body) return null
      return { heading, body }
    })
    .filter(Boolean)
}

function formatDateText(value) {
  const raw = readFirstString(value)
  if (!raw) return ''
  const date = raw.slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  return raw
}

function formatEventDateRange(date) {
  const start = formatDateText(date?.start_date)
  const end = formatDateText(date?.end_date)
  if (!start) return ''
  if (!end || end === start) return start
  return `${start} - ${end}`
}

export function normalizeEventSlugValue(value, title, id) {
  const raw = readFirstString(value).replace(/^\/+|\/+$/g, '')
  if (raw && !isHttpUrl(raw)) {
    const parts = raw.split('/').filter(Boolean)
    const terminal = parts[parts.length - 1]
    if (terminal) return terminal
  }

  const titleSlug = readFirstString(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (titleSlug) return titleSlug
  return readFirstString(id)
}

export function normalizeNotionEvent(event) {
  const ext = event?.ext || {}
  const slug = normalizeEventSlugValue(event?.slug, event?.title, event?.id)
  if (!slug) return null
  const externalUrl = readFirstString(
    event?.externalUrl,
    event?.external_url,
    ext.externalUrl,
    ext.external_url,
    ext.eventUrl,
    ext.event_url,
    ext.officialUrl,
    ext.official_url,
    isHttpUrl(event?.slug) ? event?.slug : ''
  )

  return {
    slug,
    title: readFirstString(event?.title, 'Untitled event'),
    subtitle: readFirstString(event?.summary, ext.subtitle),
    kind: normalizeEventKind(
      ext.kind ||
        ext.relationship ||
        event?.eventKind ||
        event?.kind ||
        (externalUrl ? 'participating' : 'hosted')
    ),
    status: normalizeEventStatusWithAliases(ext.status || event?.eventStatus),
    dateText: readFirstString(
      ext.eventDateText,
      ext.event_date_text,
      ext.dateRange,
      ext.date_range,
      ext.period,
      ext.dateText,
      ext.date,
      formatEventDateRange(event?.date),
      event?.publishDay,
      '待定'
    ),
    location: readFirstString(ext.location, event?.location, '待定'),
    format: normalizeEventFormat(ext.format || event?.format),
    cover: readFirstString(
      event?.pageCoverThumbnail,
      event?.pageCover,
      ext.cover,
      ext.coverUrl,
      '/images/generated/ignite-core.png'
    ),
    coverPosition: readFirstString(
      ext.coverPosition,
      ext.cover_position,
      event?.coverPosition,
      'center'
    ),
    externalUrl,
    excerpt: readFirstString(ext.excerpt, event?.summary, ''),
    tags: readFirstArray(event?.tags, ext.tags),
    registrationUrl: readFirstString(
      ext.registrationUrl,
      ext.registration_url,
      event?.registrationUrl,
      event?.registration_url
    ),
    registrationQrImage: readFirstString(
      ext.registrationQrImage,
      ext.registrationQr,
      ext.registration_qr,
      event?.registrationQrImage,
      event?.registrationQr,
      event?.registration_qr
    ),
    audience: readFirstArray(ext.audience, event?.audience),
    agenda: readFirstArray(ext.agenda, event?.agenda),
    hosts: readFirstArray(
      ext.hosts,
      ext.organizers,
      ext.organizer_slugs,
      event?.hosts,
      event?.organizer_slugs
    ),
    notes: readFirstArray(ext.notes, ext.outcomes, event?.notes),
    content: normalizeContentBlocks(ext.content)
  }
}

export function normalizeEventList(notionEvents = [], fallbackEvents = staticEvents) {
  const normalized = Array.isArray(notionEvents)
    ? notionEvents.map(normalizeNotionEvent).filter(Boolean)
    : []
  return normalized.length > 0 ? normalized : fallbackEvents
}

export function getEventHref(event) {
  return readFirstString(event?.externalUrl) || `/events/${event?.slug || ''}`
}

export function isExternalEvent(event) {
  return Boolean(readFirstString(event?.externalUrl))
}

export function getVisibleUpcomingEvents(events = []) {
  return events.filter(event => event?.status !== 'finished')
}
