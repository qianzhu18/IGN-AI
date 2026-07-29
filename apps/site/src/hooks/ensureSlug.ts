import type { CollectionBeforeValidateHook } from 'payload'

import { slugify } from '@/lib/slug'

export const ensureSlug: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  const explicitSlug = typeof data.slug === 'string' ? data.slug : ''
  const title = typeof data.title === 'string' ? data.title : ''
  data.slug = slugify(explicitSlug || originalDoc?.slug || title)
  return data
}
