import { mergeOfficialPages } from '@/lib/db/notion/mergeOfficialPages'

describe('mergeOfficialPages', () => {
  it('replaces an incomplete collection-view row with its official API row', () => {
    const collectionPages = [
      {
        id: 'event-1',
        type: 'Event',
        title: '活动',
        status: 'Published',
        eventStatus: ''
      },
      { id: 'post-1', type: 'Post', title: '文章' }
    ]
    const officialPages = [
      {
        id: 'event-1',
        type: 'Event',
        title: '活动',
        status: 'Published',
        eventStatus: 'ongoing',
        publicListing: true
      }
    ]

    expect(mergeOfficialPages(collectionPages, officialPages)).toEqual([
      {
        id: 'event-1',
        type: 'Event',
        title: '活动',
        status: 'Published',
        eventStatus: 'ongoing',
        publicListing: true
      },
      { id: 'post-1', type: 'Post', title: '文章' }
    ])
  })

  it('appends an official row missing from the collection view', () => {
    expect(
      mergeOfficialPages(
        [{ id: 'post-1', type: 'Post' }],
        [{ id: 'record-1', type: 'Record' }]
      )
    ).toEqual([
      { id: 'post-1', type: 'Post' },
      { id: 'record-1', type: 'Record' }
    ])
  })

  it('keeps native Notion cover Reposition when the official API omits it', () => {
    expect(
      mergeOfficialPages(
        [
          {
            id: 'event-1',
            type: 'Event',
            coverPosition: 'center 75%'
          }
        ],
        [
          {
            id: 'event-1',
            type: 'Event',
            eventStatus: 'ongoing',
            coverPosition: ''
          }
        ]
      )
    ).toEqual([
      {
        id: 'event-1',
        type: 'Event',
        eventStatus: 'ongoing',
        coverPosition: 'center 75%'
      }
    ])
  })
})
