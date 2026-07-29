import { RESERVED_ROOT_SLUGS, validateReservedSlug } from '@/lib/slug'

import { checksum } from './checksum'
import { notionBlocksToLexical } from './lexical'
import {
  createPropertyReader,
  firstString,
  parseJSON,
  readExternalImage,
  stringList,
  terminalSlug,
} from './properties'
import type {
  MediaCandidate,
  MigrationItem,
  NotionBlock,
  NotionDataSource,
  NotionPage,
  RelationReference,
} from './types'

const common = {
  category: ['category', 'Category'],
  date: ['date', 'Date'],
  eventEnd: ['event_end', 'Event End'],
  eventStart: ['event_start', 'Event Start'],
  ext: ['ext', 'Ext'],
  featured: ['featured', 'Featured'],
  location: ['location', 'Location'],
  slug: ['slug', 'Slug'],
  status: ['status', 'Status'],
  summary: ['summary', 'Summary'],
  tags: ['tags', 'Tags'],
  title: ['title', 'Title'],
  type: ['type', 'Type'],
  website: ['website', 'Website', 'registration_url', 'registrationUrl'],
} as const

const status = (value: unknown) =>
  firstString(value).toLowerCase() === 'published' ? 'published' : 'draft'

const dateRange = (value: unknown) =>
  value && typeof value === 'object'
    ? (value as { end?: string; start?: string })
    : { end: '', start: '' }

const stringFrom = (value: unknown, key: string) =>
  value && typeof value === 'object' && typeof (value as Record<string, unknown>)[key] === 'string'
    ? String((value as Record<string, unknown>)[key])
    : ''

const stableMediaURL = (url: string) => {
  try {
    const parsed = new URL(url)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return url
  }
}

const checksumMedia = (media: MediaCandidate[]) =>
  media.map((candidate) => ({
    field: candidate.field,
    kind: candidate.kind,
    url: stableMediaURL(candidate.url),
  }))

const relation = (
  field: string,
  targetCollection: RelationReference['targetCollection'],
  slugs: string[],
  required = false,
): RelationReference => ({
  field,
  required,
  slugs: [...new Set(slugs.map((slug) => terminalSlug(slug, slug, slug)).filter(Boolean))],
  targetCollection,
})

const recordType = (value: unknown): 'project' | 'recap' | 'resource' | 'story' => {
  const normalized = firstString(value).toLowerCase()
  if (/recap|活动|现场|复盘/.test(normalized)) return 'recap'
  if (/project|项目|作品/.test(normalized)) return 'project'
  if (/resource|观察|资料|洞察/.test(normalized)) return 'resource'
  return 'story'
}

