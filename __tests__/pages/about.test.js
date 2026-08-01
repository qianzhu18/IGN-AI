jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((_key, fallback) => fallback)
}))

jest.mock('@/blog.config', () => ({
  __esModule: true,
  default: {}
}))

import { getAboutContent } from '@/pages/about'

describe('pages/about official community introduction', () => {
  it('uses the official IGNAI / 洋来社 wording and public figures', () => {
    const about = getAboutContent()

    expect(about.description).toContain('IGNAI / 洋来社')
    expect(about.stats.map(item => item.num)).toEqual([
      '300+',
      '2000+',
      '20+',
      '长沙'
    ])
    expect(about.officialIntro.href).toBe(
      'https://my.feishu.cn/docx/QaI1dMy6koIwWDxUqKMc1YHvnjc'
    )
  })

  it('keeps the official introduction link when Notion only overrides the CTA', () => {
    const about = getAboutContent({
      IGNAI_SECTION_ABOUT: {
        cta: {
          title: 'Ignite before AGI.',
          copy: '一起行动。',
          label: '进入社区',
          href: '/join'
        }
      }
    })

    expect(about.cta.label).toBe('进入社区')
    expect(about.officialIntro.label).toBe('查看完整社区与合作介绍')
  })
})
