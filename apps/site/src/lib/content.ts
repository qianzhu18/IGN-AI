import config from '@payload-config'
import { getPayload } from 'payload'

import type { Config, Event, Media, SiteSetting } from '@/payload-types'
import type { ContentCollection } from '@/lib/contentCollections'

export const fallbackSettings = {
  heroStatement: '在真实世界，发生 AI',
  intro: '长沙青年 AI 社区。我们把线上信号带回真实现场，把相遇变成长期行动。',
  navigation: [
    { href: '/events', label: '活动' },
    { href: 'https://www.ignai.cn/members', label: '成员' },
    { href: 'https://www.ignai.cn/records', label: '记录' },
  ],
  primaryCTA: { href: 'https://www.ignai.cn/join', label: '加入社区' },
  siteName: 'IGN AI',
} satisfies Pick<SiteSetting, 'heroStatement' | 'intro' | 'navigation' | 'primaryCTA' | 'siteName'>

type ContentDocument<TCollection extends ContentCollection> = Config['collections'][TCollection]

export async function getPublishedDocuments<TCollection extends ContentCollection>(
  collection: TCollection,
  limit = 8,
): Promise<ContentDocument<TCollection>[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection,
    depth: 1,
    limit,
    overrideAccess: false,
    sort: '-updatedAt',
  })
  return result.docs as ContentDocument<TCollection>[]
}

export async function getDocumentBySlug<TCollection extends ContentCollection>(
  collection: TCollection,
  slug: string,
  draft = false,
): Promise<ContentDocument<TCollection> | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection,
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as ContentDocument<TCollection> | undefined) || null
}

export async function getPublishedEvents(limit = 8): Promise<Event[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit,
    overrideAccess: false,
    sort: '-featured,startAt',
  })
  return result.docs
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getPayload({ config })
  return payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
    overrideAccess: false,
  })
}

export function getMediaURL(media: Media | number | null | undefined): string | null {
  if (!media || typeof media !== 'object') return null
  return (media as Media).url || null
}
