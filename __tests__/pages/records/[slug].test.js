import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData,
  fetchRecordsFromOfficialAPI,
  getPostBlocks
} from '@/lib/db/SiteDataApi'
import { getStaticProps } from '@/pages/records/[slug]'

jest.mock('@/blog.config', () => ({
  NEXT_REVALIDATE_SECOND: 60
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultValue) => defaultValue)
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchEventsFromOfficialAPI: jest.fn(),
  fetchGlobalAllData: jest.fn(),
  fetchRecordsFromOfficialAPI: jest.fn(),
  getPostBlocks: jest.fn()
}))

jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  formatNotionBlock: jest.fn(blocks => blocks)
}))

jest.mock('@/lib/utils/notion.util', () => ({
  adapterNotionBlockMap: jest.fn(blockMap => blockMap)
}))

jest.mock('@/components/NotionPage', () => ({
  __esModule: true,
  default: () => null
}))

describe('pages/records/[slug]', () => {
  beforeEach(() => {
    fetchEventsFromOfficialAPI.mockReset()
    fetchGlobalAllData.mockReset()
    fetchRecordsFromOfficialAPI.mockReset()
    getPostBlocks.mockReset()
    delete process.env.EXPORT
  })

  it('resolves related Events from the latest official Notion rows', async () => {
    fetchGlobalAllData.mockResolvedValue({
      allEvents: [],
      allRecords: [],
      NOTION_CONFIG: {}
    })
    fetchRecordsFromOfficialAPI.mockResolvedValue([
      {
        slug: 'guanchai-fde-camp',
        title: 'FDE 共学营回顾',
        type: 'Record',
        category: '活动现场',
        relatedEventSlug: 'guanchai-fde-study-camp-2026'
      }
    ])
    fetchEventsFromOfficialAPI.mockResolvedValue([
      {
        id: 'event-1',
        slug: 'guanchai-fde-study-camp-2026',
        title: 'FDE 共学营',
        type: 'Event',
        status: 'Published',
        eventStatus: 'ongoing',
        publicListing: true
      }
    ])

    const result = await getStaticProps({
      params: { slug: 'guanchai-fde-camp' },
      locale: 'zh-CN'
    })

    expect(fetchEventsFromOfficialAPI).toHaveBeenCalledTimes(1)
    expect(result.props.relatedEvents).toHaveLength(1)
    expect(result.props.relatedEvents[0]).toMatchObject({
      slug: 'guanchai-fde-study-camp-2026',
      title: 'FDE 共学营',
      status: 'ongoing'
    })
  })
})
