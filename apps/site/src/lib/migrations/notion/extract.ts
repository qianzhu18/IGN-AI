import { NotionMigrationClient } from './client'
import { mapNotionPage, mapSiteSettings } from './mapper'
import { createPropertyReader, firstString } from './properties'
import type { MigrationItem, NotionDataSource, NotionPage } from './types'

const supportedTypes = new Set(['Config', 'Event', 'Member', 'Page', 'Post', 'Record'])
const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

type ExtractOptions = {
  dataSourceIds: string[]
  limit?: number
  notionVersion?: string
  skipBlocks?: boolean
  token: string
  types?: string[]
}

export async function extractNotionMigrationItems(options: ExtractOptions) {
  const client = new NotionMigrationClient(options.token, options.notionVersion)
  const uniqueDataSourceIds = [...new Set(options.dataSourceIds.filter(Boolean))]
  if (uniqueDataSourceIds.length === 0) throw new Error('No NOTION_*_DATA_SOURCE_ID is configured')

  const pagesById = new Map<string, { dataSource: NotionDataSource; page: NotionPage }>()
  for (const dataSourceId of uniqueDataSourceIds) {
    const [dataSource, pages] = await Promise.all([
      client.getDataSource(dataSourceId),
      client.queryDataSource(dataSourceId),
    ])
    for (const page of pages) pagesById.set(page.id, { dataSource, page })
  }

  const requestedTypes = options.types?.length ? new Set(options.types) : supportedTypes
  const candidates = [...pagesById.values()]
    .filter(({ dataSource, page }) => {
      if (page.archived || page.in_trash) return false
      const read = createPropertyReader(page, dataSource)
      return requestedTypes.has(firstString(read(['type', 'Type'])))
    })
    .sort((left, right) => left.page.created_time.localeCompare(right.page.created_time))
    .slice(0, options.limit || undefined)

  const items: MigrationItem[] = []
  for (const { dataSource, page } of candidates) {
    const read = createPropertyReader(page, dataSource)
    const type = firstString(read(['type', 'Type']))
    if (type === 'Config') continue
    const blocks = options.skipBlocks ? [] : await client.getBlockTree(page.id)
    const item = mapNotionPage(page, dataSource, blocks)
    if (item) items.push(item)
    if (!options.skipBlocks) await delay(350)
  }

  const firstSource = candidates[0]?.dataSource || [...pagesById.values()][0]?.dataSource
  if (firstSource && requestedTypes.has('Config')) {
    const global = mapSiteSettings(
      [...pagesById.values()].map(({ page }) => page),
      firstSource,
    )
    if (global) items.unshift(global)
  }

  return {
    dataSourceCount: uniqueDataSourceIds.length,
    extractedPageCount: candidates.length,
    items,
    sourcePageCount: pagesById.size,
  }
}

export function resolveNotionDataSourceIds(environment: NodeJS.ProcessEnv) {
  const keys = [
    'NOTION_CONTENT_DATA_SOURCE_ID',
    'NOTION_EVENTS_DATA_SOURCE_ID',
    'NOTION_MEMBERS_DATA_SOURCE_ID',
    'NOTION_PAGES_DATA_SOURCE_ID',
    'NOTION_POSTS_DATA_SOURCE_ID',
    'NOTION_RECORDS_DATA_SOURCE_ID',
  ]
  return [...new Set(keys.map((key) => environment[key]?.trim()).filter((value): value is string => Boolean(value)))]
}
