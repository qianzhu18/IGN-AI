import { describe, expect, it } from 'vitest'

import { ensureSEO } from './ensureSEO'

describe('ensureSEO', () => {
  it('fills missing SEO fields from typed content fields', () => {
    const result = ensureSEO({
      data: {
        excerpt: '  一段\n活动摘要  ',
        seo: {},
        title: 'IGNAI 活动',
      },
    } as never) as Record<string, unknown>

    expect(result.seo).toEqual({
      description: '一段 活动摘要',
      title: 'IGNAI 活动',
    })
  })

  it('preserves explicit editorial SEO values', () => {
    const result = ensureSEO({
      data: {
        excerpt: '默认摘要',
        seo: { description: '编辑描述', title: '编辑标题' },
        title: '默认标题',
      },
    } as never) as { seo: { description: string; title: string } }

    expect(result.seo).toMatchObject({ description: '编辑描述', title: '编辑标题' })
  })
})
