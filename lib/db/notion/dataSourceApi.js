/**
 * Notion Data Source API - Official API Implementation
 *
 * This module provides a reference implementation for fetching data from Notion
 * using the official Data Source API instead of the unofficial notion-client.
 *
 * Benefits over unofficial API:
 * - More stable and reliable (official Notion API)
 * - Better privacy (integration token, not public page scraping)
 * - Supports database queries with filters and sorts
 * - Returns page covers and icons directly
 *
 * Usage:
 * ```javascript
 * import { fetchDatabasePages, fetchPageWithCover } from './dataSourceApi'
 *
 * // Fetch all pages from a database
 * const pages = await fetchDatabasePages(databaseId, {
 *   filter: {
 *     property: 'Status',
 *     select: { equals: 'Published' }
 *   }
 * })
 *
 * // Fetch a single page with cover
 * const pageWithCover = await fetchPageWithCover(pageId)
 * ```
 *
 * Related issue: https://github.com/tangly1024/NotionNext/issues/3566
 */

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

/**
 * Make a request to the Notion API
 */
async function notionFetch(path, options = {}) {
  const token = process.env.NOTION_API_TOKEN
  if (!token) {
    throw new Error('NOTION_API_TOKEN environment variable is not set')
  }

  const url = `${API_BASE}${path}`
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
    ...options.headers
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API error: ${response.status} - ${error}`)
  }

  return response
}

/**
 * Fetch all pages from a database with pagination support
 *
 * @param {string} databaseId - The database ID
 * @param {object} options - Query options (filter, sort, etc.)
 * @returns {Promise<Array>} Array of page objects
 */
export async function fetchDatabasePages(databaseId, options = {}) {
  const allResults = []
  let cursor = null

  do {
    const body = {
      page_size: 100,
      ...options
    }

    if (cursor) {
      body.start_cursor = cursor
    }

    const response = await notionFetch(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const data = await response.json()
    allResults.push(...(data.results || []))
    cursor = data.has_more ? data.next_cursor : null
  } while (cursor)

  return allResults
}

/**
 * Fetch a single page with full details including cover
 *
 * The Data Source API query endpoint doesn't return page covers,
 * so we need to fetch each page individually using the Pages API.
 *
 * @param {string} pageId - The page ID
 * @returns {Promise<object>} Page object with cover
 */
export async function fetchPageWithCover(pageId) {
  const response = await notionFetch(`/pages/${pageId}`)
  return await response.json()
}

/**
 * Fetch multiple pages with covers in parallel
 *
 * @param {Array<string>} pageIds - Array of page IDs
 * @param {number} concurrency - Max concurrent requests (default: 10)
 * @returns {Promise<Array>} Array of page objects with covers
 */
export async function fetchPagesWithCovers(pageIds, concurrency = 10) {
  const results = []

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < pageIds.length; i += concurrency) {
    const batch = pageIds.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map(async (pageId) => {
        try {
          return await fetchPageWithCover(pageId)
        } catch (error) {
          console.warn(`Failed to fetch page ${pageId}:`, error.message)
          return null
        }
      })
    )
    results.push(...batchResults.filter(Boolean))
  }

  return results
}

/**
 * Extract image URL from Notion image object
 *
 * Notion returns images in different formats:
 * - external: { type: 'external', external: { url: '...' } }
 * - file: { type: 'file', file: { url: '...' } }
 * - emoji: { type: 'emoji', emoji: '🎉' }
 *
 * @param {object} image - Notion image object
 * @returns {string} Image URL or empty string
 */
export function extractImageUrl(image) {
  if (!image || typeof image !== 'object') return ''

  if (image.type === 'external') {
    return image.external?.url || ''
  }

  if (image.type === 'file') {
    return image.file?.url || ''
  }

  if (image.type === 'emoji') {
    return image.emoji || ''
  }

  return ''
}

/**
 * Extract property value from page properties
 *
 * Handles different property types:
 * - title: array of rich text objects
 * - rich_text: array of rich text objects
 * - select: { name: '...' }
 * - multi_select: array of { name: '...' }
 * - date: { start: '...', end: '...' }
 * - checkbox: boolean
 * - url: string
 *
 * @param {object} property - Notion property object
 * @returns {*} Extracted value
 */
export function extractPropertyValue(property) {
  if (!property) return null

  switch (property.type) {
    case 'title':
    case 'rich_text':
      return (property[property.type] || [])
        .map(text => text.plain_text)
        .join('')

    case 'select':
      return property.select?.name || null

    case 'multi_select':
      return (property.multi_select || []).map(item => item.name)

    case 'date':
      return property.date || null

    case 'checkbox':
      return property.checkbox

    case 'url':
      return property.url || null

    case 'number':
      return property.number

    default:
      return null
  }
}

/**
 * Map a Notion page to a simplified object
 *
 * @param {object} page - Notion page object
 * @param {object} options - Mapping options
 * @returns {object} Simplified page object
 */
export function mapPage(page, options = {}) {
  const { includeCover = true, propertyMapping = {} } = options

  const mapped = {
    id: page.id,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    url: page.url
  }

  // Add cover if requested
  if (includeCover && page.cover) {
    mapped.cover = extractImageUrl(page.cover)
  }

  // Add icon if present
  if (page.icon) {
    mapped.icon = extractImageUrl(page.icon)
  }

  // Map properties
  if (page.properties) {
    mapped.properties = {}

    for (const [key, property] of Object.entries(page.properties)) {
      const mappedKey = propertyMapping[key] || key
      mapped.properties[mappedKey] = extractPropertyValue(property)
    }
  }

  return mapped
}

/**
 * Example: Fetch published posts from a blog database
 *
 * @param {string} databaseId - Blog database ID
 * @returns {Promise<Array>} Array of published posts
 */
export async function fetchPublishedPosts(databaseId) {
  // Fetch all published pages
  const pages = await fetchDatabasePages(databaseId, {
    filter: {
      property: 'Status',
      select: { equals: 'Published' }
    },
    sorts: [
      { property: 'Date', direction: 'descending' }
    ]
  })

  // Fetch covers for each page
  const pageIds = pages.map(page => page.id)
  const pagesWithCovers = await fetchPagesWithCovers(pageIds)

  // Create a map for quick lookup
  const coverMap = new Map(
    pagesWithCovers.map(page => [page.id, page.cover])
  )

  // Merge covers into pages
  return pages.map(page => ({
    ...mapPage(page),
    cover: extractImageUrl(coverMap.get(page.id))
  }))
}
