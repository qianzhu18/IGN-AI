import type { CollectionConfig } from 'payload'

export const CONTENT_COLLECTIONS = ['members', 'events', 'records', 'posts', 'pages'] as const

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number]

export const isContentCollection = (value: string): value is ContentCollection =>
  CONTENT_COLLECTIONS.includes(value as ContentCollection)

export const getPreviewPath = (collection: ContentCollection, slug: unknown) => {
  const safeSlug = typeof slug === 'string' && slug ? encodeURIComponent(slug) : 'preview'
  return `/cms-preview/${collection}/${safeSlug}`
}

const serverURL = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const getPreviewURL = (collection: ContentCollection, slug: unknown) => {
  const params = new URLSearchParams({
    path: getPreviewPath(collection, slug),
    previewSecret: process.env.PREVIEW_SECRET || '',
  })
  return `${serverURL()}/next/preview?${params.toString()}`
}

export const previewAdmin = (
  collection: ContentCollection,
): Pick<NonNullable<CollectionConfig['admin']>, 'livePreview' | 'preview'> => ({
  livePreview: {
    url: ({ data }) => getPreviewURL(collection, data?.slug),
  },
  preview: (data) => getPreviewURL(collection, data?.slug),
})
