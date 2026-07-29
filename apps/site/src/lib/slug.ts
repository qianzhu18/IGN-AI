export const slugify = (value: string) =>
  value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

export const RESERVED_ROOT_SLUGS = [
  'admin',
  'api',
  'cms-preview',
  'events',
  'graphql',
  'members',
  'next',
  'posts',
  'preview',
  'records',
] as const

export function validateReservedSlug(
  value: string | null | undefined,
  reservedSlugs: readonly string[],
): true | string {
  if (!value) return true

  const normalized = slugify(value)
  if (reservedSlugs.includes(normalized)) {
    return `“${normalized}” 是系统保留路径，请使用其他 slug。`
  }

  return true
}
