// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData,
  fetchMembersFromOfficialAPI,
  fetchRecordsFromOfficialAPI
} from '@/lib/db/SiteDataApi'
import { mergeOfficialPages } from '@/lib/db/notion/mergeOfficialPages'
import {
  buildCommunitySitemapFields,
  renderSitemapXml
} from '@/lib/seo/sitemap'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')
  const [freshEvents, freshMembers, freshRecords] = await Promise.all([
    fetchEventsFromOfficialAPI(),
    fetchMembersFromOfficialAPI(),
    fetchRecordsFromOfficialAPI()
  ])

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    // 第一个id站点默认语言
    const siteData = await fetchGlobalAllData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const link = siteConfig(
      'LINK',
      siteData?.siteInfo?.link,
      siteData.NOTION_CONFIG
    )
    const localeFields = buildCommunitySitemapFields({
      link,
      locale,
      allPages: siteData.allPages,
      allMembers: freshMembers.length > 0 ? freshMembers : siteData.allMembers,
      allEvents: mergeOfficialPages(siteData.allEvents || [], freshEvents),
      allRecords: freshRecords.length > 0 ? freshRecords : siteData.allRecords
    })
    fields = fields.concat(localeFields)
  }

  fields = getUniqueFields(fields)

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  ctx.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  ctx.res.write(renderSitemapXml(fields))
  ctx.res.end()

  return {
    props: {}
  }
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map()

  fields.forEach(field => {
    const existingField = uniqueFieldsMap.get(field.loc)

    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueFieldsMap.set(field.loc, field)
    }
  })

  return Array.from(uniqueFieldsMap.values())
}

function SitemapXml() { }

export default SitemapXml
