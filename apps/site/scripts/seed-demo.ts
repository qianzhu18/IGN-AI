import dotenv from 'dotenv'
import path from 'node:path'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

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

    if (!existing.has('pages:about')) {
      await payload.create({
        collection: 'pages',
        data: {
          excerpt: '这是可在后台编辑的 About 页面演示。',
          layout: [
            { blockType: 'richText', content: lexical('IGNAI 是一个把线上信号带回真实现场的青年 AI 社区。这里的文本、行动按钮和内容集合均来自 Payload 后台。') },
            { action: { href: '/join', label: '加入社区' }, blockType: 'callToAction', body: '填写申请后，记录会直接进入运营后台。', heading: '下一次相遇，从一个行动开始。' },
            { blockType: 'communityCollection', collection: 'events', featuredOnly: true, heading: '正在发生', limit: 3 },
          ],
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

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
