import type { CollectionBeforeValidateHook } from 'payload'

const cleanText = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''

export const ensureSEO: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  const currentSEO =
    data.seo && typeof data.seo === 'object'
      ? (data.seo as Record<string, unknown>)
      : originalDoc?.seo && typeof originalDoc.seo === 'object'
        ? (originalDoc.seo as Record<string, unknown>)
        : {}
  const title = cleanText(data.title || originalDoc?.title)
  const description = cleanText(
    data.excerpt || data.headline || originalDoc?.excerpt || originalDoc?.headline,
  )

  data.seo = {
    ...currentSEO,
    title: cleanText(currentSEO.title) || title.slice(0, 70),
    description: cleanText(currentSEO.description) || description.slice(0, 180),
  }

  return data
}
