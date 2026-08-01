const {
  CATEGORY_BY_KIND,
  planLegacyEventMigration,
  resolveSiteAssetUrl
} = require('../../scripts/migrate-notion-community-content')

describe('migrate-notion-community-content', () => {
  const baseEvent = {
    id: 'event-page-id',
    type: 'Event',
    slug: 'sanrenxing-ai-changsha-2026',
    category: 'Event',
    eventStatus: 'recap',
    eventFormat: 'offline',
    location: '长沙 · 湖南省科学技术馆',
    coverPosition: '',
    cover: null,
    ext: JSON.stringify({
      status: 'recap',
      kind: 'cohosted',
      format: 'offline',
      eventDateText: '2026 / 05 / 30',
      cover: '/images/activity-records/sanrenxing-ai-changsha-2026.webp',
      coverPosition: 'top',
      location: '长沙 · 湖南省科学技术馆',
      relatedRecordSlugs: ['sanrenxing-ai-community-bridge']
    })
  }

  it('moves supported Event ext values to first-class Notion fields and native cover', () => {
    expect(CATEGORY_BY_KIND.cohosted).toBe('联合承办')

    const plan = planLegacyEventMigration(baseEvent)

    expect(plan.blocked).toBe(false)
    expect(plan.changes).toEqual({
      category: '联合承办',
      eventStatus: 'recap',
      eventFormat: 'offline',
      location: '长沙 · 湖南省科学技术馆',
      coverPosition: 'top',
      cover: {
        type: 'external',
        external: {
          url: 'https://www.ignai.cn/images/activity-records/sanrenxing-ai-changsha-2026.webp'
        }
      },
      clearExt: true
    })
    expect(plan.ignoredKeys).toEqual(['eventDateText', 'relatedRecordSlugs'])
  })

  it('treats legacy ext as authoritative during the one-time migration', () => {
    const plan = planLegacyEventMigration({
      ...baseEvent,
      slug: 'datawhale-campus-promotion-2026',
      eventFormat: 'offline',
      ext: JSON.stringify({
        status: 'recap',
        kind: 'promoted',
        format: 'hybrid',
        coverPosition: 'center'
      })
    })

    expect(plan.changes.category).toBe('协助宣发')
    expect(plan.changes.eventFormat).toBe('hybrid')
    expect(plan.changes.coverPosition).toBe('center')
    expect(plan.changes.clearExt).toBe(true)
  })

  it('preserves an existing native Notion cover', () => {
    const existingCover = {
      type: 'file',
      file: { url: 'https://notion.example/signed-cover' }
    }
    const plan = planLegacyEventMigration({
      ...baseEvent,
      cover: existingCover
    })

    expect(plan.changes.cover).toBeUndefined()
    expect(plan.changes.clearExt).toBe(true)
  })

  it('does not clear ext when it contains content that cannot be represented safely', () => {
    const plan = planLegacyEventMigration({
      ...baseEvent,
      ext: JSON.stringify({
        kind: 'cohosted',
        coverPosition: 'top',
        agenda: ['不能静默丢失']
      })
    })

    expect(plan.blocked).toBe(true)
    expect(plan.unknownKeys).toEqual(['agenda'])
    expect(plan.changes.clearExt).toBeUndefined()
  })

  it('does not plan changes for Record rows or malformed ext JSON', () => {
    expect(
      planLegacyEventMigration({ ...baseEvent, type: 'Record' }).changes
    ).toEqual({})

    const malformed = planLegacyEventMigration({
      ...baseEvent,
      ext: '{not-json}'
    })
    expect(malformed.blocked).toBe(true)
    expect(malformed.error).toMatch(/Invalid ext JSON/)
  })

  it('safely clears legacy empty array and object placeholders', () => {
    expect(
      planLegacyEventMigration({ ...baseEvent, ext: '[]' }).changes
    ).toEqual({ clearExt: true })
    expect(
      planLegacyEventMigration({ ...baseEvent, ext: '{}' }).changes
    ).toEqual({ clearExt: true })

    const nonEmptyArray = planLegacyEventMigration({
      ...baseEvent,
      ext: '[{"content":"keep me"}]'
    })
    expect(nonEmptyArray.blocked).toBe(true)
    expect(nonEmptyArray.changes).toEqual({})
  })

  it('only resolves local site assets against the canonical origin', () => {
    expect(resolveSiteAssetUrl('/images/a.webp')).toBe(
      'https://www.ignai.cn/images/a.webp'
    )
    expect(resolveSiteAssetUrl('https://cdn.example/a.webp')).toBe(
      'https://cdn.example/a.webp'
    )
    expect(resolveSiteAssetUrl('images/a.webp')).toBe('')
  })
})
