#!/usr/bin/env node

/*
 * One-time, review-first cleanup for content created before the
 * NotionNext-native MCP write contract.
 *
 * Dry-run is the default. Pass --apply only after reviewing the full plan.
 * Unknown ext keys block the whole apply so no legacy content is discarded.
 */
const fs = require('fs')
const path = require('path')

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'
const OFFICIAL_INTRO_URL =
  'https://my.feishu.cn/docx/QaI1dMy6koIwWDxUqKMc1YHvnjc'

const SUPPORTED_RECORD_EXT_KEYS = new Set([
  'recordType',
  'record_type',
  'dateText',
  'date_text',
  'timelineDate',
  'timeline_date',
  'timelineEndDate',
  'timeline_end_date',
  'dateStatus',
  'date_status',
  'location',
  'outcomes',
  'cover',
  'coverUrl',
  'sourceFolder',
  'source_folder'
])

const DUPLICATE_RECORD_SLUGS = new Set([
  'malangshan-ai-agent-local-connection',
  '2050-community-meetup-and-demo',
  'sanrenxing-ai-changsha-community-partner',
  'changsha-ai-geekathon-2025'
])

const STALE_TEMPLATE_PAGE_IDS = new Set([
  '18be45c4-da1e-832c-8d16-013eb9899c66',
  'b97e45c4-da1e-834d-bba0-816387355d24',
  '76ae45c4-da1e-83f7-b7a9-01a55317719b',
  'dbae45c4-da1e-83ec-af49-0135575f07c7',
  '1c1e45c4-da1e-828e-95c5-819ec226c6b7',
  'b7ae45c4-da1e-82d6-b7db-81d92c074251',
  'f68e45c4-da1e-830e-9a41-815675cae314'
])

const EMPTY_EXTERNAL_CONTEST_ID = '375e45c4-da1e-8086-a5e6-e4f8ddbc70c3'

const AIPO_BODY = `## 这场活动是什么

逢在 AGI 之路 AIPO 校园 AI 创投活动湖南大学站，是当时以“高校青年 AI 联盟”名义组织的一次跨校校园活动。参与者来自长沙理工大学、湖南大学、中南大学、湖南师范大学、长沙师范学院、长沙医学院等高校。

## 活动怎么进行

活动把 AI 项目 idea、现场路演、虚拟货币投资、项目交易和最终评奖串成一套参与式流程。活动前通过线上群完成预热、招募、答疑和规则讲解；现场完成物料布置、主持、流程推进，并引导参与者介绍自己的项目或想法。

## 已确认结果

- 100+ 线上触达
- 40+ 线下到场
- 形成一次跨校校园 AI 活动节点

这条记录保留为 Invisible 草稿。具体日期、可公开照片和后续项目结果补证后，再决定是否发布。`

const ORIGIN_BODY = `## 从活动现场长出来

IGNAI 不是从一篇宣言开始的。最早是一群在长沙参加活动、做项目、交流工具的人反复遇见：一次活动里认识，下一次见面继续讨论，再后来开始一起协助现场、分享作品和连接新的伙伴。

## 为什么要继续做

一次活动结束以后，群聊很容易沉下去，刚建立的关系也容易散开。我们想保留的不是报名名单，而是那些愿意继续出现的人：愿意再参加一次活动、把一个想法做成 Demo、分享一次真实经验，或者帮助另一个人找到项目和伙伴。

## 我们现在怎样做

- 通过线上共学和线下活动，让关注 AI 的人真实见面。
- 通过项目实践、黑客松和作品分享，让想法进入可展示、可反馈的状态。
- 通过活动记录和社区官网，把已经发生的事情保存下来，而不是重新包装成口号。

IGNAI 是面向外部的品牌表达，含义是 Ignite Before AGI；“洋来社”是社区内部更亲近的称呼。我们从长沙出发，继续连接愿意学习、表达、行动和协作的人。`

const DATAWHALE_EVIDENCE_BODY = `## 现有证据边界

现有材料只能确认 IGNAI 曾出现在 Datawhale 相关高校合作伙伴物料中。当前不能确认具体活动名称、发生时间、IGNAI 的执行职责、公开活动链接和最终结果，因此这条内容不作为完整活动故事发布。

## 发布前待补齐

- 活动正式名称和准确时间
- IGNAI 的具体身份与工作内容
- 可公开的活动链接或主办方说明
- 可以核验的参与结果或后续沉淀`

