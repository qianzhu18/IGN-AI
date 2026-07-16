import Head from 'next/head'
import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData
} from '@/lib/db/SiteDataApi'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { eventStatusLabel, eventFormatLabel, eventKindLabel } from '@/src/content/events'
import {
  getEventHref,
  getEventCoverFallback,
  isExternalEvent,
  isMockEvent,
  isPublicUpcomingEvent,
  normalizeEventList
} from '@/lib/utils/event'
import Link from 'next/link'
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react'

const EventsIndexPage = ({ events, pageTitle, pageDescription }) => {
  const visibleEvents = events.filter(event => isPublicUpcomingEvent(event))

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
      </Head>
      <div className='ignai-themed-page min-h-screen bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <div className='mx-auto max-w-6xl px-6 py-20'>
          <p className='text-xs font-medium tracking-wider uppercase text-[#F0CB8A]/72 mb-4'>
            Events
          </p>
          <h1 className='text-3xl font-bold mb-2'>活动与见面</h1>
          <p className='max-w-2xl text-white/50 mb-8'>
            这里是 IGNAI 正在发生的线下见面、共创和合作活动。每一场都会标明时间、地点、IGNAI 的角色和参与方式。
          </p>

          <div className='mb-10 grid gap-3 sm:grid-cols-2'>
            {[
              ['开放 / 进行中', visibleEvents.filter(event => event.status === 'open' || event.status === 'ongoing').length],
              ['筹备中', visibleEvents.filter(event => event.status === 'planning').length]
            ].map(([label, count]) => (
              <div key={label} className='rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3'>
                <div className='text-2xl font-semibold text-white'>{count}</div>
                <div className='mt-1 text-xs text-white/42'>{label}</div>
              </div>
            ))}
          </div>

          <div className='grid gap-5 md:grid-cols-2'>
            {visibleEvents.map(event => (
              <Link
                key={event.slug}
                href={getEventHref(event)}
                prefetch={false}
                target={isExternalEvent(event) ? '_blank' : undefined}
                rel={isExternalEvent(event) ? 'noopener noreferrer' : undefined}
                data-analytics-event='click_event_card'
                data-analytics-label={event.title}
                data-analytics-prop-placement='events_index'
                data-analytics-prop-status={event.status}
                data-analytics-prop-kind={event.kind}
                className='group ignai-themed-card grid overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline sm:grid-cols-[180px_1fr]'
              >
                <div className='relative aspect-[16/9] overflow-hidden bg-white/[0.03] sm:aspect-auto'>
                  <img
                    src={event.cover || getEventCoverFallback(event)}
                    alt=''
                    style={{ objectPosition: event.coverPosition || 'center' }}
                    className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]'
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src = getEventCoverFallback(event)
                    }}
                  />
                </div>

                <div className='min-w-0 p-5'>
                  <div className='mb-3 flex flex-wrap gap-2'>
                    <span className='rounded-full border border-[#ffb879]/20 bg-[#140b07]/74 px-3 py-1 text-xs font-medium text-[#ffd09a]'>
                      {eventKindLabel[event.kind] || '社区活动'}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      event.status === 'open' || event.status === 'ongoing'
                        ? 'border-[#ffb879]/20 bg-[#140b07]/74 text-[#ffd09a]'
                        : 'border-white/10 bg-white/5 text-white/50'
                    }`}>
                      {eventStatusLabel[event.status] || event.status}
                    </span>
                    {isExternalEvent(event) && (
                      <span className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/52'>
                        外部入口 <ExternalLink className='h-3 w-3' />
                      </span>
                    )}
                  </div>
                  <h3 className='text-lg font-semibold leading-snug text-white transition group-hover:text-[#ffd09a] line-clamp-2'>
                    {event.title}
                  </h3>
                  <p className='mt-2 line-clamp-2 text-sm leading-6 text-white/52'>
                    {event.excerpt || event.subtitle || '查看活动详情与参与方式。'}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-4 text-xs text-white/45'>
                    <span className='inline-flex items-center gap-1.5'>
                      <CalendarDays className='h-3.5 w-3.5 text-[#F0CB8A]/60' />
                      {event.dateText}
                    </span>
                    <span className='inline-flex items-center gap-1.5'>
                      <MapPin className='h-3.5 w-3.5 text-[#9aceff]/60' />
                      {event.location} · {eventFormatLabel[event.format] || event.format}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {visibleEvents.length === 0 && (
              <div className='col-span-full border-y border-white/[0.08] py-14 text-center'>
                <p className='text-xl font-semibold text-white'>下一次见面正在准备。</p>
                <p className='mx-auto mt-3 max-w-lg text-sm leading-7 text-white/52'>
                  先来认识社区。你可以带着一个项目、一个问题，或者想参与活动的心情来；我们会把下一次机会告诉你。
                </p>
                <Link href='/join' className='mt-7 inline-flex rounded-lg border border-[#ffb879]/30 px-5 py-3 text-sm font-medium text-[#ffd09a] no-underline transition hover:border-[#ffb879]/60'>
                  加入社区
                </Link>
                <Link href='/records' className='mt-4 block text-sm text-white/50 hover:text-white'>
                  先看看我们一起做过的事
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const from = 'events-index'
  const props = await fetchGlobalAllData({ from, locale })
  const freshEvents = await fetchEventsFromOfficialAPI()
  const allEvents = freshEvents.length > 0 ? freshEvents : props.allEvents || []

  const events = normalizeEventList(allEvents).filter(event => !isMockEvent(event))
  const pageTitle = 'IGNAI - 活动'
  const pageDescription = 'IGNAI 社区活动 — 线下聚会、工作坊、Demo 和共创'

  delete props.allPages
  delete props.allMembers
  delete props.allEvents
  delete props.latestPosts
  delete props.allNavPages
  delete props.notice
  delete props.customMenu
  delete props.customNav
  delete props.tagOptions
  delete props.categoryOptions
  delete props.postCount

  return {
    props: {
      ...props,
      events,
      pageTitle,
      pageDescription
    },
    revalidate: process.env.EXPORT
      ? undefined
      : Math.min(
          Number(
            siteConfig(
              'NEXT_REVALIDATE_SECOND',
              BLOG.NEXT_REVALIDATE_SECOND,
              props.NOTION_CONFIG
            )
          ) || 600,
          60
        )
  }
}

export default EventsIndexPage
