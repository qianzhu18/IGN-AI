#!/usr/bin/env node

/*
 * Keep the IGNAI public site and its shared Notion data source on one explicit
 * contract. Run without flags to review, then run with --apply to write.
 */
const fs = require('fs')
const path = require('path')

loadEnvFile('.env.notion.local')
loadEnvFile('.env.local')
loadEnvFile('.env')

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'
const TOKEN =
  process.env.NOTION_API_TOKEN || process.env.NOTION_ACCESS_TOKEN || ''
const DATA_SOURCE_ID =
  process.env.NOTION_CONTENT_DATA_SOURCE_ID ||
  process.env.NOTION_RECORDS_DATA_SOURCE_ID ||
  process.env.NOTION_EVENTS_DATA_SOURCE_ID ||
  process.env.NOTION_MEMBERS_DATA_SOURCE_ID ||
  ''
const APPLY = process.argv.includes('--apply')

const ABOUT_CONFIG = {
  title: '关于 IGNAI',
  description:
    'IGNAI / 洋来社是一个从长沙出发，连接高校学生、开发者、AI 产品实践者、内容创作者与青年创业者的 AI 行动社区。',
  hero: {
    eyebrow: 'About IGNAI',
    line1: '在 AGI 之前，',
    line2: '先彼此点燃。',
    copy: 'IGNAI 是社区面向外部的品牌表达，意为 Ignite Before AGI；洋来社是社区内部更亲近的称呼。我们从长沙出发，让年轻的 AI 行动者从看见 AI 走向真正参与和做出作品。'
  },
  stats: [
    { num: '300+', label: '核心社群成员' },
    { num: '2000+', label: '累计触达人次' },
    { num: '20+', label: 'AI 活动与社区联动' },
    { num: '长沙', label: '社区出发地' }
  ],
  mission: {
    eyebrow: 'Mission',
    title: '我们在做什么',
    paragraphs: [
      '我们关注 AI、Agent、产品、内容、创业和真实项目实践，通过线上共学、线下活动、黑客松、内容传播与项目共创，让更多年轻人从看见 AI 走向真正参与和做出作品。',
      '社区里的关系不会只停留在群聊和信息分享，而会继续走向共学、参赛、做 Demo、分享作品、加入项目和真实协作。'
    ]
  },
  faq: [
    {
      q: '谁会在这里？',
      a: '高校学生、开发者、AI 产品实践者、内容创作者与青年创业者。有人刚接触 AI，也有人已经在做产品和真实项目。'
    },
    {
      q: '这里会发生什么？',
      a: '线上共学、线下活动、黑客松、内容传播与项目共创。活动结束后，作品、关系和协作还会继续。'
    },
    {
      q: 'IGNAI 和洋来社是什么关系？',
      a: 'IGNAI 是面向外部的品牌表达，完整含义是 Ignite Before AGI；洋来社来自 younger 来玩的谐音，是社区内部更亲近的称呼。'
    }
  ],
  values: [
    {
      title: '先行动',
      desc: '不要等想清楚一切再开始。从小项目、小分享、小连接开始。'
    },
    {
      title: '先表达',
      desc: '把想法说出来，让它有机会被看见、被讨论、被连接。'
    },
    {
      title: '先连接',
      desc: '让群聊关系走向真实协作，让线上认识走向线下见面。'
    },
    {
      title: '持续做',
      desc: '社区不是一次活动，是持续的学习、实践、分享和彼此点燃。'
    }
  ],
  valuesTitle: '我们相信什么',
  cta: {
    title: 'Ignite before AGI.',
    copy: '如果你也愿意从看见 AI 走向真正参与和做出作品，来认识我们。带着好奇、项目或一个还没想清楚的问题都可以。',
    label: '加入社区',
    href: '/join'
  },
  officialIntro: {
    label: '查看完整社区与合作介绍',
    href: 'https://my.feishu.cn/docx/QaI1dMy6koIwWDxUqKMc1YHvnjc'
  }
}

