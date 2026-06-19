/**
 * 文章相关工具
 * 此处只能放客户端支持的代码
 */
import BLOG from '@/blog.config'
import { isHttpLink } from '.'
import { siteConfig } from '@/lib/config'
import { uploadDataToAlgolia } from '../plugins/algolia'
import { getPageContentText } from '@/lib/db/notion/getPageContentText'
import { getPageTableOfContents } from '../db/notion/getPageTableOfContents'
import { countWords } from '../plugins/wordCount'
import {
  getEventHref,
  normalizeEventSlugValue,
  normalizeNotionEvent
} from '@/lib/utils/event'

/**
 * 获取文章的关联推荐文章列表，目前根据标签关联性筛选
 * @param post
 * @param {*} allPosts
 * @param {*} count
 * @returns
 */
export function getRecommendPost(post, allPosts, count = 6) {
  let recommendPosts = []
  const postIds = []
  const currentTags = post?.tags || []
  for (let i = 0; i < allPosts.length; i++) {
    const p = allPosts[i]
    if (p.id === post.id || p.type.indexOf('Post') < 0) {
      continue
    }

    for (let j = 0; j < currentTags.length; j++) {
      const t = currentTags[j]
      if (postIds.indexOf(p.id) > -1) {
        continue
      }
      if (p.tags && p.tags.indexOf(t) > -1) {
        recommendPosts.push(p)
        postIds.push(p.id)
      }
    }
  }

  if (recommendPosts.length > count) {
    recommendPosts = recommendPosts.slice(0, count)
  }
  return recommendPosts
}

export function getMemberPagePath(member) {
  const slug = member?.slug || member?.href || member?.id || ''
  const path = String(slug).replace(/^\/+/, '')

  if (!path) return '/members'
  if (path.startsWith('members/')) return `/${path}`

  const terminal = path.split('/').filter(Boolean).pop()
  return terminal ? `/members/${terminal}` : '/members'
}

export function resolveAuthorsForPost(post, allMembers = []) {
  if (!post || !Array.isArray(allMembers) || allMembers.length === 0) {
    return []
  }

  const explicitSlugs = collectAuthorSlugCandidates(post)
  const nameCandidates = collectAuthorNameCandidates(post)
  const membersByKey = createMemberLookup(allMembers)
  const seenIds = new Set()
  const resolved = []

  const tryAddMember = candidate => {
    const member = membersByKey.get(normalizeLookupKey(candidate))
    if (!member?.id || seenIds.has(member.id)) return

    seenIds.add(member.id)
    resolved.push({
      id: member.id,
      title: member.title,
      slug: member.slug,
      href: getMemberPagePath(member),
      role: member.role,
      avatar:
        member.avatar ||
        member.pageIcon ||
        member.pageCoverThumbnail ||
        member.pageCover ||
        '/avatar.svg'
    })
  }

  explicitSlugs.forEach(tryAddMember)
  nameCandidates.forEach(tryAddMember)

  return resolved
}

export function resolveRelatedMembersForPost(
  post,
  allMembers = [],
  seedMembers = []
) {
  if (!post || !Array.isArray(allMembers) || allMembers.length === 0) {
    return normalizeResolvedMembers(seedMembers)
  }

  const slugCandidates = collectRelatedMemberSlugCandidates(post)
  const nameCandidates = collectRelatedMemberNameCandidates(post)
  const membersByKey = createMemberLookup(allMembers)
  const seenIds = new Set()
  const resolved = []

  const addResolvedMember = member => {
    if (!member) return
    const id = member.id || member.slug || member.href || member.title
    if (!id || seenIds.has(id)) return

    seenIds.add(id)
    resolved.push(toResolvedMember(member))
  }

  normalizeResolvedMembers(seedMembers).forEach(addResolvedMember)

  const tryAddMember = candidate => {
    const member = membersByKey.get(normalizeLookupKey(candidate))
    addResolvedMember(member)
  }

  slugCandidates.forEach(tryAddMember)
  nameCandidates.forEach(tryAddMember)

  return resolved
}

