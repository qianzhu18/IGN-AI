import Head from 'next/head'
import {
  fetchEventsFromOfficialAPI,
  fetchRecordsFromOfficialAPI,
  fetchGlobalAllData,
  getPostBlocks
} from '@/lib/db/SiteDataApi'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import {
  eventKindLabel,
  eventStatusLabel,
  eventFormatLabel
} from '@/src/content/events'
import {
  normalizeEventList,
  normalizeEventSlugValue,
  normalizeNotionEvent,
  getEventCoverFallback
} from '@/lib/utils/event'
import { getAllRecords } from '@/lib/records'
import Link from 'next/link'
import { CalendarDays, MapPin, ArrowLeft } from 'lucide-react'

const EventDetailPage = ({
  event,
  relatedRecords,
  pageTitle,
  pageDescription
}) => {
  if (!event) {
    return (
      <div className='ignai-themed-page flex min-h-screen items-center justify-center bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <p className='text-white/40'>活动未找到</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
      </Head>
      <div className='ignai-themed-page min-h-screen bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <div className='mx-auto max-w-3xl px-6 py-20'>
          <Link
            href='/events'
            className='inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition no-underline mb-8'
          >
            <ArrowLeft className='h-4 w-4' />
            返回活动列表
          </Link>

          {event.cover && (
            <img
              src={event.cover || getEventCoverFallback(event)}
              alt=''
              style={{ objectPosition: event.coverPosition || 'center' }}
              className='w-full rounded-lg object-cover aspect-[16/9] mb-8'
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = getEventCoverFallback(event)
              }}
            />
          )}

          <div className='flex flex-wrap gap-3 text-sm text-white/50 mb-4'>
            <span className='inline-block rounded-full border border-[#ffb879]/20 bg-[#140b07]/74 px-3 py-1 text-xs font-medium text-[#ffd09a]'>
              {eventKindLabel[event.kind] || '社区活动'}
            </span>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                event.status === 'open' || event.status === 'ongoing'
                  ? 'border-[#ffb879]/20 bg-[#140b07]/74 text-[#ffd09a]'
                  : 'border-white/10 bg-white/5 text-white/50'
              }`}
            >
              {eventStatusLabel[event.status] || event.status}
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <CalendarDays className='h-4 w-4 text-[#F0CB8A]/60' />
              {event.dateText}
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <MapPin className='h-4 w-4 text-[#9aceff]/60' />
              {event.location} ·{' '}
              {eventFormatLabel[event.format] || event.format}
            </span>
          </div>

          <h1 className='text-3xl font-bold mb-2'>{event.title}</h1>
          {event.subtitle && (
            <p className='text-lg text-white/50 mb-8'>{event.subtitle}</p>
          )}

          <p className='text-white/60 leading-relaxed mb-8'>{event.excerpt}</p>

          {event.tags?.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-8'>
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {event.blockMap && (
            <article className='mb-12 ignai-event-body'>
              <NotionPage post={{ blockMap: event.blockMap }} />
            </article>
          )}

          {event.agenda?.length > 0 && (
            <div className='mb-8'>
              <h2 className='text-xl font-semibold mb-4'>议程</h2>
              <ul className='space-y-2'>
                {event.agenda.map((item, i) => (
                  <li
                    key={i}
                    className='text-white/50 text-sm flex items-start gap-2'
                  >
                    <span className='text-[#F0CB8A]/60 mt-0.5'>-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.notes?.length > 0 && (
            <div className='mb-8 rounded-lg border border-white/[0.08] bg-white/[0.025] p-5'>
              <h2 className='text-xl font-semibold mb-4'>参与说明</h2>
              <ul className='space-y-2'>
                {event.notes.map((note, i) => (
                  <li key={i} className='text-sm leading-7 text-white/52'>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedRecords?.length > 0 && (
            <section className='mb-8 border-t border-white/10 pt-8'>
              <h2 className='text-xl font-semibold mb-4'>关联社区记录</h2>
              <div className='flex flex-wrap gap-3'>
                {relatedRecords.map(record => (
                  <Link
                    key={record.slug}
                    href={`/records/${record.slug}`}
                    className='inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-white/62 no-underline transition hover:border-white/20 hover:text-white'
                  >
                    {record.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(event.registrationUrl || event.registrationQrImage) && (
            <div className='mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-5'>
              <h2 className='text-xl font-semibold mb-4'>报名入口</h2>
              <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
                {event.registrationQrImage && (
                  <img
                    src={event.registrationQrImage}
                    alt='活动报名二维码'
                    className='h-32 w-32 rounded-lg border border-white/10 object-cover'
                  />
                )}
                <div>
                  <p className='mb-4 text-sm leading-7 text-white/50'>
                    报名入口由活动方提供，并在 IGNAI 官网同步展示。
                  </p>
                  {event.registrationUrl && (
                    <Link
                      href={event.registrationUrl}
                      className='inline-block rounded-full bg-[#FF7A18] px-6 py-3 text-sm font-medium text-white no-underline hover:bg-[#ff8c3a] transition'
                    >
                      报名参加
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths({ locales = [] } = {}) {
  let events = []

  try {
    const [props, freshEvents] = await Promise.all([
      fetchGlobalAllData({ from: 'event-paths' }),
      fetchEventsFromOfficialAPI()
    ])
    events = normalizeEventList(
      freshEvents.length > 0 ? freshEvents : props.allEvents || []
    )
  } catch (error) {
    console.warn(
      '[EVENT-PATHS] Failed to fetch Notion Event paths:',
      error.message
    )
  }

  const slugs = [
    ...new Set(
      events.map(event => normalizeEventSlugValue(event.slug)).filter(Boolean)
    )
  ]
  const paths =
    locales.length > 0
      ? locales.flatMap(locale =>
          slugs.map(slug => ({ params: { slug }, locale }))
        )
      : slugs.map(slug => ({ params: { slug } }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params, locale }) {
  const { slug } = params
  const from = 'event-detail'
  const props = await fetchGlobalAllData({ from, locale })
  const [freshEvents, freshRecords] = await Promise.all([
    fetchEventsFromOfficialAPI(),
    fetchRecordsFromOfficialAPI()
  ])
  const allEvents = freshEvents.length > 0 ? freshEvents : props.allEvents || []
  const allRecords =
    freshRecords.length > 0 ? freshRecords : props.allRecords || []

  const normalizedSlug = normalizeEventSlugValue(slug)
  const notionEvent = allEvents.find(
    e =>
      normalizeEventSlugValue(e.slug, e.title, e.id) === normalizedSlug ||
      normalizeEventSlugValue(e.id) === normalizedSlug
  )

  const event = notionEvent ? normalizeNotionEvent(notionEvent) : null

  if (!event) {
    return { notFound: true }
  }

  // Pull Notion page blocks so edits made in the Notion page body surface on
  // the site (NotionNext default editing model). Rendered via <NotionRenderer>
  // so all Notion block types (headings, paragraphs, lists, images, callouts,
  // etc.) are faithfully represented — same pipeline [prefix] uses.
  if (event.id) {
    try {
      const rawBlockMap = await getPostBlocks(event.id, from)
      if (rawBlockMap) {
        const adapted = adapterNotionBlockMap(rawBlockMap)
        event.blockMap = {
          ...adapted,
          block: formatNotionBlock(adapted.block)
        }
      }
    } catch (err) {
      console.warn(
        '[EVENT-DETAIL] fetchNotionPageBlocks failed:',
        event.id,
        err.message
      )
    }
  }

  const explicitRelatedRecordSlugs = new Set(event.relatedRecordSlugs || [])
  const relatedRecords = getAllRecords(allRecords).filter(
    record =>
      explicitRelatedRecordSlugs.has(record.slug) ||
      record.relatedEventSlugs?.includes(event.slug)
  )

  const pageTitle = `${event.title} - IGNAI`
  const pageDescription =
    event.excerpt || event.subtitle || 'IGNAI 社区活动详情与参与方式。'

  return {
    props: {
      event,
      relatedRecords,
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

export default EventDetailPage
