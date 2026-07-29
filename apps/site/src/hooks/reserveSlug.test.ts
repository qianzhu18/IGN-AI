import { describe, expect, it } from 'vitest'

import { RESERVED_ROOT_SLUGS } from '../lib/slug'

import { reserveSlugs } from './reserveSlug'

describe('reserveSlugs', () => {
  const hook = reserveSlugs(RESERVED_ROOT_SLUGS)

  it('blocks a normalized application route slug', () => {
    expect(() => hook({ data: { slug: 'events' } } as never)).toThrow('系统保留路径')
  })

  it('returns ordinary editorial slugs unchanged', () => {
    expect(hook({ data: { slug: 'about' } } as never)).toMatchObject({ slug: 'about' })
  })
})
