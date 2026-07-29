import Link from 'next/link'

import type { Event } from '@/payload-types'
import { getMediaURL } from '@/lib/content'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(value))

export function EventCard({ event, index }: { event: Event; index: number }) {
  const coverURL = getMediaURL(event.cover)

  return (
    <article className="event-card">
      <Link
        aria-label={`查看活动：${event.title}`}
        className="event-card__link"
        href={`/events/${event.slug}`}
      >
        <div className="event-card__visual">
          {coverURL ? (
            // Payload may return local or R2 URLs; the CSS crop keeps both predictable.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" height="640" loading="lazy" src={coverURL} width="960" />
          ) : (
            <span aria-hidden="true" className="event-card__index">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
        <div className="event-card__copy">
          <p className="event-card__meta">
            <time dateTime={event.startAt}>{formatDate(event.startAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{event.location}</span>
          </p>
          <h3>{event.title}</h3>
          <p>{event.excerpt}</p>
          <span className="text-link">查看现场 →</span>
        </div>
      </Link>
    </article>
  )
}
