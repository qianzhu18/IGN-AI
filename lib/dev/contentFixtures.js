const enabledValues = new Set(['1', 'true', 'yes', 'stress'])

export function shouldUseContentFixtures() {
  return enabledValues.has(
    String(process.env.IGNAI_CONTENT_FIXTURES || process.env.NEXT_PUBLIC_IGNAI_CONTENT_FIXTURES || '')
      .trim()
      .toLowerCase()
  )
}

const covers = [
  '/brand/ignai/hero-gradient-brand.webp',
  '/brand/ignai/storefront-sign.webp',
  '/brand/ignai/business-card-mockup.webp',
  '/images/generated/ignite-core.png',
  '/images/generated/collaboration-threads.png',
  '/images/generated/human-energy-scene.png'
]

const topics = [
  'Agent 产品原型',
  'AI 内容工作流',
  '本地 Builder 圆桌',
  '自动化工具实践',
  '多模态创作实验',
  '社区项目共创',
  '知识库与发布链路',
  'AI 商业化复盘',
  '个人效率系统',
  '开源贡献工作坊',
  '提示词工程案例',
  '产品 Demo 之夜'
]

const locations = ['长沙 · 岳麓区', '长沙 · 天心区', '线上 Zoom', '长沙 · 开福区', '混合参与']
const postCategories = ['技术分享', '活动复盘', '工具实践', '成员观点', '社区公告']
const tags = ['Agent', 'Workflow', '长沙', 'Builder', 'Demo', 'Notion', '内容生产', '自动化']

function pad(index) {
  return String(index + 1).padStart(2, '0')
}

function pick(list, index) {
  return list[index % list.length]
}

function makeDate(index) {
  const month = 6 + Math.floor(index / 10)
  const day = (index % 26) + 1
  return `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getFixturePosts(count = 36) {
  if (!shouldUseContentFixtures()) return []

  return Array.from({ length: count }, (_, index) => {
    const topic = pick(topics, index)
    const date = makeDate(index)
    return {
      id: `fixture-post-${pad(index)}`,
      type: 'Post',
      status: 'Published',
      title: `${topic}：第 ${pad(index)} 次社区笔记`,
      slug: `article/fixture-post-${pad(index)}`,
      href: `/article/fixture-post-${pad(index)}`,
      summary: `这是一条用于压测文章列表的信息密度样本，模拟真实 Notion Post 的摘要长度、标签数量和作者字段。主题聚焦 ${topic}。`,
      category: pick(postCategories, index),
      tags: [pick(tags, index), pick(tags, index + 2), pick(tags, index + 4)],
      publishDay: date,
      publishDate: new Date(date).getTime(),
      lastEditedDate: new Date(date).getTime() + index * 3600000,
      pageCover: pick(covers, index),
      pageCoverThumbnail: pick(covers, index),
      author: 'IGNAI 编辑部',
      authors: [
        {
          id: `fixture-author-${index % 6}`,
          title: ['千逐', '许全均', 'Alex', 'Mia', 'Rui', 'Chen'][index % 6],
          slug: ['qianzhu', 'xu-quanjun', 'alex', 'mia', 'rui', 'chen'][index % 6],
          href: `/members/${['qianzhu', 'xu-quanjun', 'alex', 'mia', 'rui', 'chen'][index % 6]}`,
          role: pick(['组织者', 'Builder', '研究员', '设计协作者'], index)
        }
      ]
    }
  })
}

export function getFixtureEvents(count = 24) {
  if (!shouldUseContentFixtures()) return []

  const statuses = ['open', 'planning', 'ongoing', 'recap', 'closed', 'finished']
  const formats = ['offline', 'online', 'hybrid']
  const kinds = ['hosted', 'cohosted', 'promoted', 'participating']

  return Array.from({ length: count }, (_, index) => {
    const topic = pick(topics, index)
    const date = makeDate(index + 4)
    return {
      id: `fixture-event-${pad(index)}`,
      type: 'Event',
      status: 'Published',
      title: `${topic} · 活动 ${pad(index)}`,
      summary: `用于测试活动列表承载能力的虚拟 Notion Event。包含状态、地点、形式、标签和长短不一的说明。`,
      slug: `fixture-event-${pad(index)}`,
      eventStatus: pick(statuses, index),
      format: pick(formats, index),
      eventKind: pick(kinds, index),
      location: pick(locations, index),
      publishDay: date,
      date: { start_date: date },
      pageCover: pick(covers, index + 1),
      pageCoverThumbnail: pick(covers, index + 1),
      tags: [pick(tags, index), pick(tags, index + 1), pick(tags, index + 3)],
      ext: {
        subtitle: index % 3 === 0 ? '小规模圆桌 / 实战分享 / Demo 交流' : '',
        excerpt: `这场活动围绕 ${topic} 展开，模拟真实运营中几十场活动同时展示时的卡片高度、状态标签和扫描节奏。`,
        eventDateText: `${date} ${index % 2 === 0 ? '周六下午' : '周四晚'}`,
        location: pick(locations, index),
        status: pick(statuses, index),
        format: pick(formats, index),
        kind: pick(kinds, index),
        agenda: ['成员自我介绍', '主题分享', 'Demo 展示', '下一步共创'],
        audience: ['AI Builder', '内容创作者', '产品与运营同学'],
        notes: ['活动复盘', '工具清单', '项目线索'],
        content: [
          {
            heading: '活动目标',
            body: `用一场高密度但小范围的交流，把 ${topic} 从讨论推进到可执行动作。`
          }
        ]
      }
    }
  })
}

export function getFixtureRecords(count = 28) {
  if (!shouldUseContentFixtures()) return []

  const types = ['recap', 'story', 'resource', 'project']
  return Array.from({ length: count }, (_, index) => {
    const topic = pick(topics, index)
    return {
      slug: `fixture-record-${pad(index)}`,
      title: `${topic}：社区记录 ${pad(index)}`,
      type: pick(types, index),
      dateText: `2026 / ${String(6 + Math.floor(index / 10)).padStart(2, '0')}`,
      location: index % 3 === 0 ? '长沙' : '',
      cover: pick(covers, index + 2),
      excerpt: `这是一条用于测试记录页排布的虚拟 Field Note，模拟复盘、故事、资源和项目记录混合出现时的视觉节奏。`,
      outcomes: ['1 个行动项', '2 条经验', '3 个资源'],
      tags: [pick(tags, index), pick(tags, index + 2), pick(tags, index + 5)],
      content: [
        {
          heading: '记录背景',
          body: `围绕 ${topic} 的一次社区沉淀，用于观察详情页和列表页在真实内容增长后的承载能力。`
        },
        {
          heading: '后续动作',
          body: '把现场经验整理成可复用的工具、文章或下一场活动议程。'
        }
      ],
      links: [
        {
          label: '返回记录列表',
          href: '/records'
        }
      ]
    }
  })
}

export function mergeFixturePosts(posts = [], count) {
  const fixtures = getFixturePosts(count)
  return fixtures.length > 0 ? [...fixtures, ...(posts || [])] : posts
}

export function mergeFixtureEvents(events = [], count) {
  const fixtures = getFixtureEvents(count)
  return fixtures.length > 0 ? [...fixtures, ...(events || [])] : events
}

export function mergeFixtureRecords(records = [], count) {
  const fixtures = getFixtureRecords(count)
  return fixtures.length > 0 ? [...fixtures, ...(records || [])] : records
}
