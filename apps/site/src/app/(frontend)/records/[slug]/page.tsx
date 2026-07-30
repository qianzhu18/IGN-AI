/* eslint-disable @next/next/no-img-element */
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getDocumentBySlug, getMediaURL, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'
type Args = { params: Promise<{ slug: string }> }

async function getRecord(slug: string) {
  const { isEnabled: draft } = await draftMode()
  return { draft, record: await getDocumentBySlug('records', decodeURIComponent(slug), draft) }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { record } = await getRecord((await params).slug)
  return record ? { description: record.excerpt, title: record.title } : { title: '记录未找到' }
}

export default async function RecordPage({ params }: Args) {
  const [{ draft, record }, settingsResult] = await Promise.all([getRecord((await params).slug), getSiteSettings().catch(() => fallbackSettings)])
  if (!record) notFound()
  const cover = getMediaURL(record.cover)
  const gallery = (record.gallery || []).map(getMediaURL).filter((url): url is string => Boolean(url))
  return (
    <main>
      <SiteNav items={settingsResult.navigation?.length ? settingsResult.navigation : fallbackSettings.navigation} />
      {draft ? <LivePreviewListener /> : null}
      <article className="content-detail">
        <header className="content-detail__header">
          <Link className="text-link" href="/records">← 返回记录</Link>
          <p className="section-label">Record · {record.recordType}</p><h1>{record.title}</h1><p className="content-detail__lead">{record.excerpt}</p>
          <div className="content-detail__facts">{record.location ? <span>{record.location}</span> : null}{draft ? <strong>草稿预览</strong> : null}</div>
        </header>
        {cover ? <figure className="event-detail__cover"><img alt="" height="900" src={cover} width="1600" /></figure> : null}
        <div className="content-detail__body"><RichText data={record.content as DefaultTypedEditorState} />
          {record.outcomes?.length ? <section className="outcome-list"><h2>留下的结果</h2><ul>{record.outcomes.map((outcome) => <li key={outcome.id || outcome.text}>{outcome.text}</li>)}</ul></section> : null}
          {record.tags?.length ? <ul className="tag-list">{record.tags.map((tag) => <li key={tag.id || tag.label}>{tag.label}</li>)}</ul> : null}
          {record.links?.length ? <div className="external-links">{record.links.map((item) => <a href={item.href} key={item.id || item.href} rel="noreferrer" target="_blank">{item.label} ↗</a>)}</div> : null}
        </div>
        {gallery.length ? <section className="gallery" aria-label="现场素材">{gallery.map((url) => (
          <img alt="" height="900" key={url} loading="lazy" src={url} width="1200" />
        ))}</section> : null}
      </article>
    </main>
  )
}