const BLOGGER_EVIDENCE_BODY = `## 现有证据边界

现有材料只能确认 IGNAI 曾出现在观猹「谁能成为百万博主」相关合作物料中。当前不能确认具体职责、活动链接、发生时间和最终结果，因此不继续把它扩写成完整公开故事。

## 发布前待补齐

- 合作发生的准确时间与活动链接
- IGNAI 具体承担的工作
- 可核验的传播、参与或后续结果`

function basePlan(row = {}) {
  return {
    id: row.id || '',
    slug: row.slug || '',
    type: row.type || '',
    reason: '',
    properties: {},
    replaceBodyMarkdown: '',
    archive: false,
    blocked: false,
    error: ''
  }
}

function appendReason(plan, reason) {
  if (!reason) return
  plan.reason = plan.reason ? `${plan.reason}; ${reason}` : reason
}

function parseExt(rawExt) {
  if (!rawExt || !String(rawExt).trim()) return { kind: 'empty' }
  let parsed
  try {
    parsed = JSON.parse(rawExt)
  } catch (error) {
    return { kind: 'invalid', error: `Invalid ext JSON: ${error.message}` }
  }
  if (Array.isArray(parsed)) {
    return parsed.length === 0
      ? { kind: 'placeholder' }
      : { kind: 'invalid', error: 'Non-empty ext arrays require manual review' }
  }
  if (!parsed || typeof parsed !== 'object') {
    return { kind: 'invalid', error: 'ext must be an object or an empty array' }
  }
  if (Object.keys(parsed).length === 0) return { kind: 'placeholder' }
  const unknownKeys = Object.keys(parsed).filter(
    key => !SUPPORTED_RECORD_EXT_KEYS.has(key)
  )
  if (unknownKeys.length > 0) {
    return {
      kind: 'unsupported',
      error: `Unsupported ext keys: ${unknownKeys.sort().join(', ')}`,
      parsed
    }
  }
  return { kind: 'legacy-record', parsed }
}

function applyExtRule(row, plan) {
  const ext = parseExt(row.ext)
  if (ext.kind === 'empty') return ext
  if (ext.kind === 'placeholder') {
    plan.properties.ext = ''
    appendReason(plan, 'clear meaningless empty ext placeholder')
    return ext
  }
  if (ext.kind === 'invalid' || ext.kind === 'unsupported') {
    plan.blocked = true
    plan.error = ext.error
  }
  return ext
}

