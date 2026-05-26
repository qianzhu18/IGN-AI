#!/usr/bin/env node
/**
 * seed-notion-events.js
 * 将 src/content/events.ts 中的静态活动数据写入 Notion 数据库。
 *
 * 用法:
 *   node scripts/seed-notion-events.js              # 写入所有静态活动
 *   node scripts/seed-notion-events.js --dry-run    # 只预览，不写入
 *   node scripts/seed-notion-events.js --slug=changsha-ai-builder-night  # 只写入指定活动
 *
 * 环境变量 (从 .env.local 自动加载):
 *   NOTION_API_TOKEN  — Notion Integration Token
 *   NOTION_PAGE_ID    — 主库 ID (逗号分隔时取第一段)
 */

require('dotenv').config({ path: '.env.local' })

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN
const RAW_PAGE_ID = process.env.NOTION_PAGE_ID || ''
// 取主库 ID (逗号分隔的第一段，去掉可能的子路径前缀)
const NOTION_DB_ID = RAW_PAGE_ID.split(',')[0].replace(/^[^:]*:/, '').trim()

// 静态活动数据 (与 src/content/events.ts 同步)
const STATIC_EVENTS = [
  {
    slug: 'changsha-ai-builder-night',
    title: '长沙 AI Builder 夜谈',
    subtitle: '从群聊走向现场的小规模圆桌',
    status: 'open',
    dateText: '2026 / 05 下旬',
    location: '长沙',
    format: 'offline',
    cover: '/images/generated/human-energy-scene.png',
    excerpt: '围绕 Agent、产品原型和内容生产，邀请本地行动者做一次小规模圆桌交流。',
    tags: ['线下聚会', '长沙', 'Builder'],
    registrationUrl: '/join',
    audience: ['正在做 AI 产品或原型的人', '正在学习 Agent 的学生', '希望找到共创伙伴的 Builder'],
    agenda: ['19:00 签到与自由交流', '19:30 主题分享', '20:10 圆桌讨论', '21:00 Demo', '21:30 自由连接'],
    hosts: ['IGNAI / 洋来社'],
    notes: ['第一版报名可以先通过加入社区入口完成。'],
    content: [
      { heading: '这是一场什么活动', body: '面向本地 AI 行动者的小型交流，围绕 Agent、产品原型、内容生产和真实项目展开讨论。' },
      { heading: '为什么要做线下', body: 'AI 信息已经足够多，但真实连接仍然稀缺。线下聚会让群聊里的名字变成真实的人。' },
    ],
  },
  {
    slug: 'ai-workflow-workshop',
    title: 'AI Workflow 共创工作坊',
    subtitle: '把真实工作流拆成可复用模板',
    status: 'planning',
    dateText: '筹备中',
    location: '长沙 / 线上',
    format: 'hybrid',
    cover: '/images/generated/collaboration-threads.png',
    excerpt: '用一个晚上拆解真实工作流，把提示词、自动化和发布链路整理成可复用模板。',
    tags: ['工作流', '共创', '内容生产'],
    registrationUrl: '/join',
    audience: ['正在用 AI 提升工作流的人', '想系统化内容生产的创作者'],
    agenda: ['流程拆解', '工具共创', '模板整理', '下一步分享'],
    hosts: ['IGNAI Workflow Group'],
    notes: ['筹备期会先收集参与者的真实工作流案例。'],
    content: [
      { heading: '工作坊产出什么', body: '留下工具清单、流程模板、可复制的实践记录，以及下一次共创的入口。' },
    ],
  },
  {
    slug: 'agent-demo-hour',
    title: 'Agent Demo Hour',
    subtitle: '把正在做的东西拿出来看看',
    status: 'planning',
    dateText: '规划中',
    location: '线上',
    format: 'online',
    cover: '/images/generated/ignite-core.png',
    excerpt: '一次轻量的线上 Demo 时段，鼓励成员展示正在做的 Agent、工具或产品雏形。',
    tags: ['Demo', 'Agent', '线上'],
    registrationUrl: '/join',
    audience: ['正在做 Agent 的开发者', '想获得真实反馈的产品行动者'],
    agenda: ['Demo 展示', '问题反馈', '协作匹配', '下次迭代目标'],
    hosts: ['IGNAI Demo Circle'],
    notes: ['每次控制 3-5 个 Demo，保持节奏轻量。'],
    content: [
      { heading: '为什么要做 Demo Hour', body: '很多想法只有被展示出来，才会获得反馈和连接。Demo Hour 是低门槛的公开表达场。' },
    ],
  },
]

async function createNotionEvent(event, dryRun = false) {
  // 构建 ext JSON (Notion 的 ext 字段存储活动扩展数据)
  const ext = {
    status: event.status,
    dateText: event.dateText,
    location: event.location,
    format: event.format,
    cover: event.cover,
    registrationUrl: event.registrationUrl || '',
    audience: event.audience || [],
    agenda: event.agenda || [],
    hosts: event.hosts || [],
    notes: event.notes || [],
    content: event.content || [],
  }

  const properties = {
    title: { title: [{ text: { content: event.title } }] },
    slug: { rich_text: [{ text: { content: event.slug } }] },
    summary: { rich_text: [{ text: { content: event.excerpt.slice(0, 2000) } }] },
    type: { select: { name: 'Event' } },
    status: { select: { name: 'Published' } },
    tags: { multi_select: event.tags.map(t => ({ name: t })) },
    ext: { rich_text: [{ text: { content: JSON.stringify(ext) } }] },
  }

  if (event.dateText && !event.dateText.includes('筹备') && !event.dateText.includes('规划')) {
    // 尝试解析日期
    const dateMatch = event.dateText.match(/(\d{4})\s*[/\-]\s*(\d{1,2})/)
    if (dateMatch) {
      properties.date = { date: { start: `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-01` } }
    }
  }

  if (dryRun) {
    console.log(`[dry-run] Would create event: ${event.title} (${event.slug})`)
    console.log(`  type=Event, status=Published, tags=${event.tags.join(', ')}`)
    console.log(`  ext.status=${ext.status}, ext.format=${ext.format}, ext.location=${ext.location}`)
    return { ok: true, id: `dry-run-${event.slug}` }
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_API_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DB_ID },
      properties,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error(`[FAIL] ${event.title}: ${response.status} ${response.statusText}\n  ${err.slice(0, 300)}`)
    return { ok: false, error: err }
  }

  const page = await response.json()
  console.log(`[OK] ${event.title} -> page id: ${page.id}`)
  return { ok: true, id: page.id }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const slugArg = args.find(a => a.startsWith('--slug='))
  const targetSlug = slugArg ? slugArg.split('=')[1] : null

  if (!NOTION_API_TOKEN) {
    console.error('ERROR: NOTION_API_TOKEN is not set in .env.local')
    process.exit(1)
  }
  if (!NOTION_DB_ID) {
    console.error('ERROR: NOTION_PAGE_ID is not set in .env.local')
    process.exit(1)
  }

  console.log(`Database: ${NOTION_DB_ID}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log('')

  const events = targetSlug
    ? STATIC_EVENTS.filter(e => e.slug === targetSlug)
    : STATIC_EVENTS

  if (events.length === 0) {
    console.error(`No events found${targetSlug ? ` for slug: ${targetSlug}` : ''}`)
    process.exit(1)
  }

  let ok = 0
  let fail = 0

  for (const event of events) {
    const result = await createNotionEvent(event, dryRun)
    if (result.ok) ok++
    else fail++
  }

  console.log('')
  console.log(`Done: ${ok} succeeded, ${fail} failed`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
