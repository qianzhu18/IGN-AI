import Link from 'next/link'
import type { Payload } from 'payload'

type DashboardProps = {
  payload: Payload
}

const contentCollections = [
  { href: '/admin/collections/members', label: '成员', slug: 'members' as const },
  { href: '/admin/collections/events', label: '活动', slug: 'events' as const },
  { href: '/admin/collections/records', label: '社区记录', slug: 'records' as const },
  { href: '/admin/collections/posts', label: '文章', slug: 'posts' as const },
  { href: '/admin/collections/pages', label: '页面', slug: 'pages' as const },
]

const quickActions = [
  { href: '/admin/collections/events/create', label: '新建活动' },
  { href: '/admin/collections/records/create', label: '新建记录' },
  { href: '/admin/collections/posts/create', label: '新建文章' },
  { href: '/admin/collections/members/create', label: '添加成员' },
  { href: '/admin/collections/media', label: '管理媒体' },
  { href: '/admin/globals/site-settings', label: '站点设置' },
]

export async function AdminDashboardOverview({ payload }: DashboardProps) {
  const contentMetrics = await Promise.all(
    contentCollections.map(async (collection) => {
      const [all, published] = await Promise.all([
        payload.count({ collection: collection.slug, overrideAccess: true }),
        payload.count({
          collection: collection.slug,
          overrideAccess: true,
          where: { _status: { equals: 'published' } },
        }),
      ])

      return {
        ...collection,
        drafts: Math.max(0, all.totalDocs - published.totalDocs),
        published: published.totalDocs,
        total: all.totalDocs,
      }
    }),
  )

  const newSubmissions = await payload.count({
    collection: 'join-submissions',
    overrideAccess: true,
    where: { status: { equals: 'submitted' } },
  })

  return (
    <section className="ignai-admin-overview">
      <div className="ignai-admin-overview__heading">
        <div>
          <p className="ignai-admin-overview__eyebrow">IGNAI CONTENT OPERATIONS</p>
          <h1>内容运营台</h1>
        </div>
        <p>在同一个后台完成结构化内容、关系、预览与发布。</p>
      </div>

      <div className="ignai-admin-overview__metrics">
        {contentMetrics.map((metric) => (
          <Link className="ignai-admin-metric" href={metric.href} key={metric.slug}>
            <span className="ignai-admin-metric__label">{metric.label}</span>
            <strong>{metric.total}</strong>
            <span>{metric.published} 已发布 · {metric.drafts} 草稿</span>
          </Link>
        ))}
        <Link className="ignai-admin-metric" href="/admin/collections/join-submissions">
          <span className="ignai-admin-metric__label">加入申请</span>
          <strong>{newSubmissions.totalDocs}</strong>
          <span>待处理的新提交</span>
        </Link>
      </div>

      <div className="ignai-admin-quick-actions" aria-label="常用操作">
        <div>
          <p className="ignai-admin-overview__eyebrow">COMMON ACTIONS</p>
          <h2>从这里开始维护官网</h2>
        </div>
        <div className="ignai-admin-quick-actions__links">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.href}>{action.label}</Link>
          ))}
        </div>
      </div>

      <div className="ignai-admin-workflow" aria-label="内容发布流程">
        <span><b>01</b> 创建或打开内容</span>
        <span><b>02</b> 填写正文、封面和关系</span>
        <span><b>03</b> 保存草稿并预览</span>
        <span><b>04</b> 确认后发布，刷新前台验证</span>
      </div>
    </section>
  )
}
