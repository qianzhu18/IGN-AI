import BLOG from '@/blog.config'
import { normalizeEventList } from '@/lib/utils/event'
import { extractMemberPathSlug, getPublishedMembers } from '@/lib/utils/member'
import {
  buildSitemapLoc,
  normalizeSitemapBaseUrl,
  normalizeSitemapLocale,
  toSitemapDateString
} from '@/lib/sitemap-utils'

function readSlug(value) {
  if (typeof value !== 'string') return ''
  return (
    value
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean)
      .pop() || ''
  )
}

function getLastmod(item) {
  const date =
    item?.lastEditedDate ||
    item?.lastEditedDay ||
    item?.publishDay ||
    item?.startDate ||
    item?.date?.start
  if (!date) return undefined
  const value = toSitemapDateString(date, '')
  return value || undefined
}

function addField(fields, seen, field) {
  if (!field?.loc || seen.has(field.loc)) return
  seen.add(field.loc)
  fields.push(field)
}

export function buildCommunitySitemapFields({
  link,
  locale,
  allPages = [],
  allMembers = [],
  allEvents = [],
  allRecords = []
} = {}) {
  const baseUrl = normalizeSitemapBaseUrl(link)
  const normalizedLocale = normalizeSitemapLocale(locale)
  const fields = []
  const seen = new Set()
  const addPath = (slug, options = {}) => {
    const loc = buildSitemapLoc({ baseUrl, locale: normalizedLocale, slug })
    if (!loc) return
    addField(fields, seen, { loc, ...options })
  }

  for (const slug of [
    '',
    'events',
    'records',
    'members',
    'join',
    'about',
    'archive',
    'category',
    'tag'
  ]) {
    addPath(slug, {
      changefreq: slug === '' ? 'daily' : 'weekly',
      priority: slug === '' ? '1.0' : '0.8'
    })
  }

  for (const page of Array.isArray(allPages) ? allPages : []) {
    if (page?.status !== BLOG.NOTION_PROPERTY_NAME.status_publish) continue
    if (!page?.slug || ['Member', 'Event', 'Record'].includes(page?.type))
      continue
    const loc = buildSitemapLoc({
      baseUrl,
      locale: normalizedLocale,
      slug: page.slug
    })
    if (!loc) continue
    addField(fields, seen, {
      loc,
      lastmod: getLastmod(page),
      changefreq: 'weekly',
      priority: '0.7'
    })
  }

  for (const member of getPublishedMembers(allMembers)) {
    const slug = extractMemberPathSlug(member?.slug, member?.id)
    if (!slug) continue
    addPath(`members/${slug}`, {
      lastmod: getLastmod(member),
      changefreq: 'monthly',
      priority: '0.6'
    })
  }

  for (const event of normalizeEventList(allEvents)) {
    if (!event?.slug || event?.externalUrl) continue
    addPath(`events/${readSlug(event.slug)}`, {
      lastmod: getLastmod(event),
      changefreq: 'weekly',
      priority: '0.7'
    })
  }

  for (const record of Array.isArray(allRecords) ? allRecords : []) {
    if (
      record?.status &&
      record.status !== BLOG.NOTION_PROPERTY_NAME.status_publish
    )
      continue
    const slug = readSlug(record?.slug)
    if (!slug) continue
    addPath(`records/${slug}`, {
      lastmod: getLastmod(record),
      changefreq: 'weekly',
      priority: '0.7'
    })
  }

  return fields
}

function escapeXml(value) {
  return `${value ?? ''}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function renderSitemapXml(fields = []) {
  const urls = fields
    .filter(field => field?.loc)
    .map(field => {
      const lines = [
        '  <url>',
        `    <loc>${escapeXml(field.loc)}</loc>`,
        field.lastmod
          ? `    <lastmod>${escapeXml(field.lastmod)}</lastmod>`
          : '',
        field.changefreq
          ? `    <changefreq>${escapeXml(field.changefreq)}</changefreq>`
          : '',
        field.priority
          ? `    <priority>${escapeXml(field.priority)}</priority>`
          : '',
        '  </url>'
      ]
      return lines.filter(Boolean).join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
