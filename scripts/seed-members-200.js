#!/usr/bin/env node
/**
 * 批量创建 200 个测试成员到 Notion 成员数据库
 * 用于测试成员展示页在大量数据下的表现
 *
 * Usage:
 *   node scripts/seed-members-200.js              # 创建成员
 *   node scripts/seed-members-200.js --dry-run    # 只预览，不创建
 *   node scripts/seed-members-200.js --batch 50   # 每批 50 个（默认 20）
 */

const fs = require('fs')
const path = require('path')

loadEnvFile('.env.local')
loadEnvFile('.env')

const API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = process.env.NOTION_API_VERSION || '2026-03-11'
const NOTION_TOKEN = process.env.NOTION_API_TOKEN || ''
const MEMBERS_DATA_SOURCE_ID = process.env.NOTION_MEMBERS_DATA_SOURCE_ID || ''

const DRY_RUN = process.argv.includes('--dry-run')
const BATCH_SIZE = Number(getFlag('--batch', '20'))

// ── 中文姓名池 ──────────────────────────────────────────────

const SURNAMES = [
  '张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
  '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
  '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
  '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
  '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
  '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤',
  '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'
]

const GIVEN_NAMES = [
  '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军',
  '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞',
  '平', '刚', '桂英', '华', '飞', '玉兰', '萍', '红', '玉梅', '辉',
  '建华', '玲', '桂兰', '素芬', '玉英', '秀珍', '志强', '建国', '建军', '文',
  '思远', '子涵', '梓轩', '浩然', '子墨', '一诺', '亦辰', '宇航', '思齐', '知行',
  '若水', '清源', '致远', '明哲', '天佑', '嘉禾', '书言', '乐天', '安之', '行简',
  '云舒', '心怡', '雨桐', '诗涵', '梦瑶', '可馨', '语嫣', '紫萱', '欣怡', '雅琴',
  '慧', '颖', '婷', '雪', '琳', '晶', '瑶', '璐', '倩', '婷婷',
  '建华', '国强', '志明', '文杰', '俊杰', '海燕', '小红', '小明', '小龙', '小花'
]

const ENGLISH_FIRST = [
  'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn',
  'Avery', 'Cameron', 'Drew', 'Jamie', 'Kai', 'Leo', 'Max', 'Noah',
  'Owen', 'Parker', 'Reese', 'Skyler', 'Blake', 'Charlie', 'Dakota',
  'Eden', 'Finn', 'Gray', 'Harper', 'Indigo', 'Jules', 'Kennedy',
  'Luna', 'Micah', 'Nico', 'Oakley', 'Phoenix', 'River', 'Sage',
  'Tatum', 'Unity', 'Val', 'Winter', 'Xen', 'Yuki', 'Zion',
  'Aria', 'Bella', 'Chloe', 'Diana', 'Ella', 'Fiona', 'Grace', 'Hannah',
  'Iris', 'Jade', 'Kate', 'Lily', 'Maya', 'Nora', 'Olivia', 'Pearl',
  'Ruby', 'Sophia', 'Tina', 'Violet', 'Wendy', 'Zoe'
]

const ENGLISH_LAST = [
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Wu',
  'Zhou', 'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'Lin',
  'He', 'Luo', 'Liang', 'Song', 'Tang', 'Han', 'Feng', 'Deng',
  'Cao', 'Peng', 'Xiao', 'Tian', 'Dong', 'Pan', 'Yuan', 'Cai',
  'Jiang', 'Yu', 'Du', 'Ye', 'Cheng', 'Wei', 'Su', 'Lu',
  'Ding', 'Ren', 'Lu', 'Shen', 'Fan', 'Shi', 'Jin', 'Dai'
]

// ── 角色 & 标签 ──────────────────────────────────────────────

const ROLES = [
  'AI Builder', 'Product Explorer', 'Storyteller', 'Local Connector',
  'Researcher', 'Designer', 'Engineer', 'Founder', 'Student',
  'Content Creator', 'Data Scientist', 'ML Engineer', 'Product Manager',
  'Community Builder', 'Venture Capitalist', 'Marketer', 'Writer',
  'Developer Advocate', 'Open Source Contributor', 'Prompt Engineer'
]

