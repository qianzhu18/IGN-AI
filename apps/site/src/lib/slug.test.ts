import { describe, expect, it } from 'vitest'

import { slugify } from './slug'

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
})