export function resolveRelatedEventsForPost(post, allEvents = []) {
  if (!post || !Array.isArray(allEvents) || allEvents.length === 0) {
    return []
  }

  const slugCandidates = collectRelatedEventSlugCandidates(post)
  const nameCandidates = collectRelatedEventNameCandidates(post)
  const eventsByKey = createEventLookup(allEvents)
  const seenIds = new Set()
  const resolved = []

  const tryAddEvent = candidate => {
    const normalizedCandidate = normalizeEventLookupKey(candidate)
    const slugCandidate = normalizeEventLookupKey(
      normalizeEventSlugValue(candidate)
    )
    const event =
      eventsByKey.get(normalizedCandidate) || eventsByKey.get(slugCandidate)
    if (!event) return

    const id = event.id || event.slug || event.href || event.title
    if (!id || seenIds.has(id)) return

    seenIds.add(id)
    resolved.push(event)
  }

  slugCandidates.forEach(tryAddEvent)
  nameCandidates.forEach(tryAddEvent)

  return resolved
}

export function getMemberAuthoredPosts(member, allPages = []) {
  if (!member?.id || !Array.isArray(allPages) || allPages.length === 0) {
    return []
  }

  return allPages.filter(page => {
    if (page?.type !== 'Post' || page?.status !== 'Published') {
      return false
    }

    const authors = Array.isArray(page?.authors) ? page.authors : []
    return authors.some(author => author?.id === member.id)
  })
}

export function isPasswordProtectedPost(post) {
  return Boolean(`${post?.password || ''}`.trim())
}

export function redactPasswordProtectedSummary(post) {
  if (!post || !isPasswordProtectedPost(post)) return post

  return {
    ...post,
    summary: ''
  }
}

function collectAuthorSlugCandidates(post) {
  const directCandidates = [
    post?.author_slug,
    post?.authorSlug,
    post?.author_slugs,
    post?.authorSlugs,
    post?.ext?.author_slug,
    post?.ext?.authorSlug,
    post?.ext?.author_slugs,
    post?.ext?.authorSlugs
  ]

  return flattenStringCandidates(directCandidates).map(normalizeAuthorSlug)
}

function collectAuthorNameCandidates(post) {
  const rawCandidates = [post?.author, post?.authors, post?.ext?.author, post?.ext?.authors]
  return flattenStringCandidates(rawCandidates).map(normalizeLookupKey)
}

function collectRelatedMemberSlugCandidates(post) {
  const directCandidates = [
    post?.member_slug,
    post?.memberSlug,
    post?.member_slugs,
    post?.memberSlugs,
    post?.related_member_slug,
    post?.relatedMemberSlug,
    post?.related_member_slugs,
    post?.relatedMemberSlugs,
    post?.participant_slugs,
    post?.participantSlugs,
    post?.speaker_slugs,
    post?.speakerSlugs,
    post?.ext?.member_slug,
    post?.ext?.memberSlug,
    post?.ext?.member_slugs,
    post?.ext?.memberSlugs,
    post?.ext?.related_member_slug,
    post?.ext?.relatedMemberSlug,
    post?.ext?.related_member_slugs,
    post?.ext?.relatedMemberSlugs,
    post?.ext?.participant_slugs,
    post?.ext?.participantSlugs,
    post?.ext?.speaker_slugs,
    post?.ext?.speakerSlugs
  ]

  return flattenStringCandidates(directCandidates).map(normalizeAuthorSlug)
}

function collectRelatedMemberNameCandidates(post) {
  const directCandidates = [
    post?.member,
    post?.members,
    post?.related_member,
    post?.relatedMember,
    post?.related_members,
    post?.relatedMembers,
    post?.participant,
    post?.participants,
    post?.speaker,
    post?.speakers,
    post?.ext?.member,
    post?.ext?.members,
    post?.ext?.related_member,
    post?.ext?.relatedMember,
    post?.ext?.related_members,
    post?.ext?.relatedMembers,
    post?.ext?.participant,
    post?.ext?.participants,
    post?.ext?.speaker,
    post?.ext?.speakers
  ]

  return flattenStringCandidates(directCandidates).map(normalizeLookupKey)
}

function collectRelatedEventSlugCandidates(post) {
  const directCandidates = [
    post?.event_slug,
    post?.eventSlug,
    post?.event_slugs,
    post?.eventSlugs,
    post?.related_event_slug,
    post?.relatedEventSlug,
    post?.related_event_slugs,
    post?.relatedEventSlugs,
    post?.ext?.event_slug,
    post?.ext?.eventSlug,
    post?.ext?.event_slugs,
    post?.ext?.eventSlugs,
    post?.ext?.related_event_slug,
    post?.ext?.relatedEventSlug,
    post?.ext?.related_event_slugs,
    post?.ext?.relatedEventSlugs
  ]

  return flattenStringCandidates(directCandidates).map(normalizeEventSlugKey)
}

