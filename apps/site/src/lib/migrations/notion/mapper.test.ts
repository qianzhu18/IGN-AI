import { describe, expect, it } from 'vitest'

import { mapNotionPage, mapSiteSettings } from './mapper'
import type { NotionDataSource, NotionPage } from './types'

const dataSource: NotionDataSource = {
  id: 'source',
  properties: Object.fromEntries(
    ['title', 'type', 'status', 'slug', 'summary', 'role', 'author_slug'].map((name) => [
      name,
      { name, type: name === 'title' ? 'title' : name === 'type' || name === 'status' ? 'select' : 'rich_text' },
    ]),
  ),
}

const richText = (plainText: string) => [{ plain_text: plainText }]
const page = (values: Record<string, string>): NotionPage => ({
  created_time: '2026-01-01T00:00:00.000Z',
  id: values.id || 'page-id',
  last_edited_time: '2026-01-02T00:00:00.000Z',
  object: 'page',
  properties: {
    author_slug: { rich_text: richText(values.author_slug || ''), type: 'rich_text' },
    role: { rich_text: richText(values.role || ''), type: 'rich_text' },
    slug: { rich_text: richText(values.slug || ''), type: 'rich_text' },
    status: { select: { name: values.status || 'Published' }, type: 'select' },
    summary: { rich_text: richText(values.summary || ''), type: 'rich_text' },
    title: { title: richText(values.title || ''), type: 'title' },
    type: { select: { name: values.type }, type: 'select' },
  },
})

describe('Notion entity mapper', () => {
  it('maps a Member to draft-capable Payload data with source-stable slug', () => {
    const item = mapNotionPage(
      page({ role: 'Builder', slug: 'members/Qianzhu', summary: 'AI builder', title: '千逐', type: 'Member' }),
      dataSource,
      [],
    )
    expect(item).toMatchObject({
      data: { _status: 'published', role: 'Builder', slug: 'qianzhu', title: '千逐' },
      errors: [],
      target: 'members',
    })
  })

  it('flags Posts without an author relationship for manual review', () => {
    const item = mapNotionPage(page({ slug: 'post', title: '文章', type: 'Post' }), dataSource, [])
    expect(item?.errors).toContain('Post requires at least one resolvable author slug')
  })

  it('keeps checksums stable when a Notion cover URL only changes signed query params', () => {
    const first = page({ slug: 'event', title: '活动', type: 'Event' })
    const second = page({ slug: 'event', title: '活动', type: 'Event' })
    first.cover = { file: { url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/bucket/image.png?x=1' }, type: 'file' }
    second.cover = { file: { url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/bucket/image.png?x=2' }, type: 'file' }

    expect(mapNotionPage(first, dataSource, [])?.checksum).toBe(mapNotionPage(second, dataSource, [])?.checksum)
  })

  it('aggregates Hero and Navigation Config rows into Site Settings', () => {
    const hero = page({
      id: 'hero',
      slug: 'hero',
      summary: '{"name":"IGNAI","slogan":"Ignite","heroSummary":"社区"}',
      title: 'Config:Hero',
      type: 'Config',
    })
    const navigation = page({
      id: 'navigation',
      slug: 'navigation',
      summary: '{"items":[{"label":"活动","href":"/events"}]}',
      title: 'Config:Navigation',
      type: 'Config',
    })
    expect(mapSiteSettings([hero, navigation], dataSource)).toMatchObject({
      data: {
        heroStatement: 'Ignite',
        navigation: [{ href: '/events', label: '活动' }],
        siteName: 'IGNAI',
      },
      target: 'site-settings',
    })
  })
})
