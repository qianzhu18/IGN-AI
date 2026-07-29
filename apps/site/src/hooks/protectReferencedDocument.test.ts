import { describe, expect, it, vi } from 'vitest'

import { protectReferencedDocument } from './protectReferencedDocument'

describe('protectReferencedDocument', () => {
  it('blocks deletion when a relationship still points at the document', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [{ id: 8, title: '关联文章' }] })
    const hook = protectReferencedDocument([
      { collection: 'posts', field: 'authors', label: '文章' },
    ])

    await expect(
      hook({ id: 3, req: { payload: { find } } } as never),
    ).rejects.toMatchObject({ status: 409 })
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'posts',
        draft: true,
        where: { authors: { equals: 3 } },
      }),
    )
  })

  it('allows deletion when no configured relationship exists', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    const hook = protectReferencedDocument([
      { collection: 'records', field: 'events', label: '社区记录' },
    ])

    await expect(hook({ id: 4, req: { payload: { find } } } as never)).resolves.toBeUndefined()
  })
})
