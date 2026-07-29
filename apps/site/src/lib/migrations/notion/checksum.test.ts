import { describe, expect, it } from 'vitest'

import { canonicalJSON, checksum, projectShape } from './checksum'

describe('migration checksum', () => {
  it('is stable across object key order', () => {
    expect(checksum({ b: 2, a: { d: 4, c: 3 } })).toBe(checksum({ a: { c: 3, d: 4 }, b: 2 }))
    expect(canonicalJSON({ b: 2, a: 1 })).toBe('{"a":1,"b":2}')
  })

  it('projects generated ids out of Payload array values', () => {
    const current = { navigation: [{ href: '/events', id: 'generated', label: '活动' }] }
    const desired = { navigation: [{ href: '/events', label: '活动' }] }
    expect(projectShape(current, desired)).toEqual(desired)
  })
})