const NAVIGATION_CONFIG = {
  items: [
    { label: '活动', href: '/events' },
    { label: '社区现场', href: '/records' },
    { label: '关于 IGNAI', href: '/about' }
  ]
}

const RECORD_EVENT_PAIRS = {
  'zhijisong-minicamp-changsha-2026': 'zhijisong-minicamp-changsha-2026',
  'guanchai-fde-camp': 'guanchai-fde-study-camp-2026',
  'guanchai-changli-ai-garden': 'guanchai-changli-ai-garden-2026',
  'guanchai-ai-product-manager-camp': 'guanchai-ai-product-manager-camp-2026',
  'lev0-minicamp-award-record': 'lev0-minicamp-hackathon-2026',
  '2050-cross-city-showcase': '2050-community-meetup-2026',
  'openclaw-sharing-record': 'malangshan-ai-agent-forum-2026',
  'sanrenxing-ai-community-bridge': 'sanrenxing-ai-changsha-2026',
  'datawhale-campus-promotion': 'datawhale-campus-promotion-2026'
}

function loadEnvFile(filename) {
  const file = path.join(process.cwd(), filename)
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 0) continue
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

function text(property) {
  const items = property?.title || property?.rich_text || []
  return items
    .map(item => item.plain_text || item.text?.content || '')
    .join('')
    .trim()
}

function value(property) {
  if (!property) return ''
  if (property.type === 'title' || property.type === 'rich_text')
    return text(property)
  if (property.type === 'select') return property.select?.name || ''
  if (property.type === 'status') return property.status?.name || ''
  return ''
}

function findProperty(dataSource, name) {
  if (dataSource.properties?.[name])
    return { key: name, schema: dataSource.properties[name] }
  for (const [key, schema] of Object.entries(dataSource.properties || {})) {
    if (schema?.name === name) return { key, schema }
  }
  throw new Error(`Missing Notion property: ${name}`)
}

function writeProperty(schema, rawValue) {
  if (schema.type === 'title')
    return { title: [{ text: { content: String(rawValue) } }] }
  if (schema.type === 'rich_text')
    return { rich_text: [{ text: { content: String(rawValue) } }] }
  if (schema.type === 'select') return { select: { name: String(rawValue) } }
  if (schema.type === 'status') return { status: { name: String(rawValue) } }
  throw new Error(`Unsupported property type for contract sync: ${schema.type}`)
}

function slugFromPage(page, fields) {
  return (
    value(page.properties?.[fields.slug.key])
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean)
      .pop() || ''
  )
}

async function notion(pathname, options = {}) {
  const response = await fetch(`${API_BASE}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const body = await response.text()
  const data = body ? JSON.parse(body) : {}
  if (!response.ok)
    throw new Error(
      `Notion ${options.method || 'GET'} ${pathname} failed (${response.status}): ${data.message || body}`
    )
  return data
}

async function getAllPages() {
  let cursor = null
  const pages = []
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const data = await notion(`/data_sources/${DATA_SOURCE_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
    pages.push(...(data.results || []))
    cursor = data.has_more ? data.next_cursor : null
  } while (cursor)
  return pages
}

function buildProperties(fields, entries) {
  return Object.fromEntries(
    entries.map(([field, rawValue]) => [
      fields[field].key,
      writeProperty(fields[field].schema, rawValue)
    ])
  )
}

async function createConfig(fields, title, slug, config) {
  const properties = buildProperties(fields, [
    ['title', title],
    ['type', 'Config'],
    ['status', 'Published'],
    ['slug', slug],
    ['summary', JSON.stringify(config)]
  ])
  await notion('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { data_source_id: DATA_SOURCE_ID },
      properties
    })
  })
}

async function updatePage(pageId, fields, entries) {
  await notion(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties: buildProperties(fields, entries) })
  })
}

