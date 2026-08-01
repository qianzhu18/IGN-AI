import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData,
  fetchMembersFromOfficialAPI
} from '@/lib/db/SiteDataApi'
import { getStaticProps } from '@/pages/index'

jest.mock('@/blog.config', () => ({
  NEXT_REVALIDATE_SECOND: 60,
  THEME: 'landing'
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultValue) => defaultValue)
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchEventsFromOfficialAPI: jest.fn(),
  fetchGlobalAllData: jest.fn(),
  fetchMembersFromOfficialAPI: jest.fn(),
  getMembersForScatter: jest.fn(({ allMembers }) => allMembers),
  getPostBlocks: jest.fn()
}))

jest.mock('@/lib/utils/rss', () => ({ generateRss: jest.fn() }))
jest.mock('@/lib/utils/redirect', () => ({ generateRedirectJson: jest.fn() }))
jest.mock('@/lib/plugins/algolia', () => ({ checkDataFromAlgolia: jest.fn() }))
jest.mock('@/themes/theme', () => ({ DynamicLayout: () => null }))
jest.mock('@/lib/dev/contentFixtures', () => ({
  mergeFixturePosts: jest.fn(posts => posts)
}))
jest.mock('p-limit', () => () => task => task())

describe('pages/index', () => {
  beforeEach(() => {
    fetchEventsFromOfficialAPI.mockReset()
    fetchGlobalAllData.mockReset()
    fetchMembersFromOfficialAPI.mockReset()
    fetchMembersFromOfficialAPI.mockResolvedValue([])
    delete process.env.EXPORT
  })

  it('keeps native Notion Reposition while refreshing official Event fields', async () => {
    fetchGlobalAllData.mockResolvedValue({
      allEvents: [
        {
          id: 'event-1',
          type: 'Event',
          status: 'Published',
          slug: 'notion-event',
          title: 'Notion 活动',
          coverPosition: 'center 75%'
        }
      ],
      allMembers: [],
      allPages: [],
      NOTION_CONFIG: {}
    })
    fetchEventsFromOfficialAPI.mockResolvedValue([
      {
        id: 'event-1',
        type: 'Event',
        status: 'Published',
        slug: 'notion-event',
        title: 'Notion 活动',
        eventStatus: 'ongoing',
        coverPosition: ''
      }
    ])

    const result = await getStaticProps({ locale: 'zh-CN' })

    expect(result.props.allEvents[0]).toMatchObject({
      slug: 'notion-event',
      status: 'ongoing',
      coverPosition: 'center 75%'
    })
  })
})