const parseJoinedAt = (value: unknown) => {
  const text = firstString(value)
  if (!text) return undefined
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

export function mapNotionPage(
  page: NotionPage,
  dataSource: NotionDataSource,
  blocks: NotionBlock[],
): MigrationItem | null {
  const read = createPropertyReader(page, dataSource)
  const type = firstString(read(common.type))
  if (!['Event', 'Member', 'Page', 'Post', 'Record'].includes(type)) return null

  const title = firstString(read(common.title))
  const slug = terminalSlug(read(common.slug), title, page.id)
  const summary = firstString(read(common.summary))
  const extValue = read(common.ext)
  const ext = parseJSON(extValue) || {}
  const transformed = notionBlocksToLexical(blocks, firstString(read(['bio']), summary, title))
  const warnings = [...transformed.warnings]
  const errors: string[] = []
  const relations: RelationReference[] = []
  const media = [...transformed.media]
  const cover = readExternalImage(page.cover)

  if (!title) errors.push('Missing required title')
  if (cover) media.push({ field: 'cover', kind: 'cover', url: cover })

  let target: MigrationItem['target']
  let data: Record<string, unknown>

  if (type === 'Member') {
    target = 'members'
    const avatar = firstString(read(['avatar', 'Avatar']))
    if (avatar) media.push({ field: 'avatar', kind: 'image', url: avatar })
    data = {
      _status: status(read(common.status)),
      bio: transformed.editorState,
      featured: read(common.featured) === true,
      headline: summary,
      joinedAt: parseJoinedAt(read(['joinedAtText', 'joined_at_text', 'joinedAt'])),
      quote: firstString(read(['quote', 'Quote'])),
      role: firstString(read(['role', 'Role']), '社区成员'),
      slug,
      socials: {
        github: firstString(read(['social_github', 'github', 'GitHub'])),
        linkedin: firstString(read(['social_linkedin', 'linkedin', 'LinkedIn'])),
        website: firstString(read(common.website)),
        x: firstString(read(['social_x', 'x', 'twitter', 'X'])),
      },
      title,
      verified: read(['verified', 'Verified']) === true,
    }
  } else if (type === 'Event') {
    target = 'events'
    const date = dateRange(read(common.date))
    const start = dateRange(read(common.eventStart)).start || date.start || page.created_time
    const end = dateRange(read(common.eventEnd)).start || date.end || undefined
    const location = firstString(read(common.location), '待确认')
    const organizerSlugs = stringList(
      read(['organizer_slugs', 'organizers']),
      ext.organizer_slugs,
      ext.organizerSlugs,
    )
    const participantSlugs = stringList(ext.participant_slugs, ext.participantSlugs)
    if (organizerSlugs.length) relations.push(relation('organizers', 'members', organizerSlugs))
    if (participantSlugs.length) relations.push(relation('participants', 'members', participantSlugs))
    data = {
      _status: status(read(common.status)),
      content: transformed.editorState,
      endAt: end,
      excerpt: summary || title,
      featured: read(common.featured) === true,
      format: /线上|online/i.test(location) ? 'online' : 'offline',
      location,
      registrationURL: firstString(read(common.website), stringFrom(ext, 'registrationURL')),
      slug,
      startAt: start,
      title,
    }
  } else if (type === 'Record') {
    target = 'records'
    const date = dateRange(read(common.date))
    const eventSlugs = stringList(
      read(['event_slugs', 'relatedEventSlug']),
      ext.relatedEventSlug,
      ext.event_slugs,
    )
    const memberSlugs = stringList(read(['member_slugs']), ext.member_slugs)
    if (eventSlugs.length) relations.push(relation('events', 'events', eventSlugs))
    if (memberSlugs.length) relations.push(relation('members', 'members', memberSlugs))
    data = {
      _status: status(read(common.status)),
      content: transformed.editorState,
      dateStatus: date.start ? 'confirmed' : 'unknown',
      excerpt: summary || title,
      featured: read(common.featured) === true,
      location: firstString(read(common.location)),
      recordType: recordType(read(common.category)),
      slug,
      tags: stringList(read(common.tags)).map((label) => ({ label })),
      timelineDate: date.start || undefined,
      timelineEndDate: date.end || undefined,
      title,
    }
  } else if (type === 'Post') {
    target = 'posts'
    const authorSlugs = stringList(
      read(['author_slugs', 'author_slug', 'authors']),
      ext.author_slugs,
      ext.member_slugs,
    )
    const eventSlugs = stringList(read(['event_slugs']), ext.event_slugs)
    const recordSlugs = stringList(read(['record_slugs']), ext.relatedRecordSlugs)
    relations.push(relation('authors', 'members', authorSlugs, true))
    if (eventSlugs.length) relations.push(relation('events', 'events', eventSlugs))
    if (recordSlugs.length) relations.push(relation('records', 'records', recordSlugs))
    if (!authorSlugs.length) errors.push('Post requires at least one resolvable author slug')
    data = {
      _status: status(read(common.status)),
      categories: stringList(read(common.category)).map((label) => ({ label })),
      content: transformed.editorState,
      excerpt: summary || title,
      featured: read(common.featured) === true,
      publishedAt: dateRange(read(common.date)).start || undefined,
      slug,
      tags: stringList(read(common.tags)).map((label) => ({ label })),
      title,
    }
  } else {
    target = 'pages'
    const slugValidation = validateReservedSlug(slug, RESERVED_ROOT_SLUGS)
    if (slugValidation !== true) errors.push(slugValidation)
    data = {
      _status: status(read(common.status)),
      excerpt: summary,
      layout: [{ blockType: 'richText', content: transformed.editorState }],
      slug,
      title,
    }
  }

  const fingerprint = checksum({ data, media: checksumMedia(media), relations })
  return {
    checksum: fingerprint,
    data,
    errors,
    media,
    relations,
    slug,
    sourceLastEditedAt: page.last_edited_time,
    sourcePageIds: [page.id],
    target,
    warnings,
  }
}

const objectArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    : []

export function mapSiteSettings(pages: NotionPage[], dataSource: NotionDataSource): MigrationItem | null {
  const configs = new Map<string, { page: NotionPage; value: Record<string, unknown> }>()
  for (const page of pages) {
    const read = createPropertyReader(page, dataSource)
    if (firstString(read(common.type)) !== 'Config') continue
    const slug = terminalSlug(read(common.slug), firstString(read(common.title)), page.id)
    const value = parseJSON(read(common.summary))
    if (value) configs.set(slug, { page, value })
  }

  const hero = configs.get('hero')
  const navigation = configs.get('navigation')
  const join = configs.get('join')
  if (!hero && !navigation) return null

  const navItems = objectArray(navigation?.value.items)
    .map((item) => ({ href: firstString(item.href), label: firstString(item.label) }))
    .filter((item) => item.href && item.label)
  const data: Record<string, unknown> = {
    heroStatement: firstString(hero?.value.slogan, 'Ignite before AGI.'),
    intro: firstString(hero?.value.heroSummary, hero?.value.description),
    navigation: navItems,
    primaryCTA: { href: '/join', label: '加入社区' },
    siteName: firstString(hero?.value.name, 'IGN AI'),
  }
  const sources = [hero?.page, navigation?.page, join?.page].filter(
    (page): page is NotionPage => Boolean(page),
  )
  const warnings: string[] = []
  if (!hero) warnings.push('Config:Hero is missing; fallback values used')
  if (!navigation) warnings.push('Config:Navigation is missing; navigation is empty')
  if (join && !join.value) warnings.push('Config:Join could not be parsed')

  return {
    checksum: checksum(data),
    data,
    errors: [],
    media: [],
    relations: [],
    sourceLastEditedAt: sources.map((page) => page.last_edited_time).sort().at(-1) || '',
    sourcePageIds: sources.map((page) => page.id),
    target: 'site-settings',
    warnings,
  }
}
