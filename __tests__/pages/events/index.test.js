import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData
} from '@/lib/db/SiteDataApi'
import { getStaticProps } from '@/pages/events/index'

jest.mock('@/blog.config', () => ({
  NEXT_REVALIDATE_SECOND: 60
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultValue) => defaultValue)
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchEventsFromOfficialAPI: jest.fn(),
  fetchGlobalAllData: jest.fn()
}))

describe('pages/events/index', () => {
  beforeEach(() => {
    fetchEventsFromOfficialAPI.mockReset()
    fetchGlobalAllData.mockReset()
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

    expect(result.props.events[0]).toMatchObject({
      slug: 'notion-event',
      status: 'ongoing',
      coverPosition: 'center 75%'
    })
  })
})
