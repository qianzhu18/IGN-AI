#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const REQUIRED_PROPERTIES = {
  event_status: {
    select: {
      options: [
        { name: 'planning', color: 'yellow' },
        { name: 'ongoing', color: 'green' },
        { name: 'recap', color: 'blue' }
      ]
    }
  },
  event_format: {
    select: {
      options: [
        { name: 'offline', color: 'orange' },
        { name: 'online', color: 'blue' },
        { name: 'hybrid', color: 'purple' }
      ]
    }
  },
  public_listing: { checkbox: {} },
  registration_qr: { url: {} },
  cover_position: { rich_text: {} },
  related_event_slug: { rich_text: {} }
}

function requiredType(definition) {
  return Object.keys(definition)[0]
}

function buildSchemaPlan(properties = {}) {
  const additions = {}
  const existing = []
  const conflicts = []

  for (const [name, definition] of Object.entries(REQUIRED_PROPERTIES)) {
    const current = properties[name]
    const expected = requiredType(definition)

    if (!current) {
      additions[name] = definition
      continue
    }

    if (current.type !== expected) {
      conflicts.push({ name, expected, actual: current.type })
      continue
    }

    existing.push(name)
  }

  return { additions, existing, conflicts }
}

function loadEnvFile(filename) {
  const file = path.join(process.cwd(), filename)
  if (!fs.existsSync(file)) return

  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 0) continue

    const key = trimmed.slice(0, separator).trim()
    if (!key || process.env[key]) continue
    let value = trimmed.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

async function notionRequest(pathname, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
      'Notion-Version': process.env.NOTION_API_VERSION || '2026-03-11',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(
      `Notion ${options.method || 'GET'} ${pathname} failed (${response.status}): ${
        data.message || text
      }`
    )
  }

  return data
}

async function main() {
  loadEnvFile('.env.notion.local')
  loadEnvFile('.env.local')
  loadEnvFile('.env')

  const dataSourceId =
    process.env.NOTION_CONTENT_DATA_SOURCE_ID ||
    process.env.NOTION_EVENTS_DATA_SOURCE_ID ||
    process.env.NOTION_RECORDS_DATA_SOURCE_ID ||
    process.env.NOTION_MEMBERS_DATA_SOURCE_ID

  if (!process.env.NOTION_API_TOKEN) {
    throw new Error('Missing NOTION_API_TOKEN')
  }
  if (!dataSourceId) {
    throw new Error('Missing NOTION_CONTENT_DATA_SOURCE_ID')
  }

  const before = await notionRequest(`/data_sources/${dataSourceId}`)
  const plan = buildSchemaPlan(before.properties)
  const summary = {
    mode: process.argv.includes('--apply') ? 'apply' : 'dry-run',
    existing: plan.existing,
    additions: Object.keys(plan.additions),
    conflicts: plan.conflicts
  }
  console.log(JSON.stringify(summary, null, 2))

  if (plan.conflicts.length > 0) {
    throw new Error('Existing Notion fields have incompatible property types')
  }
  if (
    !process.argv.includes('--apply') ||
    Object.keys(plan.additions).length === 0
  ) {
    return
  }

  await notionRequest(`/data_sources/${dataSourceId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties: plan.additions })
  })

  const after = await notionRequest(`/data_sources/${dataSourceId}`)
  const verification = buildSchemaPlan(after.properties)
  if (
    Object.keys(verification.additions).length > 0 ||
    verification.conflicts.length > 0
  ) {
    throw new Error('Notion schema verification failed after update')
  }

  console.log(
    JSON.stringify(
      {
        applied: Object.keys(plan.additions),
        verified: verification.existing
      },
      null,
      2
    )
  )
}

module.exports = {
  REQUIRED_PROPERTIES,
  buildSchemaPlan
}

if (require.main === module) {
  main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}
