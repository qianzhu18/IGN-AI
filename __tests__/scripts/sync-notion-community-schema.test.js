const {
  REQUIRED_PROPERTIES,
  buildSchemaPlan
} = require('@/scripts/sync-notion-community-schema')

describe('Notion community schema sync', () => {
  it('adds only missing fields and leaves matching fields untouched', () => {
    const plan = buildSchemaPlan({
      title: { name: 'title', type: 'title', title: {} },
      event_status: {
        name: 'event_status',
        type: 'select',
        select: { options: [] }
      }
    })

    expect(plan.additions).toEqual({
      event_format: REQUIRED_PROPERTIES.event_format,
      public_listing: REQUIRED_PROPERTIES.public_listing,
      registration_qr: REQUIRED_PROPERTIES.registration_qr,
      cover_position: REQUIRED_PROPERTIES.cover_position,
      related_event_slug: REQUIRED_PROPERTIES.related_event_slug
    })
    expect(plan.existing).toEqual(['event_status'])
    expect(plan.conflicts).toEqual([])
  })

  it('reports a type conflict instead of changing an existing field', () => {
    const plan = buildSchemaPlan({
      related_event_slug: {
        name: 'related_event_slug',
        type: 'url',
        url: {}
      }
    })

    expect(plan.additions).not.toHaveProperty('related_event_slug')
    expect(plan.conflicts).toEqual([
      {
        name: 'related_event_slug',
        expected: 'rich_text',
        actual: 'url'
      }
    ])
  })
})
