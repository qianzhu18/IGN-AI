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
const EVENT_COVER_FALLBACKS = {
  '2050-community-meetup-2026':
    '/images/activity-records/2050-youth-gathering.webp',
  'datawhale-campus-promotion-2026':
    '/images/activity-records/datawhale-campus-promo.webp',
  'guanchai-changli-ai-garden-2026':
    '/images/activity-records/guanchai-changli-ai-garden.webp',
  'guanchai-ai-product-manager-camp-2026':
    '/images/activity-records/guanchai-ai-pm-camp.webp',
  'lev0-minicamp-hackathon-2026':
    '/images/activity-records/lev0-minicamp-hackathon-award.webp',
  'malangshan-ai-agent-forum-2026':
    '/images/community-evidence/05-malangshan-ai-agent-forum.webp',
  'sanrenxing-ai-changsha-2026':
    '/images/activity-records/sanrenxing-ai-changsha-2026.webp',
  'zhijisong-ai-skillathon-2026':
    '/images/activity-records/zhijisong-minicamp-changsha-2026.webp',
  'zhijisong-minicamp-changsha-2026':
    '/images/activity-records/zhijisong-minicamp-changsha-2026.webp'
}

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
      const media = Array.isArray(item.media)
        ? item.media
            .map(asset => {
              if (!asset || typeof asset !== 'object') return null
              const src = readFirstString(asset.src, asset.url)
              if (!src) return null
              return {
                src,
                alt: readFirstString(asset.alt),
                caption: readFirstString(asset.caption),
                orientation:
                  readFirstString(asset.orientation) === 'portrait'
                    ? 'portrait'
                    : undefined
              }
            })
            .filter(Boolean)
        : []
      return { heading, body, media }
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

export function getEventCoverFallback(event) {
  const slug = normalizeEventSlugValue(event?.slug, event?.title, event?.id)
  return (
    EVENT_COVER_FALLBACKS[slug] ||
    '/images/activity-records/geekathon-community-launch.webp'
  )
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
    id: event?.id,
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
    status: normalizeEventStatusWithAliases(
      ext.status || event?.eventStatus || event?.status
    ),
    dateText: readFirstString(
      ext.eventDateText,
      ext.event_date_text,
      ext.dateRange,
      ext.date_range,
      ext.period,
      ext.dateText,
      ext.date,
      event?.dateText,
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
      getEventCoverFallback({ slug, title: event?.title, id: event?.id })
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
    publicListing: event?.publicListing === true,
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
    relatedRecordSlugs: readFirstArray(
      ext.relatedRecordSlugs,
      ext.related_record_slugs,
      ext.relatedRecordSlug,
      ext.related_record_slug
    )
      .map(value =>
        readFirstString(value)
          .replace(/^\/+|\/+$/g, '')
          .split('/')
          .filter(Boolean)
          .pop()
      )
      .filter(Boolean),
    content: normalizeContentBlocks(ext.content || event?.content)
  }
}

export function normalizeEventList(notionEvents = []) {
  if (!Array.isArray(notionEvents)) return []

  // Event 的公开内容只由 Notion 的 Published 行决定。不要把仓库中的历史
  // 示例数据混进运行时结果，否则后台无法成为唯一事实源。
  return notionEvents.map(normalizeNotionEvent).filter(Boolean)
}

export function getEventHref(event) {
  return readFirstString(event?.externalUrl) || `/events/${event?.slug || ''}`
}

export function isExternalEvent(event) {
  return Boolean(readFirstString(event?.externalUrl))
}

function isPastEventDate(event, now = new Date()) {
  const dateSource = readFirstString(event?.eventStart, event?.dateText)
  const match = dateSource.match(/(20\d{2})\D+(\d{1,2})\D+(\d{1,2})/)
  if (!match) return false

  const [, year, month, day] = match
  const eventDate = new Date(Number(year), Number(month) - 1, Number(day))
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return eventDate < today
}

export function isMockEvent(event) {
  // 保留这个兼容导出，避免第三方主题或旧代码调用时崩溃；不再基于本地 slug
  // 黑名单隐藏任何一条已发布的 Notion 活动。
  return false
}

export function isPublicUpcomingEvent(event, now = new Date()) {
  if (!event) return false
  if (!['planning', 'open', 'ongoing'].includes(event.status)) return false
  if (isPastEventDate(event, now)) return false
  if (event.registrationUrl || event.registrationQrImage) return true
  return (
    event.publicListing === true &&
    ['planning', 'ongoing'].includes(event.status)
  )
}

export function getVisibleUpcomingEvents(events = []) {
  return events.filter(event => isPublicUpcomingEvent(event))
}
