#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

loadEnvFile('.env.local')
loadEnvFile('.env')

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'
const NOTION_TOKEN =
  process.env.NOTION_API_TOKEN || process.env.NOTION_ACCESS_TOKEN || ''
const RECORDS_DATA_SOURCE_ID =
  process.env.NOTION_RECORDS_DATA_SOURCE_ID ||
  process.env.NOTION_MEMBERS_DATA_SOURCE_ID ||
  ''

const propertyNames = {
  title: process.env.NOTION_RECORDS_PROP_TITLE || 'title',
  type: process.env.NOTION_RECORDS_PROP_TYPE || 'type',
  status: process.env.NOTION_RECORDS_PROP_STATUS || 'status',
  slug: process.env.NOTION_RECORDS_PROP_SLUG || 'slug',
  summary: process.env.NOTION_RECORDS_PROP_SUMMARY || 'summary',
  tags: process.env.NOTION_RECORDS_PROP_TAGS || 'tags',
  ext: process.env.NOTION_RECORDS_PROP_EXT || 'ext'
}

const propertyValues = {
  recordType: process.env.NOTION_RECORDS_TYPE_VALUE || 'Record',
  published: process.env.NOTION_RECORDS_STATUS_PUBLISHED_VALUE || 'Published'
}

function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) return

    const key = trimmed.slice(0, separatorIndex).trim()
    if (!key || process.env[key]) return

    let value = trimmed.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  })
}

function printUsage() {
  console.log(`
Usage:
  node scripts/notion-records-smoke.js me
  node scripts/notion-records-smoke.js schema
  node scripts/notion-records-smoke.js query
  node scripts/notion-records-smoke.js parse-ext

Required env:
  NOTION_API_TOKEN

Optional env:
  NOTION_API_VERSION=2026-03-11
  NOTION_RECORDS_DATA_SOURCE_ID=
  NOTION_RECORDS_TYPE_VALUE=Record
  NOTION_RECORDS_STATUS_PUBLISHED_VALUE=Published
`)
}

function ensureToken() {
  if (!NOTION_TOKEN) throw new Error('Missing NOTION_API_TOKEN')
}

function ensureDataSourceId() {
  if (!RECORDS_DATA_SOURCE_ID) {
    throw new Error('Missing NOTION_RECORDS_DATA_SOURCE_ID')
  }
}

