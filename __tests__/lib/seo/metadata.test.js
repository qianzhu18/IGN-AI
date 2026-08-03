import {
  buildAbsoluteUrl,
  buildStructuredData,
  getIndexingPolicy,
  serializeJsonLd
} from '@/lib/seo/metadata'

const shared = {
  siteUrl: 'https://example.com',
  siteTitle: 'IGNAI',
  siteDescription: '长沙 AI 社区',
  siteInfo: {
    link: 'https://example.com',
    icon: '/brand/icon.png',
    pageCover: '/brand/cover.jpg'
  },
  language: 'zh-CN',
  author: 'IGNAI'
}

describe('seo metadata helpers', () => {
  it('builds internal absolute URLs without duplicating slashes', () => {
    expect(buildAbsoluteUrl('https://example.com/', '/members/', 'alice')).toBe(
      'https://example.com/members/alice'
    )
  })

  it('marks search and operations routes as noindex while keeping links followable', () => {
    expect(getIndexingPolicy('/search/alice')).toMatchObject({
      index: false,
      follow: true,
      content: 'noindex, follow'
    })
    expect(getIndexingPolicy('/members/alice')).toMatchObject({
      index: true,
      follow: true,
      content: 'index, follow'
    })
  })

  it('emits a profile entity for a member detail page', () => {
    const data = buildStructuredData({
      ...shared,
      route: '/members/[slug]',
      url: 'https://example.com/members/alice',
      meta: {
        title: 'Alice | IGNAI',
        description: 'AI 产品实践者',
        image: 'https://cdn.example.com/alice.jpg'
      },
      pageData: {
        member: {
          title: 'Alice',
          role: '产品实践者',
          website: 'https://alice.example.com'
        }
      }
    })

    const profile = data['@graph'].find(item => item['@type'] === 'ProfilePage')
    expect(profile.mainEntity).toMatchObject({
      '@type': 'Person',
      name: 'Alice',
      jobTitle: '产品实践者',
      sameAs: ['https://alice.example.com']
    })
  })

  it('emits event and article entities only from page data', () => {
    const eventData = buildStructuredData({
      ...shared,
      route: '/events/[slug]',
      url: 'https://example.com/events/demo-day',
      meta: { title: 'Demo Day', description: '活动说明' },
      pageData: {
        event: {
          title: 'Demo Day',
          startDate: '2026-08-08',
          endDate: '2026-08-09',
          location: '长沙',
          format: 'offline'
        }
      }
    })
    expect(
      eventData['@graph'].find(item => item['@type'] === 'Event')
    ).toMatchObject({
      startDate: '2026-08-08',
      endDate: '2026-08-09',
      location: { '@type': 'Place', name: '长沙' }
    })

    const recordData = buildStructuredData({
      ...shared,
      route: '/records/[slug]',
      url: 'https://example.com/records/demo-day',
      meta: { title: '活动记录', description: '活动复盘' },
      pageData: {
        record: {
          type: 'Record',
          title: '活动记录',
          excerpt: '活动复盘',
          timelineDate: '2026-08-08',
          tags: ['AI', '社区']
        }
      }
    })
    expect(
      recordData['@graph'].find(item => item['@type'] === 'Article')
    ).toMatchObject({
      headline: '活动记录',
      datePublished: '2026-08-08',
      keywords: ['AI', '社区']
    })
  })

  it('escapes JSON-LD script-breaking characters', () => {
    const serialized = serializeJsonLd({ description: '</script>&' })
    expect(serialized).toBe('{"description":"\\u003c/script\\u003e\\u0026"}')
  })
})
