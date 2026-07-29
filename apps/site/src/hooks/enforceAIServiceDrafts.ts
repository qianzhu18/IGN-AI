import type { CollectionBeforeChangeHook } from 'payload'

export const enforceAIServiceDrafts: CollectionBeforeChangeHook = ({ data, req }) => {
  if ((req.user as { role?: string } | null)?.role !== 'ai-service') return data

  return {
    ...data,
    _status: 'draft',
  }
}
