#!/usr/bin/env node
/**
 * Hide generated Notion member seed rows.
 *
 * Default mode is dry-run. Use --apply to update matching Published members to
 * Invisible. This is intentionally reversible and does not archive/delete pages.
 *
 * Usage:
 *   node scripts/hide-generated-members.js
 *   node scripts/hide-generated-members.js --apply
 *   node scripts/hide-generated-members.js --apply --batch 10
 */

const fs = require('fs')
const path = require('path')

loadEnvFile('.env.local')
loadEnvFile('.env')

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'
const NOTION_TOKEN =
  process.env.NOTION_API_TOKEN || process.env.NOTION_ACCESS_TOKEN || ''
const MEMBERS_DATA_SOURCE_ID = process.env.NOTION_MEMBERS_DATA_SOURCE_ID || ''
const APPLY = process.argv.includes('--apply')
const BATCH_SIZE = Number(getFlag('--batch', '10'))

const PROPERTY_NAMES = {
  title: process.env.NOTION_MEMBERS_PROP_TITLE || 'title',
  type: process.env.NOTION_MEMBERS_PROP_TYPE || 'type',
  status: process.env.NOTION_MEMBERS_PROP_STATUS || 'status',
  slug: process.env.NOTION_MEMBERS_PROP_SLUG || 'slug',
  summary: process.env.NOTION_MEMBERS_PROP_SUMMARY || 'summary',
  avatar: process.env.NOTION_MEMBERS_PROP_AVATAR || 'avatar',
  role: process.env.NOTION_MEMBERS_PROP_ROLE || 'role',
  sortOrder: process.env.NOTION_MEMBERS_PROP_SORT_ORDER || 'sortOrder'
}

const STATUS = {
  published: process.env.NOTION_MEMBERS_STATUS_PUBLISHED_VALUE || 'Published',
  invisible: process.env.NOTION_MEMBERS_STATUS_DRAFT_VALUE || 'Invisible'
}

