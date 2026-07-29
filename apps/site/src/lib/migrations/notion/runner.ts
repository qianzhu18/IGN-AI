import config from '@payload-config'
import { getPayload } from 'payload'

import type { ContentCollection } from '@/lib/contentCollections'

import { checksum, projectShape } from './checksum'
import { validateMigrationItems } from './preflight'
import type {
  MigrationItem,
  MigrationManifestEntry,
  MigrationTarget,
  RelationReference,
} from './types'

type ExistingDocument = {
  id: number | string
  slug?: string
  source?: { checksum?: string | null; notionPageId?: string | null }
}

const contentOrder: MigrationTarget[] = [
  'site-settings',
  'members',
  'events',
  'records',
  'posts',
  'pages',
]

const relationKey = (collection: ContentCollection, slug: string) => `${collection}:${slug}`

const sourceTracking = (item: MigrationItem) => ({
  checksum: item.checksum,
  lastSyncedAt: new Date().toISOString(),
  notionLastEditedAt: item.sourceLastEditedAt,
  notionPageId: item.sourcePageIds[0],
})

export async function runNotionMigration(items: MigrationItem[], apply: boolean) {
  const payload = await getPayload({ config })
  try {
    const relationIDs = new Map<string, number | string>()

  for (const collection of ['members', 'events', 'records', 'posts', 'pages'] as const) {
    const result = await payload.find({
      collection,
      depth: 0,
      draft: true,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
      select: { slug: true },
    })
    for (const document of result.docs) relationIDs.set(relationKey(collection, document.slug), document.id)
  }

  const entries: MigrationManifestEntry[] = []
  const sortedItems = validateMigrationItems(items).sort(
    (left, right) => contentOrder.indexOf(left.target) - contentOrder.indexOf(right.target),
  )

  for (const item of sortedItems) {
    const errors = [...item.errors]
    const warnings = [...item.warnings]
    const data = structuredClone(item.data)
    const resolvedRelations = resolveRelations(item.relations, relationIDs, errors, warnings)
    Object.assign(data, resolvedRelations)

    let existing: ExistingDocument | Record<string, unknown> | null = null
    if (item.target === 'site-settings') {
      existing = (await payload.findGlobal({
        depth: 0,
        draft: true,
        overrideAccess: true,
        slug: 'site-settings',
      })) as unknown as Record<string, unknown>
    } else {
      const sourceId = item.sourcePageIds[0]
      const bySource = await payload.find({
        collection: item.target,
        depth: 0,
        draft: true,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: { 'source.notionPageId': { equals: sourceId } },
      })
      existing = (bySource.docs[0] as ExistingDocument | undefined) || null

      if (!existing && item.slug) {
        const bySlug = await payload.find({
          collection: item.target,
          depth: 0,
          draft: true,
          limit: 1,
          overrideAccess: true,
          pagination: false,
          where: { slug: { equals: item.slug } },
        })
        const collision = bySlug.docs[0] as ExistingDocument | undefined
        if (collision) errors.push(`Slug collision with existing ${item.target} document #${collision.id}`)
      }
    }

    const existingChecksum =
      item.target === 'site-settings'
        ? checksum(projectShape(existing, data))
        : (existing as ExistingDocument | null)?.source?.checksum
    let action: MigrationManifestEntry['action'] = errors.length
      ? 'error'
      : existingChecksum === item.checksum
        ? 'unchanged'
        : existing
          ? 'update'
          : 'create'
    let targetId = item.target === 'site-settings' ? 'site-settings' : (existing as ExistingDocument | null)?.id

    if (apply && action !== 'error' && action !== 'unchanged') {
      if (item.target === 'site-settings') {
        await payload.updateGlobal({
          data: data as never,
          draft: true,
          overrideAccess: true,
          slug: 'site-settings',
        })
      } else {
        data.source = sourceTracking(item)
        const result = existing
          ? await payload.update({
              collection: item.target,
              data: data as never,
              draft: true,
              id: (existing as ExistingDocument).id,
              overrideAccess: true,
            })
          : await payload.create({
              collection: item.target,
              data: data as never,
              draft: true,
              overrideAccess: true,
            })
        targetId = result.id
        if (item.slug) relationIDs.set(relationKey(item.target, item.slug), result.id)
      }
    } else if (!apply && action === 'create' && item.slug && item.target !== 'site-settings') {
      relationIDs.set(relationKey(item.target, item.slug), `planned:${item.target}:${item.slug}`)
    }

    if (action === 'unchanged' && !existing) action = 'error'
    entries.push({
      action,
      checksum: item.checksum,
      errors,
      media: item.media,
      slug: item.slug,
      sourcePageIds: item.sourcePageIds,
      target: item.target,
      targetId,
      warnings,
    })
  }

    return entries
  } finally {
    await payload.destroy()
  }
}

function resolveRelations(
  relations: RelationReference[],
  ids: Map<string, number | string>,
  errors: string[],
  warnings: string[],
) {
  const resolved: Record<string, (number | string)[]> = {}
  for (const reference of relations) {
    const values: (number | string)[] = []
    const missing: string[] = []
    for (const slug of reference.slugs) {
      const id = ids.get(relationKey(reference.targetCollection, slug))
      if (id === undefined) missing.push(slug)
      else values.push(id)
    }
    if (missing.length) {
      const message = `${reference.field} missing ${reference.targetCollection}: ${missing.join(', ')}`
      if (reference.required) errors.push(message)
      else warnings.push(message)
    }
    if (values.length) resolved[reference.field] = values
  }
  return resolved
}