function planContentCleanup(row = {}) {
  const plan = basePlan(row)
  const ext = applyExtRule(row, plan)
  if (plan.blocked) return plan

  if (STALE_TEMPLATE_PAGE_IDS.has(row.id)) {
    plan.archive = true
    appendReason(plan, 'archive stale NotionNext template navigation/content')
  }

  if (row.id === EMPTY_EXTERNAL_CONTEST_ID) {
    plan.archive = true
    appendReason(plan, 'archive empty external contest with no IGNAI context')
  }

  if (DUPLICATE_RECORD_SLUGS.has(row.slug)) {
    if (ext.kind === 'legacy-record') plan.properties.ext = ''
    plan.archive = true
    appendReason(
      plan,
      'archive duplicate Record; canonical Published record already exists'
    )
  }

  if (row.slug === 'ignai-community-proof-ledger') {
    plan.archive = true
    appendReason(
      plan,
      'archive internal proof ledger accidentally modeled as a Record'
    )
  }

  if (row.slug === 'guanchai-fde-camp') {
    plan.archive = true
    appendReason(
      plan,
      'archive premature recap while the Event is still ongoing'
    )
  }

  if (row.slug === 'guanchai-changli-ai-garden-2026') {
    plan.archive = true
    appendReason(
      plan,
      'archive redundant Event with an unsupported fabricated date'
    )
  }

  if (row.slug === 'aipo-hunan-university-field-note') {
    if (ext.kind !== 'legacy-record' && ext.kind !== 'empty') {
      plan.blocked = true
      plan.error =
        'AIPO migration expected supported legacy Record ext or an already-migrated empty ext'
      return plan
    }
    plan.properties.category = '活动现场'
    plan.properties.date = null
    plan.properties.location = '湖南大学'
    if (ext.kind === 'legacy-record') plan.properties.ext = ''
    plan.replaceBodyMarkdown = AIPO_BODY
    appendReason(
      plan,
      'migrate AIPO legacy fields and replace internal placeholder body'
    )
  } else if (ext.kind === 'legacy-record' && !plan.archive) {
    plan.blocked = true
    plan.error =
      'Supported legacy Record ext requires an explicit migration rule'
    return plan
  }

  if (row.slug === 'ignai-community-origin-story') {
    plan.properties.date = null
    plan.replaceBodyMarkdown = ORIGIN_BODY
    appendReason(
      plan,
      'replace internal placeholder body and remove fabricated date'
    )
  }

  if (row.slug === 'datawhale-campus-promotion') {
    plan.properties.status = 'Invisible'
    plan.properties.relatedEventSlug = ''
    plan.properties.summary =
      '现有材料只能确认 IGNAI 曾出现在 Datawhale 高校合作伙伴物料中；具体活动、职责、时间和结果仍待补证。'
    plan.replaceBodyMarkdown = DATAWHALE_EVIDENCE_BODY
    appendReason(plan, 'downgrade evidence-only Record that was over-expanded')
  }

  if (row.slug === 'guanchai-million-creator') {
    plan.properties.status = 'Invisible'
    plan.properties.summary =
      '现有材料只能确认 IGNAI 曾出现在观猹相关合作物料中；具体职责、时间、链接和结果仍待补证。'
    plan.replaceBodyMarkdown = BLOGGER_EVIDENCE_BODY
    appendReason(plan, 'downgrade evidence-only Record that was over-expanded')
  }

  if (row.slug === 'datawhale-campus-promotion-2026') {
    plan.properties.status = 'Invisible'
    plan.properties.publicListing = false
    plan.properties.date = null
    plan.properties.eventStart = null
    plan.properties.summary =
      '现有材料只能确认 IGNAI 出现在 Datawhale 高校合作伙伴物料中；具体活动、职责、时间和结果仍待补证。'
    plan.replaceBodyMarkdown = DATAWHALE_EVIDENCE_BODY
    appendReason(plan, 'hide unsupported Event and remove fabricated date')
  }

  if (row.slug === 'guanchai-changli-ai-garden') {
    plan.properties.relatedEventSlug = ''
    appendReason(plan, 'remove relationship to redundant archived Event')
  }

  if (row.slug === 'guanchai-ai-product-manager-camp-2026') {
    plan.properties.date = null
    plan.properties.eventStart = null
    appendReason(
      plan,
      'remove unsupported exact date while preserving the valid camp page'
    )
  }

  if (row.slug === 'lev0-minicamp-hackathon-2026') {
    plan.properties.date = { start: '2026-06-14' }
    plan.properties.eventStart = { start: '2026-06-14' }
    plan.properties.location = '长沙 · 岳麓山实验室'
    appendReason(plan, 'align Event date and location with the verified recap')
  }

  return plan
}

