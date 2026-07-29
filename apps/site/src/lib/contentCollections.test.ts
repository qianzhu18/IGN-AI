import { describe, expect, it } from 'vitest'

import { CONTENT_COLLECTIONS, getPreviewPath, isContentCollection } from './contentCollections'

describe('content collection preview contract', () => {
  it('covers every M1 public content collection', () => {
    expect(CONTENT_COLLECTIONS).toEqual(['members', 'events', 'records', 'posts', 'pages'])
    expect(CONTENT_COLLECTIONS.every(isContentCollection)).toBe(true)
  })

  it('builds an encoded preview workspace path', () => {
    expect(getPreviewPath('records', '长沙 现场')).toBe(
      '/cms-preview/records/%E9%95%BF%E6%B2%99%20%E7%8E%B0%E5%9C%BA',
    )
  })
})
