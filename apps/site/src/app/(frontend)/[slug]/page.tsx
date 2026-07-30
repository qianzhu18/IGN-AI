import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageRenderer } from '@/components/PageRenderer'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getDocumentBySlug, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'
type Args = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  const { isEnabled: draft } = await draftMode()
  return { draft, page: await getDocumentBySlug('pages', decodeURIComponent(slug), draft) }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { page } = await getPage((await params).slug)
  return page ? { description: page.excerpt || undefined, title: page.title } : { title: '页面未找到' }
}

export default async function CMSPage({ params }: Args) {
  const [{ draft, page }, settingsResult] = await Promise.all([getPage((await params).slug), getSiteSettings().catch(() => fallbackSettings)])
  if (!page) notFound()
  return (
    <main>
      <SiteNav items={settingsResult.navigation?.length ? settingsResult.navigation : fallbackSettings.navigation} />
      {draft ? <LivePreviewListener /> : null}
      <article className="cms-page"><header className="page-heading"><p>Page / IGNAI</p><h1>{page.title}</h1>{page.excerpt ? <span>{page.excerpt}</span> : null}</header><PageRenderer page={page} /></article>
    </main>
  )
}
