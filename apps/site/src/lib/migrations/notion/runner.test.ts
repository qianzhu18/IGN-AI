import { describe, expect, it } from 'vitest'

import { validateMigrationItems } from './preflight'
import type { MigrationItem } from './types'

const item = (source: string): MigrationItem => ({
  checksum: source,
  data: {},
  errors: [],
  media: [],
  relations: [],
  slug: 'duplicate',
  sourceLastEditedAt: '2026-01-01T00:00:00.000Z',
  sourcePageIds: [source],
  target: 'posts',
  warnings: [],
})

describe('migration preflight', () => {
  it('marks every source row participating in a duplicate target slug', () => {
    const result = validateMigrationItems([item('one'), item('two')])
    expect(result.every((entry) => entry.errors[0] === 'Duplicate source slug posts:duplicate (2 rows)')).toBe(
      true,
    )
  })
})
