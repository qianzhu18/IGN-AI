import { describe, expect, it } from 'vitest'

import { enforceAIServiceDrafts } from './enforceAIServiceDrafts'

describe('enforceAIServiceDrafts', () => {
  it('forces AI service account writes to draft', () => {
    const result = enforceAIServiceDrafts({
      data: { _status: 'published', title: 'Generated post' },
      req: { user: { role: 'ai-service' } },
    } as never)

    expect(result).toMatchObject({ _status: 'draft', title: 'Generated post' })
  })

  it('does not change editor publication state', () => {
    const data = { _status: 'published', title: 'Editor post' }
    const result = enforceAIServiceDrafts({
      data,
      req: { user: { role: 'editor' } },
    } as never)

    expect(result).toBe(data)
  })
})
