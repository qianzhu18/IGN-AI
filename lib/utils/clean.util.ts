type NamedTag = {
  name?: string
}

type PageWithTagItems = {
  tagItems?: NamedTag[]
}

function hasTagItems(page: unknown): page is PageWithTagItems {
  return Boolean(page && typeof page === 'object' && 'tagItems' in page)
}

export function cleanIds<T>(items?: T[]): T[] {
  if (!Array.isArray(items)) return []
  return items.map(item => {
    if (item && typeof item === 'object' && 'id' in item) {
      const { id, ...rest } = item as T & { id?: unknown }
      void id
      return rest as T
    }
    return item
  })
}

export function cleanPages<T>(pages?: T[], tagOptions?: NamedTag[]): T[] {
  if (!Array.isArray(pages)) return pages || []
  if (!Array.isArray(tagOptions)) return pages
  const validTags = new Set(
    tagOptions
      .map(tag => (typeof tag.name === 'string' ? tag.name : null))
      .filter(Boolean)
  )
  pages.forEach(page => {
    if (hasTagItems(page) && Array.isArray(page.tagItems)) {
      page.tagItems = page.tagItems.filter(
        tagItem => typeof tagItem.name === 'string' && validTags.has(tagItem.name)
      )
    }
  })
  return pages
}

export function shortenIds<T>(items?: T[]): T[] | undefined {
  if (!Array.isArray(items)) return items
  return items
}
