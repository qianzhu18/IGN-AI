import { CalendarDays, MapPin } from 'lucide-react'
import Image from 'next/image'
import SmartLink from '@/components/SmartLink'
import { eventFormatLabel, eventStatusLabel } from '@/src/content/events'
import { Reveal } from '../Reveal'

export function UpcomingEventsSection({ notionEvents = [] }) {
  const mergedEvents = notionEvents.map(e => ({
    slug: e.slug || e.id,
    title: e.title,
    subtitle: e.summary || '',
    status: e.ext?.status || 'planning',
    dateText: e.date?.start_date || e.ext?.dateText || '待定',
    location: e.ext?.location || '待定',
    format: e.ext?.format || 'offline',
    cover: e.pageCoverThumbnail || e.ext?.cover || '/images/generated/ignite-core.png',
    excerpt: e.summary || '',
    tags: e.tags || [],
  }))

  if (mergedEvents.length === 0) return null

  return (
    <section id='upcoming-events' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='section-eyebrow'>Upcoming Events</p>
            <h2 className='section-title mt-6 max-w-[13ch]'>
              近期活动，
              <br />
              真实发生。
            </h2>
            <p className='section-body mt-6'>
              线下聚会、主题共创、工作坊和社区实验，都会在这里持续更新。
            </p>
          </div>
          <div className='flex gap-4'>
            <SmartLink href='/events' className='ignai-cta-primary'>
              查看全部活动
            </SmartLink>
          </div>
        </Reveal>

        <div className='mt-16 grid items-stretch gap-6 lg:grid-cols-3'>
          {mergedEvents.slice(0, 3).map((event, index) => (
            <Reveal key={event.slug} delay={index * 0.08}>
              <SmartLink
                href={`/events/${event.slug}`}
                className='group ignai-unified-card ignai-event-card flex h-full min-h-[580px] flex-col overflow-hidden rounded-lg lg:min-h-0'
              >
                <div className='relative overflow-hidden'>
                <div className='relative aspect-[16/9] w-full overflow-hidden'>
                  <Image
                    src={event.cover}
                    alt=''
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
                    className='object-cover transition duration-500 group-hover:scale-[1.03]'
                  />
                </div>
                  <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.06)_0%,rgba(4,6,10,0.18)_42%,rgba(4,6,10,0.82)_100%)]' />
                  <div className='absolute left-4 top-4 rounded-full border border-[#ffb879]/20 bg-[#140b07]/74 px-3 py-1.5 text-xs font-medium text-[#ffd09a]'>
                    {eventStatusLabel[event.status]}
                  </div>
                </div>

                <div className='flex flex-1 flex-col p-5 sm:p-6'>
                  <div className='flex flex-wrap gap-3 text-sm text-white/56'>
                    <span className='inline-flex items-center gap-2'>
                      <CalendarDays className='h-4 w-4 text-[#F0CB8A]/78' />
                      {event.dateText}
                    </span>
                    <span className='inline-flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-[#9aceff]' />
                      {event.location} · {eventFormatLabel[event.format]}
                    </span>
                  </div>

                  <h3 className='mt-4 min-h-[3.7rem] text-[1.45rem] font-semibold leading-[1.26] text-white transition group-hover:text-[#ffd09a]'>
                    {event.title}
                  </h3>
                  {event.subtitle ? (
                    <p className='mt-2 min-h-5 text-sm text-white/42'>
                      {event.subtitle}
                    </p>
                  ) : null}
                  <p className='mt-4 line-clamp-2 text-sm leading-7 text-white/62'>
                    {event.excerpt}
                  </p>

                  <div className='mt-auto flex flex-wrap gap-2 pt-5'>
                    {event.tags.map(tag => (
                      <span
                        key={tag}
                        className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
