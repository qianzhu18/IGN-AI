import type { Payload } from 'payload'

type DashboardProps = {
  payload: Payload
}

const collections = [
  { href: '/admin/collections/members', label: '成员', slug: 'members' as const },
  { href: '/admin/collections/events', label: '活动', slug: 'events' as const },
  { href: '/admin/collections/records', label: '社区记录', slug: 'records' as const },
  { href: '/admin/collections/posts', label: '文章', slug: 'posts' as const },
]

export async function AdminDashboardOverview({ payload }: DashboardProps) {
  const metrics = await Promise.all(
    collections.map(async (collection) => {
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
        {metrics.map((metric) => (
          <a className="ignai-admin-metric" href={metric.href} key={metric.slug}>
            <span className="ignai-admin-metric__label">{metric.label}</span>
            <strong>{metric.total}</strong>
            <span>{metric.published} 已发布 · {metric.drafts} 草稿</span>
          </a>
        ))}
      </div>

      <div className="ignai-admin-workflow" aria-label="内容发布流程">
        <span><b>01</b> 创建内容</span>
        <span><b>02</b> 补齐关系</span>
        <span><b>03</b> 实时预览</span>
        <span><b>04</b> 编辑确认发布</span>
      </div>
    </section>
  )
}