async function main() {
  if (!TOKEN) throw new Error('Missing NOTION_API_TOKEN')
  if (!DATA_SOURCE_ID) throw new Error('Missing a NOTION_*_DATA_SOURCE_ID')

  const dataSource = await notion(`/data_sources/${DATA_SOURCE_ID}`)
  const fields = Object.fromEntries(
    ['title', 'type', 'status', 'slug', 'summary'].map(name => [
      name,
      findProperty(dataSource, name)
    ])
  )
  fields.relatedEventSlug = findProperty(dataSource, 'related_event_slug')
  const pages = await getAllPages()
  const rows = pages.map(page => ({
    page,
    title: value(page.properties?.[fields.title.key]),
    type: value(page.properties?.[fields.type.key]),
    status: value(page.properties?.[fields.status.key]),
    slug: slugFromPage(page, fields)
  }))
  const byTypeAndSlug = new Map(
    rows.map(row => [`${row.type}:${row.slug}`, row])
  )
  const actions = []

  for (const [slug, config] of Object.entries({
    about: ABOUT_CONFIG,
    navigation: NAVIGATION_CONFIG
  })) {
    const row = byTypeAndSlug.get(`Config:${slug}`)
    if (row) {
      const current = value(row.page.properties?.[fields.summary.key])
      const next = JSON.stringify(config)
      if (current !== next || row.status !== 'Published') {
        actions.push({
          kind: 'update-config',
          slug,
          run: () =>
            updatePage(row.page.id, fields, [
              ['status', 'Published'],
              ['summary', next]
            ])
        })
      }
    } else {
      actions.push({
        kind: 'create-config',
        slug,
        run: () =>
          createConfig(
            fields,
            `Config:${slug === 'about' ? 'About' : 'Navigation'}`,
            slug,
            config
          )
      })
    }
  }

  for (const [recordSlug, eventSlug] of Object.entries(RECORD_EVENT_PAIRS)) {
    const record = byTypeAndSlug.get(`Record:${recordSlug}`)
    const event = byTypeAndSlug.get(`Event:${eventSlug}`)
    if (!record || !event) {
      actions.push({
        kind: 'missing-relation-target',
        slug: `${recordSlug} -> ${eventSlug}`,
        run: null
      })
      continue
    }
    const currentEventSlug = value(
      record.page.properties?.[fields.relatedEventSlug.key]
    )
    if (currentEventSlug !== eventSlug) {
      actions.push({
        kind: 'link-record',
        slug: recordSlug,
        run: () =>
          updatePage(record.page.id, fields, [['relatedEventSlug', eventSlug]])
      })
    }
  }

  for (const [title, slug] of Object.entries({
    yy: 'yy',
    许全均: 'xu-quanjun'
  })) {
    const member = rows.find(
      row => row.type === 'Member' && row.title === title && !row.slug
    )
    if (member) {
      actions.push({
        kind: 'set-member-slug',
        slug,
        run: () => updatePage(member.page.id, fields, [['slug', slug]])
      })
    }
  }

  const counts = rows.reduce((result, row) => {
    const key = `${row.type || 'Unknown'}:${row.status || 'Unknown'}`
    result[key] = (result[key] || 0) + 1
    return result
  }, {})
  console.log(
    JSON.stringify(
      {
        mode: APPLY ? 'apply' : 'dry-run',
        rows: counts,
        planned: actions.map(({ kind, slug }) => ({ kind, slug }))
      },
      null,
      2
    )
  )

  const invalid = actions.filter(
    action => action.kind === 'missing-relation-target'
  )
  if (invalid.length)
    throw new Error(
      `Missing relation target(s): ${invalid.map(action => action.slug).join(', ')}`
    )
  if (!APPLY) return

  for (const action of actions) {
    await action.run()
    console.log(`applied ${action.kind}: ${action.slug}`)
  }
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