function collectRelatedEventNameCandidates(post) {
  const directCandidates = [
    post?.event,
    post?.events,
    post?.event_title,
    post?.eventTitle,
    post?.event_titles,
    post?.eventTitles,
    post?.related_event,
    post?.relatedEvent,
    post?.related_events,
    post?.relatedEvents,
    post?.ext?.event,
    post?.ext?.events,
    post?.ext?.event_title,
    post?.ext?.eventTitle,
    post?.ext?.event_titles,
    post?.ext?.eventTitles,
    post?.ext?.related_event,
    post?.ext?.relatedEvent,
    post?.ext?.related_events,
    post?.ext?.relatedEvents
  ]

  return flattenStringCandidates(directCandidates).map(normalizeEventLookupKey)
}

function flattenStringCandidates(values) {
  const result = []

  const pushValue = value => {
    if (Array.isArray(value)) {
      value.forEach(pushValue)
      return
    }

    if (typeof value === 'string' && value.trim()) {
      value
        .split(/[,，、\n]/)
        .map(item => item.trim())
        .filter(Boolean)
        .forEach(item => result.push(item))
      return
    }

    if (value && typeof value === 'object') {
      [
        value.id,
        value.slug,
        value.href,
        value.title,
        value.name,
        value.label
      ].forEach(pushValue)
    }
  }

  values.forEach(pushValue)

  return [...new Set(result)]
}

function createMemberLookup(allMembers) {
  const map = new Map()

  allMembers.forEach(member => {
    const keys = [
      member?.id,
      member?.title,
      member?.slug,
      member?.href,
      member?.author_slug,
      member?.authorSlug,
      member?.ext?.author_slug,
      member?.ext?.authorSlug
    ]

    keys
      .map(value => normalizeLookupKey(value))
      .filter(Boolean)
      .forEach(key => {
        if (!map.has(key)) {
          map.set(key, member)
        }
      })

    const terminalSlug = normalizeAuthorSlug(member?.slug || member?.href)
    if (terminalSlug && !map.has(terminalSlug)) {
      map.set(terminalSlug, member)
    }
  })

  return map
}

function createEventLookup(allEvents) {
  const map = new Map()

  allEvents.forEach(event => {
    const normalized = normalizeNotionEvent(event) || event
    if (!normalized) return

    const resolved = toResolvedEvent(event, normalized)
    const keys = [
      event?.id,
      event?.title,
      event?.slug,
      event?.href,
      event?.externalUrl,
      event?.external_url,
      normalized?.title,
      normalized?.slug,
      normalized?.externalUrl,
      getEventHref(normalized)
    ]

    keys
      .flatMap(value => [
        normalizeEventLookupKey(value),
        normalizeEventSlugKey(value)
      ])
      .filter(Boolean)
      .forEach(key => {
        if (!map.has(key)) {
          map.set(key, resolved)
        }
      })
  })

  return map
}

function normalizeResolvedMembers(members) {
  return Array.isArray(members) ? members.map(toResolvedMember).filter(Boolean) : []
}

function toResolvedMember(member) {
  if (!member) return null

  return {
    id: member.id,
    title: member.title,
    slug: member.slug,
    href: member.href || getMemberPagePath(member),
    role: member.role,
    avatar:
      member.avatar ||
      member.pageIcon ||
      member.pageCoverThumbnail ||
      member.pageCover ||
      '/avatar.svg'
  }
}

function toResolvedEvent(event, normalized = normalizeNotionEvent(event)) {
  if (!event || !normalized) return null

  return {
    id: event.id,
    title: normalized.title,
    slug: normalized.slug,
    href: getEventHref(normalized),
    status: normalized.status,
    kind: normalized.kind,
    dateText: normalized.dateText,
    location: normalized.location,
    externalUrl: normalized.externalUrl,
    cover: normalized.cover
  }
}

function normalizeAuthorSlug(value) {
  const normalized = normalizeLookupKey(value)
  if (!normalized) return ''
  return normalized.split('/').filter(Boolean).pop() || normalized
}