const BIOS_CN = [
  '专注于 AI Agent 产品化，从 0 到 1 构建过多个自动化工作流。',
  '在长沙做 AI 产品，关注 LLM 应用和开发者工具。',
  '独立开发者，喜欢用 AI 做有意思的小工具。',
  '研究大模型在教育场景的应用，也在写一本关于 AI 的书。',
  '从 UI 转型到 AI 产品设计，关注人机交互的未来。',
  '社区运营爱好者，相信线下连接能创造更大的价值。',
  '数据科学家，在用 AI 做城市数据分析。',
  '连续创业者，现在 All in AI 方向。',
  '大学生，对 AI 充满好奇，正在学习和探索。',
  '内容创作者，用 AI 工具提升创作效率。',
  '全栈工程师，最近在研究 RAG 和向量数据库。',
  '产品经理，关注 AI 如何改变用户习惯。',
  '在大厂做 AI 基础设施，业余时间探索个人项目。',
  '设计师 + AI 爱好者，探索 AI 辅助设计的可能性。',
  '投资人，关注 AI 领域的早期项目。',
  '开源贡献者，维护几个 AI 相关的开源项目。',
  'Prompt 工程师，擅长用自然语言驱动 AI 完成复杂任务。',
  '写作者，记录 AI 时代的故事和思考。',
  '技术布道者，帮助更多人理解和使用 AI。',
  '机器学习工程师，专注于 NLP 和多模态模型。'
]

const QUOTES = [
  '在 AGI 到来之前，先点燃一群能行动的人。',
  '最好的学习方式是做一个真实的产品。',
  'AI 不会取代你，但会用 AI 的人会。',
  '技术会过时，但故事会被记住。',
  '独立开发最大的优势是可以快速试错。',
  '好产品不是功能多，是解决真问题。',
  '社区的力量在于连接，而不是聚集。',
  '做 AI 产品，最重要的是理解人。',
  '每一次尝试都是向正确方向迈出的一步。',
  '不要等待完美的时机，现在就开始。',
  '用 AI 放大人的能力，而不是替代人。',
  '长沙的 AI 生态需要更多行动者。',
  '从小处着手，快速验证，持续迭代。',
  '写代码是手段，解决问题才是目的。',
  'AI 是工具，人才是目的。',
  '开源让技术民主化。',
  '产品思维比技术能力更重要。',
  '最好的社区是每个人都能贡献价值。',
  '持续学习，保持好奇。',
  '让 AI 成为每个人的超级助手。'
]

// ── 工具函数 ──────────────────────────────────────────────

function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const i = trimmed.indexOf('=')
    if (i === -1) return
    const key = trimmed.slice(0, i).trim()
    if (!key || process.env[key]) return
    let value = trimmed.slice(i + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  })
}

function getFlag(name, fallback = '') {
  const index = process.argv.indexOf(name)
  if (index >= 0 && index + 1 < process.argv.length) return process.argv[index + 1]
  return fallback
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function richTextValue(content) {
  return [{ type: 'text', text: { content: String(content) } }]
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
    throw new Error(`Notion API ${method} ${reqPath} failed: ${response.status}\n${JSON.stringify(data, null, 2)}`)
  }
  return data
}

// ── 生成成员数据 ──────────────────────────────────────────

