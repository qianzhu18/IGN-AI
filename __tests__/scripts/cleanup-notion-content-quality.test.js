const {
  OFFICIAL_INTRO_URL,
  planContentCleanup,
  valuesMatch
} = require('../../scripts/cleanup-notion-content-quality')

describe('cleanup-notion-content-quality', () => {
  it('clears meaningless empty ext placeholders without changing valid content', () => {
    const plan = planContentCleanup({
      id: 'record-id',
      type: 'Record',
      status: 'Published',
      slug: 'valid-record',
      ext: '[]'
    })

    expect(plan.properties).toEqual({ ext: '' })
    expect(plan.archive).toBe(false)
    expect(plan.replaceBodyMarkdown).toBe('')
  })

  it('migrates the AIPO draft to first-class fields and meaningful page blocks', () => {
    const plan = planContentCleanup({
      id: 'aipo-id',
      type: 'Record',
      status: 'Invisible',
      slug: 'aipo-hunan-university-field-note',
      date: { start: '2025-10-01' },
      ext: JSON.stringify({
        recordType: 'recap',
        dateText: '2025-10-01',
        location: '湖南大学',
        outcomes: ['100+ 线上触达', '40+ 线下到场', '跨校节点']
      })
    })

    expect(plan.properties).toMatchObject({
      category: '活动现场',
      date: null,
      location: '湖南大学',
      ext: ''
    })
    expect(plan.replaceBodyMarkdown).toContain('## 活动怎么进行')
    expect(plan.replaceBodyMarkdown).toContain('虚拟货币')
    expect(plan.replaceBodyMarkdown).toContain('- 40+ 线下到场')
    expect(plan.replaceBodyMarkdown).not.toContain('/resume')
    expect(plan.archive).toBe(false)
  })

  it('can safely re-run after the AIPO ext migration has already completed', () => {
    const plan = planContentCleanup({
      id: 'aipo-id',
      type: 'Record',
      status: 'Invisible',
      slug: 'aipo-hunan-university-field-note',
      category: '活动现场',
      date: null,
      location: '湖南大学',
      ext: ''
    })

    expect(plan.blocked).toBe(false)
    expect(plan.error).toBe('')
    expect(plan.replaceBodyMarkdown).toContain('## 已确认结果')
  })

  it('replaces the community origin placeholder body and removes the fabricated date', () => {
    const plan = planContentCleanup({
      id: 'origin-id',
      type: 'Record',
      status: 'Invisible',
      slug: 'ignai-community-origin-story',
      date: { start: '2025-01-01' },
      ext: ''
    })

    expect(plan.properties).toEqual({ date: null })
    expect(plan.replaceBodyMarkdown).toContain('## 从活动现场长出来')
    expect(plan.replaceBodyMarkdown).toContain('一次活动结束以后')
    expect(plan.replaceBodyMarkdown).not.toContain('记录说明')
    expect(plan.replaceBodyMarkdown).not.toContain('/resume')
  })

  it('archives known duplicate records and clears their legacy ext first', () => {
    const plan = planContentCleanup({
      id: 'duplicate-id',
      type: 'Record',
      status: 'Invisible',
      slug: '2050-community-meetup-and-demo',
      ext: '{"recordType":"project"}'
    })

    expect(plan.archive).toBe(true)
    expect(plan.properties.ext).toBe('')
    expect(plan.reason).toMatch(/duplicate/i)
  })

  it('downgrades evidence-only records instead of publishing invented stories', () => {
    const plan = planContentCleanup({
      id: 'evidence-id',
      type: 'Record',
      status: 'Published',
      slug: 'datawhale-campus-promotion',
      ext: '[]',
      relatedEventSlug: 'datawhale-campus-promotion-2026'
    })

    expect(plan.properties).toMatchObject({
      status: 'Invisible',
      relatedEventSlug: '',
      ext: ''
    })
    expect(plan.replaceBodyMarkdown).toContain('现有材料只能确认')
    expect(plan.replaceBodyMarkdown).toContain('待补齐')
  })

  it('archives stale tangly template navigation while keeping the official intro URL', () => {
    expect(OFFICIAL_INTRO_URL).toBe(
      'https://my.feishu.cn/docx/QaI1dMy6koIwWDxUqKMc1YHvnjc'
    )

    const plan = planContentCleanup({
      id: 'dbae45c4-da1e-83ec-af49-0135575f07c7',
      type: 'SubMenu',
      status: 'Published',
      slug: 'https://docs.tangly1024.com/about',
      ext: ''
    })

    expect(plan.archive).toBe(true)
    expect(plan.reason).toMatch(/template navigation/i)
  })

  it('hides the unsupported Datawhale Event and clears its fabricated date', () => {
    const plan = planContentCleanup({
      id: 'event-id',
      type: 'Event',
      status: 'Published',
      slug: 'datawhale-campus-promotion-2026',
      date: { start: '2026-06-01' },
      eventStart: { start: '2026-06-01' },
      publicListing: true,
      ext: ''
    })

    expect(plan.properties).toMatchObject({
      status: 'Invisible',
      publicListing: false,
      date: null,
      eventStart: null
    })
    expect(plan.replaceBodyMarkdown).toContain('现有证据边界')
  })

  it('archives premature or redundant Event/Record rows', () => {
    const prematureRecord = planContentCleanup({
      id: 'fde-record',
      type: 'Record',
      status: 'Published',
      slug: 'guanchai-fde-camp',
      ext: ''
    })
    expect(prematureRecord.archive).toBe(true)
    expect(prematureRecord.reason).toMatch(/premature recap/i)

    const redundantEvent = planContentCleanup({
      id: 'garden-event',
      type: 'Event',
      status: 'Published',
      slug: 'guanchai-changli-ai-garden-2026',
      ext: ''
    })
    expect(redundantEvent.archive).toBe(true)

    const staleContest = planContentCleanup({
      id: '375e45c4-da1e-8086-a5e6-e4f8ddbc70c3',
      type: 'Event',
      status: 'Published',
      slug: 'https://community.xiaohuanxiong.com/2026-spring/detail',
      ext: ''
    })
    expect(staleContest.archive).toBe(true)
    expect(staleContest.reason).toMatch(/empty external contest/i)
  })

  it('removes unsupported relationships and dates while preserving valid pages', () => {
    const gardenRecord = planContentCleanup({
      id: 'garden-record',
      type: 'Record',
      status: 'Published',
      slug: 'guanchai-changli-ai-garden',
      relatedEventSlug: 'guanchai-changli-ai-garden-2026',
      ext: '[]'
    })
    expect(gardenRecord.properties).toMatchObject({
      relatedEventSlug: '',
      ext: ''
    })

    const pmEvent = planContentCleanup({
      id: 'pm-event',
      type: 'Event',
      status: 'Published',
      slug: 'guanchai-ai-product-manager-camp-2026',
      date: { start: '2026-06-15' },
      eventStart: { start: '2026-06-15' },
      ext: ''
    })
    expect(pmEvent.properties).toMatchObject({ date: null, eventStart: null })

    const lev0Event = planContentCleanup({
      id: 'lev0-event',
      type: 'Event',
      status: 'Published',
      slug: 'lev0-minicamp-hackathon-2026',
      date: { start: '2026-06-06' },
      eventStart: { start: '2026-06-06' },
      location: '湖南',
      ext: ''
    })
    expect(lev0Event.properties).toMatchObject({
      date: { start: '2026-06-14' },
      eventStart: { start: '2026-06-14' },
      location: '长沙 · 岳麓山实验室'
    })
  })

  it('leaves unrelated rows unchanged', () => {
    expect(
      planContentCleanup({
        id: 'untouched',
        type: 'Post',
        status: 'Published',
        slug: 'real-article',
        ext: ''
      })
    ).toEqual({
      id: 'untouched',
      slug: 'real-article',
      type: 'Post',
      reason: '',
      properties: {},
      replaceBodyMarkdown: '',
      archive: false,
      blocked: false,
      error: ''
    })
  })

  it('blocks unknown non-empty ext data instead of dropping it', () => {
    const plan = planContentCleanup({
      id: 'unknown-ext',
      type: 'Record',
      status: 'Invisible',
      slug: 'future-record',
      ext: '{"agenda":["keep me"]}'
    })

    expect(plan.blocked).toBe(true)
    expect(plan.properties).toEqual({})
    expect(plan.error).toMatch(/unsupported ext keys/i)
  })

  it('verifies Notion dates while ignoring null response metadata', () => {
    expect(
      valuesMatch(
        { start: '2026-06-14', end: null, time_zone: null },
        { start: '2026-06-14' }
      )
    ).toBe(true)
    expect(valuesMatch(null, null)).toBe(true)
    expect(valuesMatch({ start: '2026-06-13' }, { start: '2026-06-14' })).toBe(
      false
    )
  })
})
