import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { Event, Member, Page, Post, Record } from '@/payload-types'
import type { ContentCollection } from '@/lib/contentCollections'

import { AboutStorySection, type AboutStoryData } from './AboutStory'
import { RichText } from './RichText'

type PreviewableDocument = Event | Member | Page | Post | Record

const richText = (data: unknown) => <RichText data={data as DefaultTypedEditorState} />

function PageLayout({ page }: { page: Page }) {
  return (
    <div className="preview-layout">
      {page.layout.map((block, index) => {
        if (block.blockType === 'aboutStory') {
          return <AboutStorySection key={block.id || index} story={block as AboutStoryData} />
        }

        if (block.blockType === 'richText') {
          return <div key={block.id || index}>{richText(block.content)}</div>
        }
        if (block.blockType === 'callToAction') {
          return (
            <section className="preview-block preview-block--cta" key={block.id || index}>
              {block.eyebrow ? <p className="preview-kicker">{block.eyebrow}</p> : null}
              <h2>{block.heading}</h2>
              {block.body ? <p>{block.body}</p> : null}
              {block.action?.href && block.action.label ? (
                <a className="primary-action" href={block.action.href}>
                  {block.action.label}
                </a>
              ) : null}
            </section>
          )
        }
        return (
          <section className="preview-block" key={block.id || index}>
            <p className="preview-kicker">动态集合</p>
            <h2>{block.heading}</h2>
            <p>
              {block.collection} · 最多 {block.limit} 条{block.featuredOnly ? ' · 仅精选' : ''}
            </p>
          </section>
        )
      })}
    </div>
  )
}

export function PreviewDocument({
  collection,
  document,
}: {
  collection: ContentCollection
  document: PreviewableDocument
}) {
  if (collection === 'members') {
    const member = document as Member
    return (
      <>
        <header className="preview-header">
          <p className="preview-kicker">Member · {member.role}</p>
          <h1>{member.title}</h1>
          {member.headline ? <p className="preview-lead">{member.headline}</p> : null}
          <div className="preview-facts">
            {member.city ? <span>{member.city}</span> : null}
            {member.verified ? <span>资料已核验</span> : null}
            <span>{member._status === 'published' ? '已发布' : '草稿'}</span>
          </div>
        </header>
        <div className="preview-body">{richText(member.bio)}</div>
      </>
    )
  }

  if (collection === 'events') {
    const event = document as Event
    return (
      <>
        <header className="preview-header">
          <p className="preview-kicker">Event · {event.format}</p>
          <h1>{event.title}</h1>
          <p className="preview-lead">{event.excerpt}</p>
          <div className="preview-facts">
            <span>{new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(event.startAt))}</span>
            <span>{event.location}</span>
            <span>{event._status === 'published' ? '已发布' : '草稿'}</span>
          </div>
        </header>
        <div className="preview-body">{richText(event.content)}</div>
      </>
    )
  }

  if (collection === 'records') {
    const record = document as Record
    return (
      <>
        <header className="preview-header">
          <p className="preview-kicker">Record · {record.recordType}</p>
          <h1>{record.title}</h1>
          <p className="preview-lead">{record.excerpt}</p>
          <div className="preview-facts">
            {record.location ? <span>{record.location}</span> : null}
            <span>{record._status === 'published' ? '已发布' : '草稿'}</span>
          </div>
        </header>
        <div className="preview-body">{richText(record.content)}</div>
      </>
    )
  }

  if (collection === 'posts') {
    const post = document as Post
    return (
      <>
        <header className="preview-header">
          <p className="preview-kicker">Post</p>
          <h1>{post.title}</h1>
          <p className="preview-lead">{post.excerpt}</p>
          <div className="preview-facts">
            <span>{post.authors?.length || 0} 位作者</span>
            <span>{post._status === 'published' ? '已发布' : '草稿'}</span>
          </div>
        </header>
        <div className="preview-body">{richText(post.content)}</div>
      </>
    )
  }

  const page = document as Page
  return (
    <>
      <header className="preview-header">
        <p className="preview-kicker">Page</p>
        <h1>{page.title}</h1>
        {page.excerpt ? <p className="preview-lead">{page.excerpt}</p> : null}
        <div className="preview-facts">
          <span>/{page.slug}</span>
          <span>{page._status === 'published' ? '已发布' : '草稿'}</span>
        </div>
      </header>
      <PageLayout page={page} />
    </>
  )
}
