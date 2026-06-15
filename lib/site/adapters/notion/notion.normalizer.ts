import { idToUuid } from 'notion-utils'
import type { SiteData } from '../../site.types'

type NotionRecordMap = {
  block?: unknown
}

function isNotionRecordMap(recordMap: unknown): recordMap is NotionRecordMap {
  return Boolean(recordMap && typeof recordMap === 'object')
}

export function normalizeNotionSite(
  recordMap: unknown,
  sitePageId: string,
  from?: string
): SiteData {
  void from
  sitePageId = idToUuid(sitePageId)

  // ⬇️ 原 convertNotionToSiteData 内容迁到这里
  // normalize metadata / collection / schema / pages
  // return SiteData（未清洗版）

  return {
    NOTION_CONFIG: {},
    siteInfo: {
      title: '',
      description: '',
      pageCover: '',
      icon: '',
      link: ''
    },
    notice: null,
    allPages: [],
    allMembers: [],
    allEvents: [],
    allNavPages: [],
    latestPosts: [],
    categoryOptions: [],
    tagOptions: [],
    customNav: [],
    customMenu: [],
    postCount: 0,
    block: isNotionRecordMap(recordMap) ? recordMap.block : undefined,
    schema: {},
    rawMetadata: {}
  }
}
