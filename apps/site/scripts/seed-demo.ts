import dotenv from 'dotenv'
import path from 'node:path'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Page } from '../src/payload-types'

const lexical = (text: string): DefaultTypedEditorState => ({
  root: {
    children: [
      {
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const demoSlugs = ['demo-lin', 'demo-signal-night', 'demo-first-field-note', 'demo-working-note', 'about']

const aboutStoryLayout = [
  {
    blockType: 'aboutStory',
    cta: {
      copy: '如果你也不想让一次活动变成一次性见面，来认识我们。带着好奇、项目或一个还没想清楚的问题都可以。',
      href: '/join',
      label: '加入社区',
      title: 'Ignite before AGI.',
    },
    faq: [
      {
        a: '学生、开发者、产品人与创作者。有人刚接触 AI，有人已经在做产品，也有人只是想认识同频的人。',
        q: '谁会在这里？',
      },
      {
        a: '一起去活动、做小项目、参加分享和跨城见面。活动结束后，关系和讨论还能继续。',
        q: '这里会发生什么？',
      },
      {
        a: '从一次活动或一段具体交流开始。带着你正在做的事、一个问题，或者单纯的好奇来都可以。',
        q: '怎么进入？',
      },
    ],
    hero: {
      copy: '很多人是在活动中认识的。可一场活动结束之后，热情往往很快散开。IGNAI 从这个瞬间开始：让愿意再聚的人，有一个继续出现的理由。',
      eyebrow: 'About IGNAI',
      line1: '为什么会有',
      line2: 'IGNAI？',
    },
    mission: {
      eyebrow: 'Mission',
      paragraphs: [
        {
          text: 'IGNAI 聚集学生、开发者、产品人与创作者。我们在活动里认识彼此，也把一次见面之后还值得继续聊的工具、项目和想法留下来。',
        },
        {
          text: '我们不把每次活动做成一次性相遇，也不要求每个人都带着成熟项目来。对 AI 有好奇、愿意参与真实现场，就已经足够成为开始。',
        },
      ],
      title: '我们在做什么',
    },
    stats: [
      { label: '2050 最初同行者', num: '7 人' },
      { label: '后来参与青年团聚', num: '70+' },
      { label: '第一次对外建立影响', num: '极客松' },
      { label: '愿意再聚的理由', num: 'Just for fun' },
    ],
    values: [
      { desc: '不要等想清楚一切再开始。从小项目、小分享、小连接开始。', title: '先行动' },
      { desc: '把想法说出来，让它有机会被看见、被讨论、被连接。', title: '先表达' },
      { desc: '让群聊关系走向真实协作，让线上认识走向线下见面。', title: '先连接' },
      { desc: '社区不是一次活动，是持续的学习、实践、分享和彼此点燃。', title: '持续做' },
    ],
    valuesTitle: '我们相信什么',
  },
] satisfies Page['layout']

async function main() {
  const args = new Map(
    process.argv.slice(2).map((argument) => {
      const [key, ...rest] = argument.split('=')
      return [key, rest.length ? rest.join('=') : 'true']
    }),
  )
  if (process.env.NODE_ENV === 'production') throw new Error('Demo seed is disabled in production.')
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })

  const apply = args.has('--apply')
  const cleanup = args.has('--cleanup')
  const confirm = cleanup ? 'REMOVE_IGNAI_DEMO' : 'IGNAI_DEMO_SEED'
  if ((apply || cleanup) && args.get('--confirm') !== confirm) {
    throw new Error(`This operation requires --confirm=${confirm}`)
  }

  const config = (await import('../src/payload.config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })
  try {
    if (cleanup) {
      const collections = ['members', 'events', 'records', 'posts', 'pages'] as const
      let removed = 0
      for (const collection of collections) {
        const result = await payload.find({
          collection,
          depth: 0,
          draft: true,
          limit: 100,
          overrideAccess: true,
          pagination: false,
          where: { slug: { in: demoSlugs } },
        })
        if (apply) {
          for (const document of result.docs) {
            await payload.delete({ collection, id: document.id, overrideAccess: true })
            removed += 1
          }
        }
      }
      console.log(JSON.stringify({ mode: apply ? 'cleanup' : 'cleanup-dry-run', removed }, null, 2))
      return
    }

    const existing = new Set<string>()
    for (const collection of ['members', 'events', 'records', 'posts', 'pages'] as const) {
      const result = await payload.find({ collection, depth: 0, draft: true, limit: 100, overrideAccess: true, pagination: false })
      result.docs.forEach((document) => existing.add(`${collection}:${document.slug}`))
    }
    const planned = demoSlugs.filter((slug) => ![...existing].some((value) => value.endsWith(`:${slug}`)))
    if (!apply) {
      console.log(JSON.stringify({ mode: 'dry-run', planned }, null, 2))
      return
    }

    const member = existing.has('members:demo-lin')
      ? await payload.find({ collection: 'members', limit: 1, overrideAccess: true, where: { slug: { equals: 'demo-lin' } } }).then((result) => result.docs[0])
      : await payload.create({
          collection: 'members',
          data: {
            bio: lexical('我在这里做一个可删除的前后端联调演示：后台编辑资料，发布后前台立刻读取。'),
            city: '长沙',
            featured: true,
            headline: '用真实协作，把想法变成能看见的现场。',
            role: '联调演示成员',
            slug: 'demo-lin',
            title: '林一',
            verified: true,
          },
          draft: false,
          overrideAccess: true,
        })

    const event = existing.has('events:demo-signal-night')
      ? await payload.find({ collection: 'events', limit: 1, overrideAccess: true, where: { slug: { equals: 'demo-signal-night' } } }).then((result) => result.docs[0])
      : await payload.create({
          collection: 'events',
          data: {
            content: lexical('这是本地联调演示活动。你可以在后台修改标题、摘要、时间与正文，刷新前台即可看见变化。'),
            excerpt: '一次用于验证内容后台与官网展示同步的本地活动。',
            featured: true,
            format: 'offline',
            location: '长沙 / 本地演示',
            organizers: [member.id],
            slug: 'demo-signal-night',
            startAt: '2026-08-08T11:00:00.000Z',
            title: '信号之夜：前后端联调演示',
          },
          draft: false,
          overrideAccess: true,
        })

    if (!existing.has('records:demo-first-field-note')) {
      await payload.create({
        collection: 'records',
        data: {
          content: lexical('这条 Field Note 演示后台发布后的前台详情页。它可以关联活动、成员、照片、外部链接和实际成果。'),
          dateStatus: 'confirmed',
          events: [event.id],
          excerpt: '从后台到网页，不再依赖 Notion 字段映射和等待缓存。',
          featured: true,
          location: '长沙 / 本地演示',
          members: [member.id],
          recordType: 'recap',
          slug: 'demo-first-field-note',
          timelineDate: '2026-08-08T11:00:00.000Z',
          title: '第一条联调 Field Note',
        },
        draft: false,
        overrideAccess: true,
      })
    }

    if (!existing.has('posts:demo-working-note')) {
      await payload.create({
        collection: 'posts',
        data: {
          authors: [member.id],
          content: lexical('这是一篇演示文章。编辑者可在 Payload 后台写正文、关联成员和活动、保存草稿并预览，再发布到这个详情页。'),
          events: [event.id],
          excerpt: '用一篇文章验证作者关系、发布状态和前台详情页。',
          featured: true,
          publishedAt: '2026-08-01T00:00:00.000Z',
          slug: 'demo-working-note',
          title: '从内容后台到官网的一次联调',
        },
        draft: false,
        overrideAccess: true,
      })
    }

    if (existing.has('pages:about')) {
      const aboutPage = await payload
        .find({ collection: 'pages', limit: 1, overrideAccess: true, where: { slug: { equals: 'about' } } })
        .then((result) => result.docs[0])
      await payload.update({
        collection: 'pages',
        data: {
          excerpt: 'IGNAI 是一个从长沙出发的青年 AI 社区。我们让活动之后的人继续相遇，让想法有下一次行动。',
          layout: aboutStoryLayout,
          title: '关于 IGNAI',
        },
        draft: false,
        id: aboutPage.id,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'pages',
        data: {
          excerpt: 'IGNAI 是一个从长沙出发的青年 AI 社区。我们让活动之后的人继续相遇，让想法有下一次行动。',
          layout: aboutStoryLayout,
          slug: 'about',
          title: '关于 IGNAI',
        },
        draft: false,
        overrideAccess: true,
      })
    }

    // Payload versions default to draft unless the status is explicitly published.
    // Keep reruns idempotent and make the demo visible to unauthenticated visitors.
    for (const collection of ['members', 'events', 'records', 'posts', 'pages'] as const) {
      const result = await payload.find({
        collection,
        depth: 0,
        draft: true,
        limit: 100,
        overrideAccess: true,
        pagination: false,
        where: { slug: { in: demoSlugs } },
      })
      for (const document of result.docs) {
        await payload.update({
          collection,
          data: { _status: 'published' } as never,
          draft: false,
          id: document.id,
          overrideAccess: true,
        })
      }
    }

    console.log(JSON.stringify({ mode: 'apply', createdOrReused: ['member', 'event', 'record', 'post', 'page'] }, null, 2))
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
