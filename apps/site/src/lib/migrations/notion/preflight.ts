import type { MigrationItem } from './types'

export function validateMigrationItems(items: MigrationItem[]): MigrationItem[] {
  const result = items.map((item) => ({ ...item, errors: [...item.errors] }))
  const slugOwners = new Map<string, MigrationItem[]>()

  for (const item of result) {
    if (!item.slug || item.target === 'site-settings') continue
    const key = `${item.target}:${item.slug}`
    const owners = slugOwners.get(key) || []
    owners.push(item)
    slugOwners.set(key, owners)
  }

  for (const [key, owners] of slugOwners) {
    if (owners.length < 2) continue
    for (const owner of owners) owner.errors.push(`Duplicate source slug ${key} (${owners.length} rows)`)
  }

  return result
}
