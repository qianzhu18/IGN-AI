import type { ContentCollection } from '@/lib/contentCollections'

export type NotionRichText = {
  annotations?: {
    bold?: boolean
    code?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
  }
  href?: string | null
  plain_text?: string
  text?: { content?: string }
  type?: string
}

export type NotionProperty = {
  [key: string]: unknown
  type?: string
}

export type NotionPage = {
  archived?: boolean
  cover?: Record<string, unknown> | null
  created_time: string
  id: string
  in_trash?: boolean
  last_edited_time: string
  object: 'page'
  properties: Record<string, NotionProperty>
  url?: string
}

export type NotionDataSource = {
  id: string
  properties: Record<string, { name?: string; type?: string }>
  title?: NotionRichText[]
}

export type NotionBlock = {
  [key: string]: unknown
  children?: NotionBlock[]
  has_children?: boolean
  id: string
  type: string
}

export type MediaCandidate = {
  field: string
  kind: 'cover' | 'file' | 'image'
  url: string
}

export type RelationReference = {
  field: string
  required?: boolean
  slugs: string[]
  targetCollection: ContentCollection
}

export type MigrationTarget = ContentCollection | 'site-settings'

export type MigrationItem = {
  checksum: string
  data: Record<string, unknown>
  errors: string[]
  media: MediaCandidate[]
  relations: RelationReference[]
  slug?: string
  sourceLastEditedAt: string
  sourcePageIds: string[]
  target: MigrationTarget
  warnings: string[]
}

export type MigrationAction = 'create' | 'error' | 'unchanged' | 'update'

export type MigrationManifestEntry = {
  action: MigrationAction
  checksum: string
  errors: string[]
  media: MediaCandidate[]
  slug?: string
  sourcePageIds: string[]
  target: MigrationTarget
  targetId?: number | string
  warnings: string[]
}