function loadEnvFile(filename) {
  if (!filename || !fs.existsSync(filename)) return
  for (const line of fs.readFileSync(filename, 'utf8').split(/\r?\n/)) {
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

function loadProjectEnv() {
  const candidates = [
    process.env.NOTION_ENV_FILE,
    path.join(process.cwd(), '.env.notion.local'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '..', '..', '.env.notion.local'),
    path.join(process.cwd(), '..', '..', '.env.local'),
    path.join(process.cwd(), '..', '..', '.env')
  ]
  for (const candidate of candidates) loadEnvFile(candidate)
}

function text(property) {
  return (property?.title || property?.rich_text || [])
    .map(item => item?.plain_text || item?.text?.content || '')
    .join('')
    .trim()
}

function value(property) {
  if (!property) return ''
  if (property.type === 'title' || property.type === 'rich_text')
    return text(property)
  if (property.type === 'select') return property.select?.name || ''
  if (property.type === 'status') return property.status?.name || ''
  if (property.type === 'date') return property.date || null
  if (property.type === 'checkbox') return property.checkbox === true
  return ''
}

function findProperty(dataSource, name) {
  if (dataSource.properties?.[name]) {
    return { key: name, schema: dataSource.properties[name] }
  }
  for (const [key, schema] of Object.entries(dataSource.properties || {})) {
    if (schema?.name === name) return { key, schema }
  }
  throw new Error(`Missing Notion property: ${name}`)
}

function normalizePage(page, fields) {
  return {
    id: page.id,
    title: value(page.properties?.[fields.title.key]),
    type: value(page.properties?.[fields.type.key]),
    status: value(page.properties?.[fields.status.key]),
    slug: value(page.properties?.[fields.slug.key]),
    summary: value(page.properties?.[fields.summary.key]),
    category: value(page.properties?.[fields.category.key]),
    date: value(page.properties?.[fields.date.key]),
    location: value(page.properties?.[fields.location.key]),
    relatedEventSlug: value(page.properties?.[fields.relatedEventSlug.key]),
    eventStart: value(page.properties?.[fields.eventStart.key]),
    publicListing: value(page.properties?.[fields.publicListing.key]),
    ext: value(page.properties?.[fields.ext.key]),
    inTrash: page.in_trash === true
  }
}

function richText(rawValue) {
  if (rawValue === '') return []
  return [{ type: 'text', text: { content: String(rawValue) } }]
}

function writeProperty(schema, rawValue) {
  if (schema.type === 'rich_text') return { rich_text: richText(rawValue) }
  if (schema.type === 'select') {
    return {
      select:
        rawValue === '' || rawValue === null ? null : { name: String(rawValue) }
    }
  }
  if (schema.type === 'status') {
    return {
      status:
        rawValue === '' || rawValue === null ? null : { name: String(rawValue) }
    }
  }
  if (schema.type === 'checkbox') return { checkbox: Boolean(rawValue) }
  if (schema.type === 'date') {
    if (rawValue === '' || rawValue === null) return { date: null }
    if (typeof rawValue === 'string') return { date: { start: rawValue } }
    const date = { start: String(rawValue.start) }
    if (rawValue.end) date.end = String(rawValue.end)
    return { date }
  }
  throw new Error(`Unsupported cleanup property type: ${schema.type}`)
}

function propertyFieldMap(fields) {
  return {
    ext: fields.ext,
    status: fields.status,
    summary: fields.summary,
    category: fields.category,
    date: fields.date,
    location: fields.location,
    relatedEventSlug: fields.relatedEventSlug,
    eventStart: fields.eventStart,
    publicListing: fields.publicListing
  }
}

function buildPagePatch(plan, fields) {
  const properties = {}
  const map = propertyFieldMap(fields)
  for (const [logicalName, rawValue] of Object.entries(plan.properties)) {
    const field = map[logicalName]
    if (!field) throw new Error(`Unsupported cleanup field: ${logicalName}`)
    properties[field.key] = writeProperty(field.schema, rawValue)
  }
  const patch = {}
  if (Object.keys(properties).length > 0) patch.properties = properties
  if (plan.archive) patch.in_trash = true
  return patch
}

function valuesMatch(actual, expected) {
  if (expected === null || typeof expected !== 'object') {
    return actual === expected
  }
  if (!actual || typeof actual !== 'object') return false
  return Object.entries(expected).every(([key, value]) =>
    valuesMatch(actual[key], value)
  )
}

function markdownToBlocks(markdown) {
  const blocks = []
  for (const rawLine of String(markdown || '').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const type = `heading_${heading[1].length}`
      blocks.push({
        object: 'block',
        type,
        [type]: { rich_text: richText(heading[2]) }
      })
      continue
    }
    const bullet = line.match(/^[-*]\s+(.+)$/)
    if (bullet) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText(bullet[1]) }
      })
      continue
    }
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: richText(line) }
    })
  }
  return blocks
}

