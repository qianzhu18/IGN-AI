import SmartLink from '@/components/SmartLink'
import Image from 'next/image'

function uniqueBy(items, getKey) {
  const seen = new Set()
  const result = []

  items.forEach(item => {
    const key = getKey(item)
    if (!key || seen.has(key)) return
    seen.add(key)
    result.push(item)
  })

  return result
}

function getMemberKey(member) {
  return member?.id || member?.slug || member?.href || member?.title
}

function getEventKey(event) {
  return event?.id || event?.slug || event?.href || event?.title
}

function MemberChip({ member, tone = 'default' }) {
  return (
    <SmartLink
      href={member.href || '/members'}
      className={`ignai-post-context-member ignai-post-context-member--${tone}`}
    >
      <span className='ignai-post-context-avatar'>
        <Image
          src={member.avatar || '/avatar.svg'}
          alt={member.title || 'Member'}
          width={34}
          height={34}
        />
      </span>
      <span>
        <strong>{member.title || 'Member'}</strong>
        {member.role && <em>{member.role}</em>}
      </span>
    </SmartLink>
  )
}

function EventChip({ event }) {
  const isExternal = /^https?:\/\//i.test(event.href || '')

  return (
    <SmartLink
      href={event.href || '/events'}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className='ignai-post-context-event'
    >
      <span className='ignai-post-context-event-main'>
        <strong>{event.title || '社区活动'}</strong>
        {(event.dateText || event.location) && (
          <em>
            {[event.dateText, event.location].filter(Boolean).join(' / ')}
          </em>
        )}
      </span>
      {event.status && <span className='ignai-post-context-status'>{event.status}</span>}
    </SmartLink>
  )
}

function ContextGroup({ label, children }) {
  return (
    <div className='ignai-post-context-group'>
      <div className='ignai-post-context-label'>{label}</div>
      <div className='ignai-post-context-items'>{children}</div>
    </div>
  )
}

export function PostCommunityContext({ post }) {
  const authors = uniqueBy(
    Array.isArray(post?.authors) ? post.authors : [],
    getMemberKey
  )
  const authorKeys = new Set(authors.map(getMemberKey).filter(Boolean))
  const relatedMembers = uniqueBy(
    (Array.isArray(post?.relatedMembers) ? post.relatedMembers : []).filter(
      member => !authorKeys.has(getMemberKey(member))
    ),
    getMemberKey
  )
  const relatedEvents = uniqueBy(
    Array.isArray(post?.relatedEvents) ? post.relatedEvents : [],
    getEventKey
  )

  if (
    authors.length === 0 &&
    relatedMembers.length === 0 &&
    relatedEvents.length === 0
  ) {
    return null
  }

  return (
    <section className='ignai-post-context' aria-label='文章社区上下文'>
      <div className='ignai-post-context-head'>
        <span>Community context</span>
        <h2>这篇内容连接的人与活动</h2>
      </div>
      <div className='ignai-post-context-grid'>
        {authors.length > 0 && (
          <ContextGroup label='作者'>
            {authors.map(author => (
              <MemberChip
                key={getMemberKey(author)}
                member={author}
                tone='author'
              />
            ))}
          </ContextGroup>
        )}
        {relatedMembers.length > 0 && (
          <ContextGroup label='相关成员'>
            {relatedMembers.map(member => (
              <MemberChip key={getMemberKey(member)} member={member} />
            ))}
          </ContextGroup>
        )}
        {relatedEvents.length > 0 && (
          <ContextGroup label='相关活动'>
            {relatedEvents.map(event => (
              <EventChip key={getEventKey(event)} event={event} />
            ))}
          </ContextGroup>
        )}
      </div>
    </section>
  )
}
