import { normalizeRecord } from '@/lib/records'
import { normalizeNotionEvent } from '@/lib/utils/event'

describe('Notion community content normalization', () => {
  it('keeps editable Event fields dynamic instead of replacing them with defaults', () => {
    const event = normalizeNotionEvent({
      id: 'event-1',
      title: 'Notion 活动',
      slug: 'notion-event',
      status: 'Published',
      eventStatus: 'ongoing',
      format: 'hybrid',
      publicListing: true,
      registrationQrImage: 'https://images.example/qr.webp',
      coverPosition: 'top',
      organizer_slugs: ['qianzhu', 'alice'],
      cover: 'https://images.example/event.webp',
      date: {
        start: '2026-08-08',
        end: '2026-08-09'
      }
    })

    expect(event).toMatchObject({
      status: 'ongoing',
      format: 'hybrid',
      publicListing: true,
      registrationQrImage: 'https://images.example/qr.webp',
      coverPosition: 'top',
      hosts: ['qianzhu', 'alice'],
      cover: 'https://images.example/event.webp',
      dateText: '2026-08-08 – 2026-08-09'
    })
  })

  it('derives Record display fields and the Event backlink from Notion properties', () => {
    expect(
      normalizeRecord({
        id: 'record-1',
        title: '活动回顾',
        slug: 'event-recap',
        type: 'Record',
        status: 'Published',
        category: '活动现场',
        date: {
          start: '2026-08-08',
          end: '2026-08-09'
        },
        relatedEventSlug: '/events/notion-event',
        location: '长沙',
        cover: 'https://images.example/recap.webp'
      })
    ).toMatchObject({
      type: 'recap',
      dateText: '2026-08-08 – 2026-08-09',
      timelineDate: '2026-08-08',
      timelineEndDate: '2026-08-09',
      dateStatus: 'confirmed',
      relatedEventSlugs: ['notion-event'],
      location: '长沙',
      cover: 'https://images.example/recap.webp'
    })
  })
})