function normalizeEventSlugKey(value) {
  const raw = normalizeEventLookupKey(value)
  if (!raw) return ''

  if (/^https?:\/\//i.test(raw)) return raw
  return raw.split('/').filter(Boolean).pop() || raw
}

function normalizeEventLookupKey(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function normalizeLookupKey(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

/**
 * 确认slug中不包含 / 符号
 * @param {*} row
 * @returns
 */
export function checkSlugHasNoSlash(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (
    (slug.match(/\//g) || []).length === 0 &&
    !isHttpLink(slug) &&
    row.type.indexOf('Menu') < 0
  )
}

/**
 * 检查url中包含一个  /
 * @param {*} row
 * @returns
 */
export function checkSlugHasOneSlash(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (
    (slug.match(/\//g) || []).length === 1 &&
    !isHttpLink(slug) &&
    row.type.indexOf('Menu') < 0
  )
}

/**
 * 检查url中包含两个及以上的  /
 * @param {*} row
 * @returns
 */
export function checkSlugHasMorThanTwoSlash(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (
    (slug.match(/\//g) || []).length >= 2 &&
    row.type.indexOf('Menu') < 0 &&
    !isHttpLink(slug)
  )
}


/**
 * 获取文章摘要
 * @param props
 * @param pageContentText
 * @returns {Promise<void>}
 */
async function getPageAISummary(props, pageContentText) {
  const aiSummaryAPI = siteConfig('AI_SUMMARY_API')
  if (aiSummaryAPI) {
    const post = props.post
    const cacheKey = `ai_summary_${post.id}`
    let aiSummary = await getDataFromCache(cacheKey)
    if (aiSummary) {
      props.post.aiSummary = aiSummary
    } else {
      const aiSummaryKey = siteConfig('AI_SUMMARY_KEY')
      const aiSummaryCacheTime = siteConfig('AI_SUMMARY_CACHE_TIME')
      const wordLimit = siteConfig('AI_SUMMARY_WORD_LIMIT', '1000')
      let content = ''
      for (let heading of post.toc) {
        content += heading.text + ' '
      }
      content += pageContentText
      const combinedText = post.title + ' ' + content
      const truncatedText = combinedText.slice(0, wordLimit)
      aiSummary = await getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText)
      await setDataToCache(cacheKey, aiSummary, aiSummaryCacheTime)
      props.post.aiSummary = aiSummary
    }
  }
}

/**
 * 处理文章数据
 * @param props
 * @param from
 * @returns {Promise<void>}
 */
export async function processPostData(props, from) {
  const isLockedPost = isPasswordProtectedPost(props.post)

  if (props.post?.blockMap?.block && !isLockedPost) {
    // 目录默认加载
    props.post.content = Object.keys(props.post.blockMap.block).filter(
      key => props.post.blockMap.block[key]?.value?.parent_id === props.post.id
    )
    props.post.toc = getPageTableOfContents(props.post, props.post.blockMap)
    const pageContentText = getPageContentText(props.post, props.post.blockMap)
    const { wordCount, readTime } = countWords(pageContentText)
    props.post.wordCount = wordCount
    props.post.readTime = readTime
    await getPageAISummary(props, pageContentText)
  } else if (isLockedPost) {
    delete props.post.content
    delete props.post.toc
    delete props.post.wordCount
    delete props.post.readTime
    delete props.post.aiSummary
  }

  // 生成全文索引 && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post)
  }

  // 推荐关联文章处理
  const allPosts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  if (allPosts && allPosts.length > 0) {
    const index = allPosts.indexOf(props.post)
    props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
    props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
    props.recommendPosts = getRecommendPost(
      props.post,
      allPosts,
      siteConfig('POST_RECOMMEND_COUNT')
    )
  } else {
    props.prev = null
    props.next = null
    props.recommendPosts = []
  }

  const authors = resolveAuthorsForPost(props.post, props.allMembers || [])
  props.post.authors = authors
  props.post.relatedMembers = resolveRelatedMembersForPost(
    props.post,
    props.allMembers || [],
    authors
  )
  props.post.relatedEvents = resolveRelatedEventsForPost(
    props.post,
    props.allEvents || []
  )

  delete props.allPages
}
