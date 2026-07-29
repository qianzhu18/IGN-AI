import { APIError, type CollectionBeforeValidateHook } from 'payload'

import { validateReservedSlug } from '../lib/slug'

export const reserveSlugs = (reservedSlugs: readonly string[]): CollectionBeforeValidateHook =>
  ({ data }) => {
    if (!data) return data

    const validation = validateReservedSlug(
      typeof data.slug === 'string' ? data.slug : undefined,
      reservedSlugs,
    )
    if (validation !== true) throw new APIError(validation, 400, undefined, true)
    return data
  }