function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue

    const key = trimmed.slice(0, index).trim()
    if (!key || process.env[key]) continue

    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function getFlag(name, fallback = '') {
  const index = process.argv.indexOf(name)
  if (index >= 0 && index + 1 < process.argv.length) return process.argv[index + 1]
  return fallback
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function notionRequest(reqPath, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}${reqPath}`, {
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
      `Notion API ${method} ${reqPath} failed: ${response.status}\n${JSON.stringify(
        data,
        null,
        2
      )}`
    )
  }

  return data
}

function findPropertyKey(dataSource, propertyName) {
  if (dataSource.properties[propertyName]) return propertyName

  const expected = propertyName.toLowerCase()
  for (const [key, schema] of Object.entries(dataSource.properties || {})) {
    if (schema?.name?.toLowerCase() === expected) return key
  }

  return null
}

function readPropertyValue(property) {
  if (!property || typeof property !== 'object') return ''

  switch (property.type) {
    case 'title':
      return (property.title || []).map(item => item.plain_text || '').join('')
    case 'rich_text':
      return (property.rich_text || [])
        .map(item => item.plain_text || '')
        .join('')
    case 'url':
      return property.url || ''
    case 'select':
      return property.select?.name || ''
    case 'status':
      return property.status?.name || ''
    case 'number':
      return property.number == null ? '' : String(property.number)
    default:
      return ''
  }
}

function createReader(dataSource) {
  const keys = Object.fromEntries(
    Object.entries(PROPERTY_NAMES).map(([logicalName, propertyName]) => [
      logicalName,
      findPropertyKey(dataSource, propertyName)
    ])
  )

  return function read(page, logicalName) {
    const key = keys[logicalName]
    return key ? readPropertyValue(page.properties?.[key]) : ''
  }
}

function isGeneratedMember(page, read) {
  if (read(page, 'type') !== 'Member') return false

  const title = read(page, 'title')
  const slug = read(page, 'slug')
  const summary = read(page, 'summary')
  const avatar = read(page, 'avatar')
  const sortOrder = Number(read(page, 'sortOrder'))

  if (/^members\/member-\d+$/.test(slug)) return true
  if (/^P0 Avatar|^Codex Test|^Qian Qian$/.test(title)) return true
  if (summary === 'Avatar upload smoke test') return true
  if (/，(连接社区|关注 AI|创造内容|研究技术|探索产品)。$/.test(summary)) {
    return true
  }
  if (avatar.includes('api.dicebear.com/7.x/avataaars')) return true
  if (sortOrder >= 1 && sortOrder <= 220 && /，/.test(summary)) return true

  return false
}

function buildStatusPayload(dataSource, statusValue) {
  const statusKey = findPropertyKey(dataSource, PROPERTY_NAMES.status)
  const statusSchema = statusKey ? dataSource.properties[statusKey] : null
  if (!statusKey || !statusSchema) {
    throw new Error(`Missing status property: ${PROPERTY_NAMES.status}`)
  }

  if (statusSchema.type === 'status') {
    return { [statusKey]: { status: { name: statusValue } } }
  }

  return { [statusKey]: { select: { name: statusValue } } }
}

async function queryAllPages() {
  const pages = []
  let startCursor

  do {
    const body = { page_size: 100 }
    if (startCursor) body.start_cursor = startCursor
    const data = await notionRequest(`/data_sources/${MEMBERS_DATA_SOURCE_ID}/query`, {
      method: 'POST',
      body
    })
    pages.push(...(data.results || []))
    startCursor = data.has_more ? data.next_cursor : null
  } while (startCursor)

  return pages
}

async function main() {
  if (!NOTION_TOKEN) throw new Error('Missing NOTION_API_TOKEN')
  if (!MEMBERS_DATA_SOURCE_ID) {
    throw new Error('Missing NOTION_MEMBERS_DATA_SOURCE_ID')
  }

  const dataSource = await notionRequest(`/data_sources/${MEMBERS_DATA_SOURCE_ID}`)
  const read = createReader(dataSource)
  const pages = await queryAllPages()
  const members = pages.filter(page => read(page, 'type') === 'Member')
  const publishedMembers = members.filter(
    page => read(page, 'status') === STATUS.published
  )
  const generatedPublishedMembers = publishedMembers.filter(page =>
    isGeneratedMember(page, read)
  )
  const keepCandidates = publishedMembers.filter(
    page => !isGeneratedMember(page, read)
  )

  console.log('Generated member cleanup')
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`Members: ${members.length}`)
  console.log(`Published members: ${publishedMembers.length}`)
  console.log(`Generated-like published members: ${generatedPublishedMembers.length}`)
  console.log(`Published keep candidates: ${keepCandidates.length}`)

  console.log('\nSample generated rows:')
  generatedPublishedMembers.slice(0, 10).forEach((page, index) => {
    console.log(
      `${index + 1}. ${read(page, 'title')} | ${read(page, 'slug')} | ${read(
        page,
        'summary'
      )}`
    )
  })

  console.log('\nPublished keep candidates:')
  keepCandidates.slice(0, 20).forEach((page, index) => {
    console.log(
      `${index + 1}. ${read(page, 'title')} | ${read(page, 'slug')} | ${read(
        page,
        'role'
      )}`
    )
  })

  if (!APPLY) {
    console.log('\nNo changes made. Re-run with --apply to hide generated rows.')
    return
  }

  const payload = buildStatusPayload(dataSource, STATUS.invisible)
  let updated = 0
  for (let i = 0; i < generatedPublishedMembers.length; i += BATCH_SIZE) {
    const batch = generatedPublishedMembers.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async page => {
        await notionRequest(`/pages/${page.id}`, {
          method: 'PATCH',
          body: { properties: payload }
        })
        updated++
      })
    )
    process.stdout.write('.')
    await sleep(400)
  }

  console.log(`\nUpdated ${updated} generated-like members to ${STATUS.invisible}.`)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
