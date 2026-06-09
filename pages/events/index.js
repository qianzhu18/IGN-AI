import Head from 'next/head'
import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData
} from '@/lib/db/SiteDataApi'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { eventStatusLabel, eventFormatLabel, eventKindLabel } from '@/src/content/events'
import { getEventHref, isExternalEvent, normalizeEventList } from '@/lib/utils/event'
import Link from 'next/link'
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react'
import { mergeFixtureEvents } from '@/lib/dev/contentFixtures'

const EventsIndexPage = ({ events, pageTitle, pageDescription }) => {
  const openEvents = events.filter(event => event.status === 'open' || event.status === 'ongoing')
  const planningEvents = events.filter(event => event.status === 'planning')
  const recapEvents = events.filter(event => event.status === 'recap' || event.status === 'finished')
  const closedEvents = events.filter(event => event.status === 'closed')

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
          <h1 className='text-3xl font-bold mb-2'>近期活动</h1>
          <p className='max-w-2xl text-white/50 mb-8'>
            这里整理 IGNAI 成员组织、联动、参与和协助宣发的活动。
          </p>

          <div className='mb-10 grid gap-3 sm:grid-cols-4'>
            {[
              ['开放 / 进行中', openEvents.length],
              ['筹备中', planningEvents.length],
              ['已复盘 / 结束', recapEvents.length],
              ['已满员', closedEvents.length]
            ].map(([label, count]) => (
              <div key={label} className='rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3'>
                <div className='text-2xl font-semibold text-white'>{count}</div>
                <div className='mt-1 text-xs text-white/42'>{label}</div>
              </div>
            ))}
          </div>

          <div className='grid gap-5 md:grid-cols-2'>
            {events.map(event => (
              <Link
                key={event.slug}
                href={getEventHref(event)}
                prefetch={false}
                target={isExternalEvent(event) ? '_blank' : undefined}
                rel={isExternalEvent(event) ? 'noopener noreferrer' : undefined}
                className='group ignai-themed-card grid overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline sm:grid-cols-[180px_1fr]'
              >
                <div className='relative aspect-[16/9] overflow-hidden bg-white/[0.03] sm:aspect-auto'>
                  <img
                    src={event.cover || '/images/generated/ignite-core.png'}
                    alt=''
                    style={{ objectPosition: event.coverPosition || 'center' }}
                    className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]'
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

            {events.length === 0 && (
              <p className='text-white/30 text-sm py-12 text-center'>
                暂无活动，敬请期待。
              </p>
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
  const allEvents = mergeFixtureEvents(
    freshEvents.length > 0 ? freshEvents : props.allEvents || []
  )

  const events = normalizeEventList(allEvents)
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
