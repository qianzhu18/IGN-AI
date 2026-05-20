import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds, block = {}) {
  const pageSet = new Set()
  const targetViewId = resolveTargetViewId(viewIds)

  // 策略1：page_sort（有顺序，但可能截断）
  if (collectionView && targetViewId) {
    const pageSort = getCollectionViewPageSort(collectionView, targetViewId)
    if (Array.isArray(pageSort) && pageSort.length > 0) {
      pageSort.forEach(id => pageSet.add(id))
    }
  }

  // ✅ 策略补充：优先使用当前选中 view 的 query 结果，补齐 page_sort 截断的记录
  // 旧实现会把所有 view 的结果并集起来，导致当前数据库页面配置的筛选条件失效。
  // 注意：补充的记录追加在末尾，不影响已有顺序
  if (collectionQuery && collectionId) {
    const viewQuery = getCollectionQueryView(collectionQuery, collectionId, targetViewId)
    if (viewQuery) {
      [
        viewQuery?.collection_group_results?.blockIds,
        viewQuery?.results?.blockIds,
        viewQuery?.blockIds
      ].forEach(ids => {
        if (Array.isArray(ids)) ids.forEach(id => pageSet.add(id))
      })
    }
  }

  // 过滤无权限
  // const accessibleIds = [...pageSet].filter(id => {
  //   const entry = block[id]
  //   if (!entry) return true
  //   return entry?.value?.role !== 'none' && entry?.value?.value?.role !== 'none'
  // })

  // console.log(`[getAllPageIds] 最终数量: ${accessibleIds.length}`)
  return [...pageSet]
}

function resolveTargetViewId(viewIds = []) {
  if (!Array.isArray(viewIds) || viewIds.length === 0) return null

  const groupIndex = Number(BLOG.NOTION_INDEX || 0)
  const normalizedIndex = groupIndex < 0
    ? Math.max(0, viewIds.length + groupIndex)
    : Math.min(groupIndex, viewIds.length - 1)

  return viewIds[normalizedIndex] || null
}

function getCollectionViewPageSort(collectionView, targetViewId) {
  const view = getViewRecord(collectionView, targetViewId)
  return view?.value?.value?.page_sort
}

function getCollectionQueryView(collectionQuery, collectionId, targetViewId) {
  const collectionEntry =
    collectionQuery?.[collectionId] ||
    collectionQuery?.[normalizeId(collectionId)]

  if (!collectionEntry) return null

  if (targetViewId) {
    return (
      getViewRecord(collectionEntry, targetViewId) ||
      Object.values(collectionEntry)[0] ||
      null
    )
  }

  return Object.values(collectionEntry)[0] || null
}

function getViewRecord(viewMap, targetViewId) {
  if (!viewMap || !targetViewId) return null

  return (
    viewMap?.[targetViewId] ||
    viewMap?.[normalizeId(targetViewId)] ||
    null
  )
}

function normalizeId(id) {
  return String(id || '').replace(/-/g, '')
}
