import { APIError, type CollectionBeforeDeleteHook, type CollectionSlug, type Where } from 'payload'

type Reference = {
  collection: CollectionSlug
  field: string
  label: string
}

export const protectReferencedDocument =
  (references: readonly Reference[]): CollectionBeforeDeleteHook =>
  async ({ id, req }) => {
    for (const reference of references) {
      const result = await req.payload.find({
        collection: reference.collection,
        depth: 0,
        draft: true,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        req,
        where: {
          [reference.field]: { equals: id },
        } as Where,
      })

      if (result.docs.length > 0) {
        const referringDocument = result.docs[0] as { id: number | string; title?: string }
        const title = referringDocument.title ? `“${referringDocument.title}”` : `#${referringDocument.id}`
        throw new APIError(
          `无法删除：${reference.label}${title}仍在引用这条内容。请先解除关系。`,
          409,
          undefined,
          true,
        )
      }
    }
  }

export const memberReferences = [
  { collection: 'events', field: 'organizers', label: '活动' },
  { collection: 'events', field: 'participants', label: '活动' },
  { collection: 'records', field: 'members', label: '社区记录' },
  { collection: 'posts', field: 'authors', label: '文章' },
] as const satisfies readonly Reference[]

export const eventReferences = [
  { collection: 'records', field: 'events', label: '社区记录' },
  { collection: 'posts', field: 'events', label: '文章' },
] as const satisfies readonly Reference[]

export const recordReferences = [
  { collection: 'posts', field: 'records', label: '文章' },
] as const satisfies readonly Reference[]

export const mediaReferences = [
  { collection: 'members', field: 'avatar', label: '成员' },
  { collection: 'members', field: 'seo.image', label: '成员' },
  { collection: 'events', field: 'cover', label: '活动' },
  { collection: 'events', field: 'seo.image', label: '活动' },
  { collection: 'records', field: 'cover', label: '社区记录' },
  { collection: 'records', field: 'gallery', label: '社区记录' },
  { collection: 'records', field: 'seo.image', label: '社区记录' },
  { collection: 'posts', field: 'cover', label: '文章' },
  { collection: 'posts', field: 'seo.image', label: '文章' },
  { collection: 'pages', field: 'seo.image', label: '页面' },
  { collection: 'join-submissions', field: 'profileDraft.avatar', label: '加入申请' },
] as const satisfies readonly Reference[]
