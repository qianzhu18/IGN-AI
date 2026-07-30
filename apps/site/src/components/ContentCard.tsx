import Link from 'next/link'

import type { Member, Post, Record as CommunityRecord } from '@/payload-types'
import { getMediaURL } from '@/lib/content'

type CardDocument = Member | Post | CommunityRecord
type CardCollection = 'members' | 'posts' | 'records'

const collectionLabel: globalThis.Record<CardCollection, string> = {
  members: 'Member',
  posts: 'Post',
  records: 'Record',
}

function metadata(collection: CardCollection, document: CardDocument) {
  if (collection === 'members') {
    const member = document as Member
    return [member.role, member.city].filter(Boolean).join(' · ')
  }
  if (collection === 'records') {
    const record = document as CommunityRecord
    return [record.location, record.recordType].filter(Boolean).join(' · ')
  }
  const post = document as Post
  return post.publishedAt
    ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(new Date(post.publishedAt))
    : '社区文章'
}

function summary(collection: CardCollection, document: CardDocument) {
  if (collection === 'members') return (document as Member).headline || 'IGNAI 社区成员'
  return (document as Post | CommunityRecord).excerpt
}

export function ContentCard({
  collection,
  document,
  index,
}: {
  collection: CardCollection
  document: CardDocument
  index: number
}) {
  const cover = collection === 'members' ? (document as Member).avatar : (document as Post | CommunityRecord).cover
  const imageURL = getMediaURL(cover)

  return (
    <article className="content-card">
      <Link aria-label={`查看${document.title}`} className="content-card__link" href={`/${collection}/${document.slug}`}>
        <div className="content-card__visual">
          {imageURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" height="640" loading="lazy" src={imageURL} width="960" />
          ) : (
            <span aria-hidden="true" className="content-card__index">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
        <div className="content-card__copy">
          <p className="content-card__meta">
            {collectionLabel[collection]} {metadata(collection, document) ? `· ${metadata(collection, document)}` : ''}
          </p>
          <h3>{document.title}</h3>
          <p>{summary(collection, document)}</p>
          <span className="text-link">查看详情 →</span>
        </div>
      </Link>
    </article>
  )
}
