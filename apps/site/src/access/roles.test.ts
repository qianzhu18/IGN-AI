import { describe, expect, it } from 'vitest'

import { hasRole } from './roles'

describe('hasRole', () => {
  it('allows an administrator through editor-level checks', () => {
    expect(hasRole({ role: 'admin' }, ['admin', 'editor'])).toBe(true)
  })

  it('does not grant a missing or unknown role', () => {
    expect(hasRole({}, ['admin'])).toBe(false)
    expect(hasRole({ role: 'viewer' }, ['admin', 'editor'])).toBe(false)
  })
})