async function run() {
  loadProjectEnv()
  const token =
    process.env.NOTION_API_TOKEN || process.env.NOTION_ACCESS_TOKEN || ''
  const dataSourceId =
    process.env.NOTION_CONTENT_DATA_SOURCE_ID ||
    process.env.NOTION_RECORDS_DATA_SOURCE_ID ||
    process.env.NOTION_EVENTS_DATA_SOURCE_ID ||
    process.env.NOTION_MEMBERS_DATA_SOURCE_ID ||
    ''
  const apply = process.argv.includes('--apply')
  if (!token) throw new Error('Missing NOTION_API_TOKEN')
  if (!dataSourceId) throw new Error('Missing a NOTION_*_DATA_SOURCE_ID')

  async function notion(pathname, options = {}) {
    const response = await fetch(`${API_BASE}${pathname}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': process.env.NOTION_API_VERSION || NOTION_VERSION,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    })
    const body = await response.text()
    const data = body ? JSON.parse(body) : {}
    if (!response.ok) {
      throw new Error(
        `Notion ${options.method || 'GET'} ${pathname} failed (${response.status}): ${data.message || body}`
      )
    }
    return data
  }

  const dataSource = await notion(`/data_sources/${dataSourceId}`)
  const fields = {
    title: findProperty(dataSource, 'title'),
    type: findProperty(dataSource, 'type'),
    status: findProperty(dataSource, 'status'),
    slug: findProperty(dataSource, 'slug'),
    summary: findProperty(dataSource, 'summary'),
    category: findProperty(dataSource, 'category'),
    date: findProperty(dataSource, 'date'),
    location: findProperty(dataSource, 'location'),
    relatedEventSlug: findProperty(dataSource, 'related_event_slug'),
    eventStart: findProperty(dataSource, 'event_start'),
    publicListing: findProperty(dataSource, 'public_listing'),
    ext: findProperty(dataSource, 'ext')
  }

  const pages = []
  let cursor = null
  do {
    const query = { page_size: 100 }
    if (cursor) query.start_cursor = cursor
    const response = await notion(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify(query)
    })
    pages.push(...(response.results || []))
    cursor = response.has_more ? response.next_cursor : null
  } while (cursor)

  const plans = pages
    .map(page => planContentCleanup(normalizePage(page, fields)))
    .filter(
      plan =>
        plan.blocked ||
        plan.archive ||
        plan.replaceBodyMarkdown ||
        Object.keys(plan.properties).length > 0
    )

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        officialIntroUrl: OFFICIAL_INTRO_URL,
        totalPages: pages.length,
        actionCount: plans.filter(plan => !plan.blocked).length,
        blockedCount: plans.filter(plan => plan.blocked).length,
        plans
      },
      null,
      2
    )
  )

  const blocked = plans.filter(plan => plan.blocked)
  if (blocked.length > 0) {
    throw new Error(
      `Blocked by unsafe legacy content: ${blocked.map(plan => plan.slug || plan.id).join(', ')}`
    )
  }
  if (!apply) return

  for (const plan of plans) {
    if (plan.replaceBodyMarkdown && !plan.archive) {
      const currentBlocks = await notion(
        `/blocks/${plan.id}/children?page_size=100`
      )
      for (const block of currentBlocks.results || []) {
        await notion(`/blocks/${block.id}`, { method: 'DELETE' })
      }
      const children = markdownToBlocks(plan.replaceBodyMarkdown)
      await notion(`/blocks/${plan.id}/children`, {
        method: 'PATCH',
        body: JSON.stringify({ children })
      })
    }

    const patch = buildPagePatch(plan, fields)
    if (Object.keys(patch).length > 0) {
      await notion(`/pages/${plan.id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      })
    }
    console.log(`applied content cleanup: ${plan.slug || plan.id}`)
  }

  for (const plan of plans) {
    const updatedPage = await notion(`/pages/${plan.id}`)
    const updated = normalizePage(updatedPage, fields)
    if (plan.archive && !updated.inTrash) {
      throw new Error(`Verification failed: page not archived for ${plan.slug}`)
    }
    if (plan.properties.ext === '' && updated.ext) {
      throw new Error(`Verification failed: ext not empty for ${plan.slug}`)
    }
    for (const [logicalName, expected] of Object.entries(plan.properties)) {
      if (logicalName === 'ext') continue
      const actual = updated[logicalName]
      if (!valuesMatch(actual, expected)) {
        throw new Error(
          `Verification failed: ${logicalName} mismatch for ${plan.slug}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
        )
      }
    }
    if (plan.replaceBodyMarkdown && !plan.archive) {
      const blocks = await notion(`/blocks/${plan.id}/children?page_size=100`)
      if (
        (blocks.results || []).length !==
        markdownToBlocks(plan.replaceBodyMarkdown).length
      ) {
        throw new Error(
          `Verification failed: body block count mismatch for ${plan.slug}`
        )
      }
    }
    console.log(`verified content cleanup: ${plan.slug || plan.id}`)
  }
}

module.exports = {
  AIPO_BODY,
  OFFICIAL_INTRO_URL,
  ORIGIN_BODY,
  buildPagePatch,
  markdownToBlocks,
  planContentCleanup,
  valuesMatch
}

if (require.main === module) {
  run().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}
