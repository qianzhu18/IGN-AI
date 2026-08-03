import {
  buildCommunitySitemapFields,
  renderSitemapXml
} from '@/lib/seo/sitemap'

jest.mock('@/blog.config', () => ({
  NOTION_PROPERTY_NAME: { status_publish: 'Published' }
}))

describe('community sitemap helpers', () => {
  it('includes published community detail pages and excludes external event pages', () => {
    const fields = buildCommunitySitemapFields({
      link: 'https://example.com/',
      allPages: [
        {
          type: 'Post',
          status: 'Published',
          slug: 'posts/hello',
          lastEditedDate: '2026-08-01'
        }
      ],
      allMembers: [
        {
          id: 'member-1',
          type: 'Member',
          status: 'Published',
          slug: 'members/alice'
        }
      ],
      allEvents: [
        {
          type: 'Event',
          status: 'Published',
          slug: 'demo-day',
          date: { start: '2026-08-08' }
        },
        {
          type: 'Event',
          status: 'Published',
          slug: 'https://partner.example.com/demo-day',
          externalUrl: 'https://partner.example.com/demo-day'
        }
      ],
      allRecords: [
        {
          type: 'Record',
          status: 'Published',
          slug: 'records/demo-day',
          date: { start: '2026-08-09' }
        }
      ]
    })

    const locations = fields.map(field => field.loc)
    expect(locations).toEqual(
      expect.arrayContaining([
        'https://example.com',
        'https://example.com/members/alice',
        'https://example.com/events/demo-day',
        'https://example.com/records/demo-day',
        'https://example.com/posts/hello'
      ])
    )
    expect(locations).not.toContain(
      'https://example.com/events/partner.example.com/demo-day'
    )
    expect(locations).not.toContain('https://partner.example.com/demo-day')
    expect(locations).not.toContain('https://example.com/search')
    expect(locations).not.toContain('https://example.com/rss/feed.xml')
    expect(
      fields.find(field => field.loc.endsWith('/events/demo-day'))
    ).toMatchObject({
      lastmod: '2026-08-08'
    })
  })

  it('escapes XML values and omits missing lastmod values', () => {
    const xml = renderSitemapXml([
      { loc: 'https://example.com/a?x=1&y=2', priority: '0.7' },
      { loc: 'https://example.com/b', lastmod: undefined }
    ])
    expect(xml).toContain('https://example.com/a?x=1&amp;y=2')
    expect(xml).not.toContain('<lastmod>undefined</lastmod>')
  })
})
