import type { Metadata } from 'next'

import { ContentCard } from '@/components/ContentCard'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getPublishedDocuments, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { description: 'IGNAI 的社区文章与思考。', title: '文章' }

export default async function PostsPage() {
  const [settingsResult, postsResult] = await Promise.allSettled([getSiteSettings(), getPublishedDocuments('posts', 100)])
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings
  const posts = postsResult.status === 'fulfilled' ? postsResult.value : []
  return (
    <main>
      <SiteNav items={settings.navigation?.length ? settings.navigation : fallbackSettings.navigation} />
      <header className="page-heading"><p>Writing / IGNAI</p><h1>把正在形成的想法写下来。</h1><span>{posts.length ? `${posts.length} 篇已发布文章` : '第一篇文章正在准备中'}</span></header>
      <section className="content-index">
        {posts.map((post, index) => <ContentCard collection="posts" document={post} index={index} key={post.id} />)}
      </section>
    </main>
  )
}
