export function mergeOfficialPages(collectionPages = [], officialPages = []) {
  const officialById = new Map(
    officialPages.filter(page => page?.id).map(page => [page.id, page])
  )
  const seen = new Set()
  const merged = collectionPages.map(page => {
    if (!page?.id) return page
    seen.add(page.id)
    const official = officialById.get(page.id)
    if (!official) return page

    const mergedPage = { ...page, ...official }
    if (!official.coverPosition && page.coverPosition) {
      mergedPage.coverPosition = page.coverPosition
    }
    return mergedPage
  })

  for (const page of officialPages) {
    if (page?.id && !seen.has(page.id)) {
      merged.push(page)
    }
  }

  return merged
}
