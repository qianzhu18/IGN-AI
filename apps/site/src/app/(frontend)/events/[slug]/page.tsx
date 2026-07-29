import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import config from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getMediaURL, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: decodeURIComponent(slug) } },
  })
  return { draft, event: result.docs[0] || null }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const { event } = await getEvent(slug)
  if (!event) return { title: '活动未找到' }
  return { description: event.excerpt, title: event.title }
}

export default async function EventPage({ params }: Args) {
  const { slug } = await params
  const [{ draft, event }, settingsResult] = await Promise.all([
    getEvent(slug),
    getSiteSettings().catch(() => fallbackSettings),
  ])

  if (!event) notFound()
  const coverURL = getMediaURL(event.cover)
  const date = new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(event.startAt))

  return (
    <main>
      <SiteNav
        items={settingsResult.navigation?.length ? settingsResult.navigation : fallbackSettings.navigation}
      />
      {draft ? <LivePreviewListener /> : null}
      <article className="event-detail">
        <header className="event-detail__header">
          <Link className="text-link" href="/events">
            ← 返回活动
          </Link>
          <p>{date}</p>
          <h1>{event.title}</h1>
          <div className="event-detail__facts">
            <span>{event.location}</span>
            <span>{event.format === 'online' ? '线上' : event.format === 'hybrid' ? '混合' : '线下'}</span>
            {draft ? <strong>草稿预览</strong> : null}
          </div>
        </header>

        {coverURL ? (
          <figure className="event-detail__cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height="900" src={coverURL} width="1600" />
          </figure>
        ) : null}

        <div className="event-detail__body">
          <p className="event-detail__excerpt">{event.excerpt}</p>
          <RichText data={event.content as DefaultTypedEditorState} />
          {event.registrationURL ? (
            <a className="primary-action" href={event.registrationURL} rel="noreferrer" target="_blank">
              打开报名页面 <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </article>
    </main>
  )
}
