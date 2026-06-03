import Head from 'next/head'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { eventStatusLabel, eventFormatLabel } from '@/src/content/events'
import { normalizeEventList } from '@/lib/utils/event'
import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'

const EventsIndexPage = ({ events, pageTitle, pageDescription }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
      </Head>
      <div className='min-h-screen bg-[#07080C] text-white'>
        <div className='mx-auto max-w-3xl px-6 py-20'>
          <p className='text-xs font-medium tracking-wider uppercase text-[#F0CB8A]/72 mb-4'>
            Events
          </p>
          <h1 className='text-3xl font-bold mb-2'>近期活动</h1>
          <p className='text-white/50 mb-12'>
            线下聚会、主题共创、工作坊和社区实验，都会在这里持续更新。
          </p>

          <div className='flex flex-col gap-4'>
            {events.map(event => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className='group flex items-center gap-6 rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
              >
                <div className='flex-shrink-0 w-16 text-center'>
                  <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                    event.status === 'open'
                      ? 'border-[#ffb879]/20 bg-[#140b07]/74 text-[#ffd09a]'
                      : 'border-white/10 bg-white/5 text-white/50'
                  }`}>
                    {eventStatusLabel[event.status] || event.status}
                  </span>
                </div>

                <div className='flex-shrink-0 hidden sm:block'>
                  <img
                    src={event.cover || '/images/generated/ignite-core.png'}
                    alt=''
                    className='h-16 w-24 rounded object-cover'
                  />
                </div>

                <div className='flex-1 min-w-0'>
                  <h3 className='text-base font-semibold text-white truncate transition group-hover:text-[#ffd09a]'>
                    {event.title}
                  </h3>
                  <div className='flex flex-wrap gap-4 mt-1.5 text-xs text-white/45'>
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

                <div className='flex-shrink-0 text-white/30 group-hover:text-white/60 transition'>
                  <span className='text-sm'>&rarr;</span>
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

  const events = normalizeEventList(props.allEvents || [])
  const pageTitle = 'IGNAI - 活动'
  const pageDescription = 'IGNAI 社区活动 — 线下聚会、工作坊、Demo 和共创'

  delete props.allPages
  delete props.allMembers
  delete props.allEvents
  delete props.latestPosts
  delete props.allNavPages

  return {
    props: {
      ...props,
      events,
      pageTitle,
      pageDescription
    },
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default EventsIndexPage
