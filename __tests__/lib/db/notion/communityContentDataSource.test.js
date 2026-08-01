import {
  getEventDataSourcePropertyCandidates,
  mapOfficialEventPage
} from '@/lib/db/notion/eventDataSource'
import {
  getRecordDataSourcePropertyCandidates,
  mapOfficialRecordPage
} from '@/lib/db/notion/recordDataSource'

const schema = properties => ({
  properties: Object.fromEntries(
    Object.entries(properties).map(([name, type]) => [
      name,
      { name, type, [type]: {} }
    ])
  )
})

const richText = value => ({
  type: 'rich_text',
  rich_text: [{ plain_text: value }]
})

const title = value => ({
  type: 'title',
  title: [{ plain_text: value }]
})

const select = value => ({
  type: 'select',
  select: { name: value }
})

const checkbox = value => ({
  type: 'checkbox',
  checkbox: value
})

const url = value => ({
  type: 'url',
  url: value
})

const date = (start, end = null) => ({
  type: 'date',
  date: { start, end }
})

describe('Notion community content property contract', () => {
  it('exposes editable Event field names as official data source candidates', () => {
    const candidates = getEventDataSourcePropertyCandidates()

    expect(candidates.eventStatus).toEqual(
      expect.arrayContaining(['event_status', 'eventStatus'])
    )
    expect(candidates.format).toEqual(
      expect.arrayContaining(['event_format', 'format'])
    )
    expect(candidates.publicListing).toEqual(
      expect.arrayContaining(['public_listing', 'publicListing'])
    )
    expect(candidates.registrationQrImage).toEqual(
      expect.arrayContaining(['registration_qr', 'registrationQrImage'])
    )
    expect(candidates.coverPosition).toEqual(
      expect.arrayContaining(['cover_position', 'coverPosition'])
    )
    expect(candidates.organizerSlugs).toEqual(
      expect.arrayContaining(['organizer_slugs'])
    )
  })

  it('maps every editable Event field to the top-level page contract', () => {
    const dataSource = schema({
      title: 'title',
      type: 'select',
      status: 'select',
      slug: 'rich_text',
      summary: 'rich_text',
      category: 'select',
      date: 'date',
      location: 'rich_text',
      website: 'url',
      event_status: 'select',
      event_format: 'select',
      public_listing: 'checkbox',
      registration_qr: 'url',
      cover_position: 'rich_text',
      organizer_slugs: 'rich_text'
    })
    const page = {
      id: 'event-1',
      created_time: '2026-07-01T00:00:00.000Z',
      last_edited_time: '2026-07-02T00:00:00.000Z',
      cover: {
        type: 'external',
        external: { url: 'https://images.example/event.webp' }
      },
      properties: {
        title: title('Notion 活动'),
        type: select('Event'),
        status: select('Published'),
        slug: richText('notion-event'),
        summary: richText('直接从 Notion 编辑'),
        category: select('联合承办'),
        date: date('2026-08-08', '2026-08-09'),
        location: richText('长沙'),
        website: url('https://example.com/register'),
        event_status: select('ongoing'),
        event_format: select('hybrid'),
        public_listing: checkbox(true),
        registration_qr: url('https://images.example/qr.webp'),
        cover_position: richText('50% 35%'),
        organizer_slugs: richText('qianzhu, alice')
      }
    }

    expect(mapOfficialEventPage(page, dataSource)).toMatchObject({
      title: 'Notion 活动',
      status: 'Published',
      eventStatus: 'ongoing',
      format: 'hybrid',
      publicListing: true,
      registrationQrImage: 'https://images.example/qr.webp',
      coverPosition: '50% 35%',
      organizer_slugs: ['qianzhu', 'alice'],
      cover: 'https://images.example/event.webp'
    })
  })

  it('turns an expiring official Notion cover into the stable Notion image URL', () => {
    const dataSource = schema({
      title: 'title',
      status: 'select',
      slug: 'rich_text'
    })
    const page = {
      id: '3a5e45c4-da1e-8110-928c-c288578c054d',
      created_time: '2026-07-01T00:00:00.000Z',
      last_edited_time: '2026-07-02T00:00:00.000Z',
      cover: {
        type: 'file',
        file: {
          url:
            'https://prod-files-secure.s3.us-west-2.amazonaws.com/space-id/2f51fa0d-5230-47bb-bafe-b5061ccc2245/%E7%9F%AD%E5%9B%BE.png?X-Amz-Expires=3600&X-Amz-Signature=temporary'
        }
      },
      properties: {
        title: title('Notion 活动'),
        status: select('Published'),
        slug: richText('notion-event')
      }
    }

    const event = mapOfficialEventPage(page, dataSource)

    expect(event.cover).toContain(
      '/image/attachment%3A2f51fa0d-5230-47bb-bafe-b5061ccc2245%3A'
    )
    expect(event.cover).toContain('table=block')
    expect(event.cover).not.toContain('X-Amz-Signature')
  })

  it('exposes and maps the Record-to-Event field without ext JSON', () => {
    const candidates = getRecordDataSourcePropertyCandidates()
    expect(candidates.relatedEventSlug).toEqual(
      expect.arrayContaining(['related_event_slug', 'relatedEventSlug'])
    )

    const dataSource = schema({
      title: 'title',
      type: 'select',
      status: 'select',
      slug: 'rich_text',
      summary: 'rich_text',
      category: 'select',
      date: 'date',
      location: 'rich_text',
      related_event_slug: 'rich_text'
    })
    const page = {
      id: 'record-1',
      created_time: '2026-07-10T00:00:00.000Z',
      last_edited_time: '2026-07-11T00:00:00.000Z',
      properties: {
        title: title('活动回顾'),
        type: select('Record'),
        status: select('Published'),
        slug: richText('event-recap'),
        summary: richText('活动结束后直接在 Notion 写回顾'),
        category: select('活动现场'),
        date: date('2026-08-08'),
        location: richText('长沙'),
        related_event_slug: richText('/events/notion-event')
      }
    }

    expect(mapOfficialRecordPage(page, dataSource)).toMatchObject({
      title: '活动回顾',
      status: 'Published',
      relatedEventSlug: '/events/notion-event',
      date: {
        start: '2026-08-08',
        end: ''
      }
    })
  })
})
