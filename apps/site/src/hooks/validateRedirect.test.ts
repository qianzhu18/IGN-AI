import { describe, expect, it } from 'vitest'

import { normalizeInternalPath, validateRedirect } from './validateRedirect'

describe('redirect validation', () => {
  it('normalizes trailing slashes for stable redirect keys', () => {
    expect(normalizeInternalPath('/events/old///')).toBe('/events/old')
  })

  it('accepts internal and external destinations', () => {
    expect(
      validateRedirect({ data: { from: '/old/', to: '/new/' } } as never),
    ).toMatchObject({ from: '/old', to: '/new' })
    expect(
      validateRedirect({ data: { from: '/old', to: 'https://example.com/new' } } as never),
    ).toMatchObject({ to: 'https://example.com/new' })
  })

  it('rejects protocol-relative and self redirects', () => {
    expect(() => validateRedirect({ data: { from: '//evil.test', to: '/safe' } } as never)).toThrow(
      '站内绝对路径',
    )
    expect(() => validateRedirect({ data: { from: '/same/', to: '/same' } } as never)).toThrow(
      '不能相同',
    )
  })
})
