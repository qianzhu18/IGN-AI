import BLOG from '@/blog.config'
import { notionFetch } from '../notion-fetch'
import {
  findDataSourcePropertyKey,
  readDataSourcePropertyValue
} from './memberDataSource'
import { readOfficialImage } from './officialImage'

const propertyNames = {
  title: ['title', 'Title'],
  type: ['type', 'Type'],
  status: ['status', 'Status'],
  slug: ['slug', 'Slug'],
  summary: ['summary', 'Summary'],
  category: ['category', 'Category'],
  tags: ['tags', 'Tags'],
  date: ['date', 'Date'],
  author: ['author', 'Author']
}

async function postNotionFetch(path, init) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await notionFetch(path, init)
    if (response.status !== 429 || attempt === 3) return response

    const retryAfter = Number(response.headers.get('retry-after'))
    const delayMs =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 1000 * 2 ** attempt
    await response.arrayBuffer()
    await new Promise(resolve => setTimeout(resolve, Math.min(delayMs, 10000)))
  }
}

function getProperty(page, schema, name) {
  const configured = process.env[`NOTION_POSTS_PROP_${name.toUpperCase()}`]
  const key = findDataSourcePropertyKey(
    schema,
    [
      configured,
      BLOG.NOTION_PROPERTY_NAME?.[name],
      ...propertyNames[name]
    ].filter(Boolean)
  )
  return key ? readDataSourcePropertyValue(page.properties?.[key]) : null
}

function toPost(page, schema) {
  const title = String(getProperty(page, schema, 'title') || '').trim()
  const rawSlug = String(getProperty(page, schema, 'slug') || '').replace(
    /^\/+|\/+$/g,
    ''
  )
  if (!title || !rawSlug) return null

  const slug = rawSlug.startsWith('article/') ? rawSlug : `article/${rawSlug}`
  const rawDate = String(
    getProperty(page, schema, 'date') || page.created_time || ''
  )
  const publishDate = new Date(rawDate).getTime()
  const cover = readOfficialImage(page.cover, page.id)
  const tags = getProperty(page, schema, 'tags')

  return {
    id: page.id,
    title,
    slug,
    href: `/${slug}`,
    type: 'Post',
    status: 'Published',
    summary: String(getProperty(page, schema, 'summary') || ''),
    category: String(getProperty(page, schema, 'category') || ''),
    tags: Array.isArray(tags) ? tags : [],
    author: String(getProperty(page, schema, 'author') || ''),
    publishDate: Number.isFinite(publishDate) ? publishDate : 0,
    publishDay: rawDate.slice(0, 10),
    pageCover: cover,
    pageCoverThumbnail: cover
  }
}

/**
 * Published Post rows must be readable even when Notion's legacy
 * loadPageChunk endpoint denies the site's collection view.
 * Returns null for an unavailable source and [] for a valid empty source.
 */
export async function fetchPublishedPostsFromOfficialAPI() {
  const dataSourceId =
    process.env.NOTION_POSTS_DATA_SOURCE_ID ||
    process.env.NOTION_CONTENT_DATA_SOURCE_ID
  if (!process.env.NOTION_API_TOKEN || !dataSourceId) return null

  try {
    const schemaResponse = await postNotionFetch(
      `/data_sources/${dataSourceId}`
    )
    if (!schemaResponse.ok)
      throw new Error(`schema HTTP ${schemaResponse.status}`)
    const schema = await schemaResponse.json()
    const results = []
    let cursor = null

    do {
      const body = { page_size: 100 }
      if (cursor) body.start_cursor = cursor
      const response = await postNotionFetch(
        `/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          body: JSON.stringify(body)
        }
      )
      if (!response.ok) throw new Error(`query HTTP ${response.status}`)
      const data = await response.json()
      results.push(...(data.results || []))
      cursor = data.has_more ? data.next_cursor : null
    } while (cursor)

    return results
      .filter(
        page =>
          getProperty(page, schema, 'type') === 'Post' &&
          getProperty(page, schema, 'status') === 'Published'
      )
      .map(page => toPost(page, schema))
      .filter(Boolean)
      .sort((a, b) => b.publishDate - a.publishDate)
  } catch (error) {
    console.warn('[POST-SYNC] Official Post fetch failed:', error.message)
    return null
  }
}

export async function fetchOfficialPostBlocks(pageId) {
  if (!pageId || !process.env.NOTION_API_TOKEN) return null
  const blocks = []
  let cursor = null
  try {
    do {
      const suffix = cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''
      const response = await postNotionFetch(
        `/blocks/${pageId}/children?page_size=100${suffix}`
      )
      if (!response.ok) throw new Error(`blocks HTTP ${response.status}`)
      const data = await response.json()
      blocks.push(...(data.results || []))
      cursor = data.has_more ? data.next_cursor : null
    } while (cursor)
    return blocks
  } catch (error) {
    console.warn('[POST-SYNC] Official Post blocks failed:', error.message)
    return null
  }
}