async function notionRequest(pathname, { method = 'GET', body } = {}) {
  ensureToken()
  const response = await fetch(`${API_BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(
      `Notion API ${method} ${pathname} failed: ${response.status} ${response.statusText}\n${JSON.stringify(
        data,
        null,
        2
      )}`
    )
  }

  return data
}

function stringifyRichText(items = []) {
  return items
    .map(item => item?.plain_text || item?.text?.content || '')
    .join('')
    .trim()
}

function readPagePropertyValue(property) {
  if (!property || typeof property !== 'object') return null
  switch (property.type) {
    case 'title':
      return stringifyRichText(property.title)
    case 'rich_text':
      return stringifyRichText(property.rich_text)
    case 'url':
      return property.url || ''
    case 'select':
      return property.select?.name || ''
    case 'status':
      return property.status?.name || ''
    case 'checkbox':
      return property.checkbox
    case 'number':
      return property.number
    case 'multi_select':
      return (property.multi_select || []).map(item => item.name).filter(Boolean)
    default:
      return property[property.type] ?? null
  }
}

function findPropertySchema(dataSource, logicalName) {
  const configuredName = propertyNames[logicalName]
  if (!configuredName) return null

  const direct = dataSource?.properties?.[configuredName]
  if (direct) return { key: configuredName, schema: direct }

  for (const [key, schema] of Object.entries(dataSource?.properties || {})) {
    if (schema?.name === configuredName) {
      return { key, schema }
    }
  }
  return null
}

function parseExt(rawExt) {
  if (!rawExt || typeof rawExt !== 'string') return null
  try {
    const parsed = JSON.parse(rawExt)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

async function getDataSource() {
  ensureDataSourceId()
  return notionRequest(`/data_sources/${RECORDS_DATA_SOURCE_ID}`)
}

async function commandMe() {
  const me = await notionRequest('/users/me')
  console.log(
    JSON.stringify(
      {
        object: me.object,
        id: me.id,
        name: me.name,
        type: me.type,
        bot_owner: me.bot?.owner?.workspace_name || null
      },
      null,
      2
    )
  )
}

async function commandSchema() {
  const dataSource = await getDataSource()
  const schema = Object.entries(dataSource.properties || {}).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type
  }))
  console.log(
    JSON.stringify(
      { id: dataSource.id, title: dataSource.title, properties: schema },
      null,
      2
    )
  )
}

async function fetchAllRecordPages() {
  ensureDataSourceId()
  const dataSource = await getDataSource()

  let allResults = []
  let cursor = null
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const resp = await notionRequest(
      `/data_sources/${RECORDS_DATA_SOURCE_ID}/query`,
      { method: 'POST', body }
    )
    allResults = allResults.concat(resp.results || [])
    cursor = resp.has_more ? resp.next_cursor : null
  } while (cursor)

  return { dataSource, allResults }
}

async function commandQuery() {
  const { dataSource, allResults } = await fetchAllRecordPages()

  const rows = allResults.map(page => {
    const output = { id: page.id, url: page.url }
    for (const logicalName of Object.keys(propertyNames)) {
      const propertyInfo = findPropertySchema(dataSource, logicalName)
      if (!propertyInfo) continue
      output[logicalName] = readPagePropertyValue(
        page.properties?.[propertyInfo.key]
      )
    }
    return output
  })

  console.log(JSON.stringify(rows, null, 2))
}

async function commandParseExt() {
  const { dataSource, allResults } = await fetchAllRecordPages()

  const typePropInfo = findPropertySchema(dataSource, 'type')
  const statusPropInfo = findPropertySchema(dataSource, 'status')

  const records = allResults.filter(page => {
    const type = readPagePropertyValue(page.properties?.[typePropInfo?.key])
    const status = readPagePropertyValue(page.properties?.[statusPropInfo?.key])
    return (
      type === propertyValues.recordType &&
      status === propertyValues.published
    )
  })

  const parsed = records.map(page => {
    const extPropInfo = findPropertySchema(dataSource, 'ext')
    const rawExt = extPropInfo
      ? readPagePropertyValue(page.properties?.[extPropInfo.key])
      : ''
    const ext = parseExt(rawExt) || {}

    return {
      id: page.id,
      title:
        readPagePropertyValue(
          page.properties?.[findPropertySchema(dataSource, 'title')?.key]
        ) || '',
      slug:
        readPagePropertyValue(
          page.properties?.[findPropertySchema(dataSource, 'slug')?.key]
        ) || '',
      ext: {
        recordType: ext.recordType || ext.record_type || '',
        dateText: ext.dateText || ext.date_text || '',
        timelineDate: ext.timelineDate || ext.timeline_date || '',
        timelineEndDate: ext.timelineEndDate || ext.timeline_end_date || '',
        dateStatus: ext.dateStatus || ext.date_status || '',
        location: ext.location || '',
        outcomes: Array.isArray(ext.outcomes) ? ext.outcomes : [],
        cover: ext.cover || ext.coverUrl || '',
        sourceFolder: ext.sourceFolder || ext.source_folder || ''
      }
    }
  })

  console.log(JSON.stringify({
    total_published_records: parsed.length,
    records: parsed
  }, null, 2))
}

async function main() {
  const command = process.argv[2]
  switch (command) {
    case 'me':
      await commandMe()
      return
    case 'schema':
      await commandSchema()
      return
    case 'query':
      await commandQuery()
      return
    case 'parse-ext':
      await commandParseExt()
      return
    case 'help':
    case '--help':
    case '-h':
    default:
      printUsage()
  }
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