function generateMember(index) {
  const useEnglish = Math.random() < 0.3
  let name, slugSuffix

  if (useEnglish) {
    name = `${pick(ENGLISH_FIRST)} ${pick(ENGLISH_LAST)}`
    slugSuffix = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  } else {
    const surname = pick(SURNAMES)
    const given = pick(GIVEN_NAMES)
    name = surname + given
    // 用拼音作为 slug（简单映射，不精确但够用）
    slugSuffix = `member-${String(index + 1).padStart(3, '0')}`
  }

  const role = pick(ROLES)
  const bio = pick(BIOS_CN)
  const quote = pick(QUOTES)
  const summary = `${role}，${pick(['关注 AI', '探索产品', '连接社区', '创造内容', '研究技术'])}。`

  // 头像：用 DiceBear 的 avataaars 风格，seed 为名字
  const avatarSeed = encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`

  // 部分成员标记为 featured
  const featured = index < 8 ? true : Math.random() < 0.05
  const verified = index < 15 ? true : Math.random() < 0.2

  return {
    title: name,
    slug: `members/${slugSuffix}`,
    summary,
    avatar,
    quote,
    role,
    bio,
    featured,
    verified,
    sortOrder: index + 1
  }
}

// ── 创建单个成员 ──────────────────────────────────────────

async function createMember(dataSource, member) {
  const properties = {}

  // 查找属性并构建 payload
  const fieldMap = {
    title: { type: 'title', value: member.title },
    type: { type: 'select', value: 'Member' },
    status: { type: 'status', value: 'Published' },
    slug: { type: 'rich_text', value: member.slug },
    summary: { type: 'rich_text', value: member.summary },
    avatar: { type: 'url', value: member.avatar },
    quote: { type: 'rich_text', value: member.quote }
  }

  for (const [logicalName, { type, value }] of Object.entries(fieldMap)) {
    const propKey = findPropertyKey(dataSource, logicalName)
    if (!propKey) continue
    const schema = dataSource.properties[propKey]
    if (!schema) continue
    properties[propKey] = buildPayload(schema.type, value)
  }

  // 直接名称属性（role, bio, featured, verified, sortOrder）
  const directMap = {
    role: member.role,
    bio: member.bio,
    featured: member.featured,
    verified: member.verified,
    sortOrder: member.sortOrder
  }

  for (const [propName, value] of Object.entries(directMap)) {
    const propKey = findPropertyKeyByName(dataSource, propName)
    if (!propKey) continue
    const schema = dataSource.properties[propKey]
    if (!schema) continue
    properties[propKey] = buildPayload(schema.type, value)
  }

  return notionRequest('/pages', {
    method: 'POST',
    body: {
      parent: { data_source_id: MEMBERS_DATA_SOURCE_ID },
      properties
    }
  })
}

function findPropertyKey(dataSource, logicalName) {
  const nameMap = {
    title: 'title', type: 'type', status: 'status',
    slug: 'slug', summary: 'summary', avatar: 'avatar', quote: 'quote'
  }
  const configuredName = process.env[`NOTION_MEMBERS_PROP_${logicalName.toUpperCase()}`] || nameMap[logicalName]
  if (!configuredName) return null

  if (dataSource.properties[configuredName]) return configuredName
  for (const [key, schema] of Object.entries(dataSource.properties)) {
    if (schema?.name === configuredName) return key
  }
  return null
}

function findPropertyKeyByName(dataSource, propertyName) {
  if (dataSource.properties[propertyName]) return propertyName
  for (const [key, schema] of Object.entries(dataSource.properties)) {
    if (schema?.name === propertyName) return key
  }
  return null
}

function buildPayload(schemaType, value) {
  if (value === undefined || value === null || value === '') return null
  switch (schemaType) {
    case 'title': return { title: richTextValue(value) }
    case 'rich_text': return { rich_text: richTextValue(value) }
    case 'url': return { url: String(value) }
    case 'select': return { select: { name: String(value) } }
    case 'status': return { status: { name: String(value) } }
    case 'checkbox': return { checkbox: Boolean(value) }
    case 'number': return { number: Number(value) }
    default: return null
  }
}

// ── 主流程 ──────────────────────────────────────────────

async function main() {
  if (!NOTION_TOKEN) {
    console.error('❌ Missing NOTION_API_TOKEN')
    process.exit(1)
  }
  if (!MEMBERS_DATA_SOURCE_ID) {
    console.error('❌ Missing NOTION_MEMBERS_DATA_SOURCE_ID')
    process.exit(1)
  }

  console.log('🔍 Fetching data source schema...')
  const dataSource = await notionRequest(`/data_sources/${MEMBERS_DATA_SOURCE_ID}`)
  console.log(`✅ Data source: ${dataSource.title?.[0]?.plain_text || 'Members'}`)
  console.log(`   Properties: ${Object.keys(dataSource.properties).join(', ')}`)

  // 生成 200 个成员
  const members = Array.from({ length: 200 }, (_, i) => generateMember(i))

  if (DRY_RUN) {
    console.log(`\n📋 DRY RUN — would create ${members.length} members:`)
    members.slice(0, 10).forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.title} (${m.role}) — ${m.slug}`)
    })
    console.log(`   ... and ${members.length - 10} more`)
    return
  }

  console.log(`\n🚀 Creating ${members.length} members in batches of ${BATCH_SIZE}...`)

  let created = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(members.length / BATCH_SIZE)

    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} members)...`)

    const results = await Promise.allSettled(
      batch.map(async (member, j) => {
        try {
          const result = await createMember(dataSource, member)
          created++
          process.stdout.write('.')
          return result
        } catch (err) {
          failed++
          errors.push({ member: member.title, error: err.message })
          process.stdout.write('x')
          return null
        }
      })
    )

    // Notion API rate limit: ~3 req/s per integration
    // 批间等待，避免触发限流
    if (i + BATCH_SIZE < members.length) {
      const waitMs = Math.max(1000, BATCH_SIZE * 200)
      console.log(`\n⏳ Waiting ${waitMs}ms before next batch...`)
      await sleep(waitMs)
    }
  }

  console.log(`\n\n✅ Done! Created: ${created}, Failed: ${failed}`)
  if (errors.length > 0) {
    console.log(`\n❌ Errors (first 5):`)
    errors.slice(0, 5).forEach(e => {
      console.log(`   ${e.member}: ${e.error.slice(0, 100)}`)
    })
  }
}

main().catch(err => {
  console.error('❌ Fatal:', err.message)
  process.exit(1)
})
