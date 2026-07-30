import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentCard } from '@/components/ContentCard'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { SiteNav } from '@/components/SiteNav'
import type { Post } from '@/payload-types'
import { fallbackSettings, getDocumentBySlug, getMediaURL, getPublishedDocuments, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

async function getMember(slug: string) {
  const { isEnabled: draft } = await draftMode()
  return { draft, member: await getDocumentBySlug('members', decodeURIComponent(slug), draft) }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { member } = await getMember((await params).slug)
  return member ? { description: member.headline || undefined, title: member.title } : { title: '成员未找到' }
}

export default async function MemberPage({ params }: Args) {
  const { slug } = await params
  const [{ draft, member }, settingsResult, postsResult] = await Promise.all([
    getMember(slug),
    getSiteSettings().catch(() => fallbackSettings),
    getPublishedDocuments('posts', 100).catch(() => []),
  ])
  if (!member) notFound()

  const avatar = getMediaURL(member.avatar)
  const authoredPosts = (postsResult as Post[]).filter((post) =>
    post.authors?.some((author) => (typeof author === 'number' ? author : author.id) === member.id),
  )
  const socialLinks = Object.entries(member.socials || {}).filter(([, href]) => Boolean(href))

  return (
    <main>
      <SiteNav items={settingsResult.navigation?.length ? settingsResult.navigation : fallbackSettings.navigation} />
      {draft ? <LivePreviewListener /> : null}
      <article className="content-detail">
        <header className="content-detail__header member-detail__header">
          <Link className="text-link" href="/members">← 返回成员</Link>
          <div className="member-detail__identity">
            <div className="member-detail__avatar">
              {avatar ? (
                // Payload may return a public URL from an S3-compatible provider.
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={`${member.title}的头像`} height="360" src={avatar} width="360" />
              ) : <span>{member.title.slice(0, 1)}</span>}
            </div>
            <div>
              <p className="section-label">Member · {member.role}</p>
              <h1>{member.title}</h1>
              {member.headline ? <p className="content-detail__lead">{member.headline}</p> : null}
            </div>
          </div>
          <div className="content-detail__facts">
            {member.city ? <span>{member.city}</span> : null}
            {member.verified ? <span>资料已核验</span> : null}
            {draft ? <strong>草稿预览</strong> : null}
          </div>
        </header>
        <div className="content-detail__body">
          {member.quote ? <blockquote className="member-quote">“{member.quote}”</blockquote> : null}
          <RichText data={member.bio as DefaultTypedEditorState} />
          {member.focusAreas?.length ? (
            <ul className="tag-list" aria-label="关注方向">
              {member.focusAreas.map((area) => <li key={area.id || area.label}>{area.label}</li>)}
            </ul>
          ) : null}
          {socialLinks.length ? (
            <div className="external-links">
              {socialLinks.map(([label, href]) => <a href={href || undefined} key={label} rel="noreferrer" target="_blank">{label} ↗</a>)}
            </div>
          ) : null}
        </div>
        {authoredPosts.length ? (
          <section className="related-content">
            <p className="section-label">Published work</p>
            <h2>相关文章</h2>
            {authoredPosts.map((post, index) => <ContentCard collection="posts" document={post} index={index} key={post.id} />)}
          </section>
        ) : null}
      </article>
    </main>
  )
}
