import { describe, expect, it } from 'vitest'

import { RESERVED_ROOT_SLUGS, slugify, validateReservedSlug } from './slug'

describe('slugify', () => {
  it('normalizes Latin titles into stable URL segments', () => {
    expect(slugify('  IGNAI Community Meetup 2026  ')).toBe('ignai-community-meetup-2026')
  })

  it('preserves Chinese letters and separates punctuation', () => {
    expect(slugify('智极松：长沙 MiniCamp')).toBe('智极松-长沙-minicamp')
  })

  it('removes leading and trailing separators', () => {
    expect(slugify('--- Field Notes ---')).toBe('field-notes')
  })

  it('rejects root slugs owned by application routes', () => {
    expect(validateReservedSlug('Events', RESERVED_ROOT_SLUGS)).toContain('系统保留路径')
    expect(validateReservedSlug('_preview', RESERVED_ROOT_SLUGS)).toContain('系统保留路径')
  })

  it('allows editorial page slugs outside the reserved set', () => {
    expect(validateReservedSlug('about', RESERVED_ROOT_SLUGS)).toBe(true)
    expect(validateReservedSlug('join', RESERVED_ROOT_SLUGS)).toBe(true)
  })
})
