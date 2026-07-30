/* eslint-disable @next/next/no-img-element */
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { SiteNav } from '@/components/SiteNav'
import type { Member } from '@/payload-types'
import { fallbackSettings, getDocumentBySlug, getMediaURL, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'
type Args = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const { isEnabled: draft } = await draftMode()
  return { draft, post: await getDocumentBySlug('posts', decodeURIComponent(slug), draft) }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { post } = await getPost((await params).slug)
  return post ? { description: post.excerpt, title: post.title } : { title: '文章未找到' }
}

export default async function PostPage({ params }: Args) {
  const [{ draft, post }, settingsResult] = await Promise.all([getPost((await params).slug), getSiteSettings().catch(() => fallbackSettings)])
  if (!post) notFound()
  const cover = getMediaURL(post.cover)
  const authors = post.authors.filter((author): author is Member => typeof author !== 'number')
  return (
    <main>
      <SiteNav items={settingsResult.navigation?.length ? settingsResult.navigation : fallbackSettings.navigation} />
      {draft ? <LivePreviewListener /> : null}
      <article className="content-detail">
        <header className="content-detail__header">
          <Link className="text-link" href="/posts">← 返回文章</Link>
          <p className="section-label">Post / IGNAI</p><h1>{post.title}</h1><p className="content-detail__lead">{post.excerpt}</p>
          <div className="content-detail__facts">{post.publishedAt ? <span>{new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(post.publishedAt))}</span> : null}{draft ? <strong>草稿预览</strong> : null}</div>
        </header>
        {cover ? <figure className="event-detail__cover"><img alt="" height="900" src={cover} width="1600" /></figure> : null}
        <div className="content-detail__body">
          {authors.length ? <div className="author-list">{authors.map((author) => <Link href={`/members/${author.slug}`} key={author.id}>{author.title}</Link>)}</div> : null}
          <RichText data={post.content as DefaultTypedEditorState} />
          {post.categories?.length ? <ul className="tag-list">{post.categories.map((item) => <li key={item.id || item.label}>{item.label}</li>)}</ul> : null}
          {post.tags?.length ? <ul className="tag-list">{post.tags.map((item) => <li key={item.id || item.label}>{item.label}</li>)}</ul> : null}
        </div>
      </article>
    </main>
  )
}
