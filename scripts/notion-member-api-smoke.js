#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

loadEnvFile('.env.local')
loadEnvFile('.env')

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'
const NOTION_TOKEN =
  process.env.NOTION_API_TOKEN || process.env.NOTION_ACCESS_TOKEN || ''
const MEMBERS_DATA_SOURCE_ID = process.env.NOTION_MEMBERS_DATA_SOURCE_ID || ''

const propertyNames = {
  title: process.env.NOTION_MEMBERS_PROP_TITLE || 'title',
  type: process.env.NOTION_MEMBERS_PROP_TYPE || 'type',
  status: process.env.NOTION_MEMBERS_PROP_STATUS || 'status',
  slug: process.env.NOTION_MEMBERS_PROP_SLUG || 'slug',
  summary: process.env.NOTION_MEMBERS_PROP_SUMMARY || 'summary',
  avatar: process.env.NOTION_MEMBERS_PROP_AVATAR || 'avatar',
  quote: process.env.NOTION_MEMBERS_PROP_QUOTE || 'quote'
}

const propertyValues = {
  memberType: process.env.NOTION_MEMBERS_TYPE_VALUE || 'Member',
  published: process.env.NOTION_MEMBERS_STATUS_PUBLISHED_VALUE || 'Published',
  draft: process.env.NOTION_MEMBERS_STATUS_DRAFT_VALUE || 'Invisible'
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
  node scripts/notion-member-api-smoke.js me
  node scripts/notion-member-api-smoke.js search <query>
  node scripts/notion-member-api-smoke.js schema
  node scripts/notion-member-api-smoke.js schema-check
  node scripts/notion-member-api-smoke.js migrate-schema
  node scripts/notion-member-api-smoke.js query
  node scripts/notion-member-api-smoke.js create-draft --title "Qianzhu" [--slug "members/qianzhu"] [--summary "简介"] [--avatar "https://..."] [--quote "一句话"] [--role "Builder"] [--bio "成员简介"]
  node scripts/notion-member-api-smoke.js update-page --page-id PAGE_ID --set status=Published --set featured=true

Required env:
  NOTION_API_TOKEN

Optional env:
  NOTION_API_VERSION=2026-03-11
  NOTION_MEMBERS_DATA_SOURCE_ID=
  NOTION_MEMBERS_PROP_TITLE=title
  NOTION_MEMBERS_PROP_TYPE=type
  NOTION_MEMBERS_PROP_STATUS=status
  NOTION_MEMBERS_PROP_SLUG=slug
  NOTION_MEMBERS_PROP_SUMMARY=summary
  NOTION_MEMBERS_PROP_AVATAR=avatar
  NOTION_MEMBERS_PROP_QUOTE=quote
  NOTION_MEMBERS_TYPE_VALUE=Member
  NOTION_MEMBERS_STATUS_DRAFT_VALUE=Invisible
  NOTION_MEMBERS_STATUS_PUBLISHED_VALUE=Published
`)
}

function ensureToken() {
  if (!NOTION_TOKEN) {
    throw new Error('Missing NOTION_API_TOKEN')
  }
}

function ensureDataSourceId() {
  if (!MEMBERS_DATA_SOURCE_ID) {
    throw new Error('Missing NOTION_MEMBERS_DATA_SOURCE_ID')
  }
}

async function notionRequest(path, { method = 'GET', body } = {}) {
  ensureToken()
  const response = await fetch(`${API_BASE}${path}`, {
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
      `Notion API ${method} ${path} failed: ${response.status} ${response.statusText}\n${JSON.stringify(
        data,
        null,
        2
      )}`
    )
  }

  return data
}

function getFlag(name, fallback = '') {
  const index = process.argv.indexOf(name)
  if (index >= 0 && index + 1 < process.argv.length) {
    return process.argv[index + 1]
  }
  return fallback
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

function findPropertyByName(dataSource, propertyName) {
  if (!propertyName) return null

  const direct = dataSource?.properties?.[propertyName]
  if (direct) return { key: propertyName, schema: direct }

  for (const [key, schema] of Object.entries(dataSource?.properties || {})) {
    if (schema?.name === propertyName) {
      return { key, schema }
    }
  }

  return null
}

function richTextValue(content) {
  return [
    {
      type: 'text',
      text: { content: String(content) }
    }
  ]
}

function buildPropertyPayload(schema, value) {
  if (value === undefined || value === null || value === '') return null

  switch (schema.type) {
    case 'title':
      return { title: richTextValue(value) }
    case 'rich_text':
      return { rich_text: richTextValue(value) }
    case 'url':
      return { url: String(value) }
    case 'select':
      return { select: { name: String(value) } }
    case 'status':
      return { status: { name: String(value) } }
    case 'checkbox':
      return { checkbox: Boolean(value) }
    case 'number':
      return { number: Number(value) }
    default:
      throw new Error(
        `Unsupported property type for quick payload builder: ${schema.type}`
      )
  }
}

function slugifyTitle(title) {
  const ascii = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (ascii) return `members/${ascii}`
  return `members/member-${Date.now()}`
}

function extractTitle(result) {
  if (result.object === 'page') {
    for (const property of Object.values(result.properties || {})) {
      if (property?.type === 'title') {
        return stringifyRichText(property.title)
      }
    }
  }

  if (result.object === 'data_source') {
    return result.title?.[0]?.plain_text || result.name || ''
  }

  return result.url || result.id
}

async function getDataSource() {
  ensureDataSourceId()
  return notionRequest(`/data_sources/${MEMBERS_DATA_SOURCE_ID}`)
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

async function commandSearch(query) {
  const response = await notionRequest('/search', {
    method: 'POST',
    body: {
      query: query || undefined,
      page_size: 10
    }
  })

  const results = (response.results || []).map(item => ({
    object: item.object,
    id: item.id,
    title: extractTitle(item),
    url: item.url
  }))

  console.log(JSON.stringify(results, null, 2))
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
      {
        id: dataSource.id,
        title: dataSource.title,
        properties: schema
      },
      null,
      2
    )
  )
}

async function commandSchemaCheck() {
  const dataSource = await getDataSource()
  const sections = {
    global_required: [
      ['title', 'title'],
      ['type', 'select'],
      ['status', 'select'],
      ['slug', 'rich_text'],
      ['summary', 'rich_text'],
      ['date', 'date']
    ],
    member_required: [
      ['bio', 'rich_text'],
      ['role', 'rich_text'],
      ['avatar', 'url'],
      ['featured', 'checkbox'],
      ['verified', 'checkbox'],
      ['joinedAtText', 'rich_text'],
      ['quote', 'rich_text'],
      ['sortOrder', 'number'],
      ['social_github', 'url'],
      ['social_x', 'url'],
      ['social_linkedin', 'url'],
      ['website', 'url']
    ],
    post_author_mapping: [
      ['author', 'rich_text'],
      ['author_slug', 'rich_text']
    ],
    future_event_mapping: [
      ['event_start', 'date'],
      ['event_end', 'date'],
      ['location', 'rich_text'],
      ['organizer_slugs', 'rich_text']
    ]
  }

  const output = {}

  for (const [section, definitions] of Object.entries(sections)) {
    output[section] = definitions.map(([name, suggestedType]) => {
      const property = findPropertyByName(dataSource, name)
      return {
        name,
        expected_type: suggestedType,
        exists: Boolean(property),
        actual_type: property?.schema?.type || null
      }
    })
  }

  output.summary = Object.fromEntries(
    Object.entries(output).map(([section, items]) => [
      section,
      {
        present: items.filter(item => item.exists).length,
        missing: items.filter(item => !item.exists).map(item => item.name)
      }
    ])
  )

  console.log(JSON.stringify(output, null, 2))
}

async function commandQuery() {
  const dataSource = await getDataSource()
  const response = await notionRequest(
    `/data_sources/${MEMBERS_DATA_SOURCE_ID}/query`,
    {
      method: 'POST',
      body: {
        page_size: 10
      }
    }
  )

  const rows = (response.results || []).map(page => {
    const output = {
      id: page.id,
      url: page.url
    }

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

async function commandMigrateSchema() {
  const dataSource = await getDataSource()
  const existingKeys = new Set(Object.keys(dataSource.properties || {}))

  const fieldsToCreate = [
    { name: 'bio', type: 'rich_text' },
    { name: 'role', type: 'rich_text' },
    { name: 'avatar', type: 'url' },
    { name: 'featured', type: 'checkbox' },
    { name: 'verified', type: 'checkbox' },
    { name: 'joinedAtText', type: 'rich_text' },
    { name: 'quote', type: 'rich_text' },
    { name: 'sortOrder', type: 'number', number: { format: 'number' } },
    { name: 'social_github', type: 'url' },
    { name: 'social_x', type: 'url' },
    { name: 'social_linkedin', type: 'url' },
    { name: 'website', type: 'url' },
    { name: 'author', type: 'rich_text' },
    { name: 'author_slug', type: 'rich_text' },
    { name: 'event_start', type: 'date' },
    { name: 'event_end', type: 'date' },
    { name: 'location', type: 'rich_text' },
    { name: 'organizer_slugs', type: 'rich_text' }
  ]

  const missing = fieldsToCreate.filter(f => !existingKeys.has(f.name))
  if (missing.length === 0) {
    console.log(JSON.stringify({ status: 'all_fields_exist', created: 0, skipped: fieldsToCreate.length }, null, 2))
    return
  }

  const properties = {}
  for (const field of missing) {
    const def = { type: field.type }
    if (field.type === 'rich_text') def.rich_text = {}
    else if (field.type === 'url') def.url = {}
    else if (field.type === 'checkbox') def.checkbox = {}
    else if (field.type === 'number') def.number = field.number || {}
    else if (field.type === 'date') def.date = {}
    properties[field.name] = def
  }

  const updated = await notionRequest(
    `/data_sources/${MEMBERS_DATA_SOURCE_ID}`,
    {
      method: 'PATCH',
      body: { properties }
    }
  )

  const createdNames = missing.map(f => f.name)
  console.log(JSON.stringify({
    status: 'migration_complete',
    created: createdNames.length,
    created_fields: createdNames,
    skipped: fieldsToCreate.length - missing.length,
    total_fields: Object.keys(updated.properties || {}).length
  }, null, 2))
}

async function commandUpdatePage() {
  const pageId = getFlag('--page-id')
  if (!pageId) throw new Error('update-page requires --page-id')

  const fields = {}
  const pairs = process.argv.slice(3)
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i] === '--set' && i + 1 < pairs.length) {
      const [key, ...rest] = pairs[i + 1].split('=')
      if (key && rest.length) fields[key] = rest.join('=')
      i++
    }
  }

  if (Object.keys(fields).length === 0) throw new Error('update-page requires at least one --set key=value')

  const dataSource = await getDataSource()
  const properties = {}

  for (const [key, value] of Object.entries(fields)) {
    const propInfo = findPropertyByName(dataSource, key)
    if (!propInfo) {
      console.warn(`Skipping unknown property: ${key}`)
      continue
    }

    if (propInfo.schema.type === 'checkbox') {
      properties[propInfo.key] = { checkbox: ['true', '1', 'yes'].includes(value.toLowerCase()) }
    } else if (propInfo.schema.type === 'number') {
      properties[propInfo.key] = { number: Number(value) }
    } else if (propInfo.schema.type === 'url') {
      properties[propInfo.key] = { url: value }
    } else if (propInfo.schema.type === 'select') {
      properties[propInfo.key] = { select: { name: value } }
    } else if (propInfo.schema.type === 'status') {
      properties[propInfo.key] = { status: { name: value } }
    } else {
      properties[propInfo.key] = { [propInfo.schema.type]: richTextValue(value) }
    }
  }

  const updated = await notionRequest(`/pages/${pageId}`, {
    method: 'PATCH',
    body: { properties }
  })

  console.log(JSON.stringify({
    id: updated.id,
    url: updated.url,
    updated_fields: Object.keys(fields)
  }, null, 2))
}

async function commandCreateDraft() {
  const title = getFlag('--title')
  if (!title) {
    throw new Error('create-draft requires --title')
  }

  const summary = getFlag('--summary')
  const avatar = getFlag('--avatar')
  const quote = getFlag('--quote')
  const role = getFlag('--role')
  const bio = getFlag('--bio')
  const website = getFlag('--website')
  const github = getFlag('--github')
  const socialX = getFlag('--social-x')
  const linkedin = getFlag('--linkedin')
  const slug = getFlag('--slug', slugifyTitle(title))
  const dataSource = await getDataSource()
  const properties = {}

  const valuesByLogicalName = {
    title,
    type: propertyValues.memberType,
    status: propertyValues.draft,
    slug,
    summary,
    avatar,
    quote
  }

  const directPropertyValues = {
    bio,
    role,
    website,
    social_github: github,
    social_x: socialX,
    social_linkedin: linkedin
  }

  for (const [logicalName, rawValue] of Object.entries(valuesByLogicalName)) {
    const propertyInfo = findPropertySchema(dataSource, logicalName)
    if (!propertyInfo) continue

    const payload = buildPropertyPayload(propertyInfo.schema, rawValue)
    if (payload) {
      properties[propertyInfo.key] = payload
    }
  }

  for (const [propertyName, rawValue] of Object.entries(directPropertyValues)) {
    const propertyInfo = findPropertyByName(dataSource, propertyName)
    if (!propertyInfo) continue

    const payload = buildPropertyPayload(propertyInfo.schema, rawValue)
    if (payload) {
      properties[propertyInfo.key] = payload
    }
  }

  const created = await notionRequest('/pages', {
    method: 'POST',
    body: {
      parent: {
        data_source_id: MEMBERS_DATA_SOURCE_ID
      },
      properties
    }
  })

  console.log(
    JSON.stringify(
      {
        id: created.id,
        url: created.url,
        created_time: created.created_time
      },
      null,
      2
    )
  )
}

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'me':
      await commandMe()
      return
    case 'search':
      await commandSearch(process.argv.slice(3).join(' ').trim())
      return
    case 'list':
      await commandSearch('')
      return
    case 'schema':
      await commandSchema()
      return
    case 'schema-check':
      await commandSchemaCheck()
      return
    case 'migrate-schema':
      await commandMigrateSchema()
      return
    case 'query':
      await commandQuery()
      return
    case 'create-draft':
      await commandCreateDraft()
      return
    case 'update-page':
      await commandUpdatePage()
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
