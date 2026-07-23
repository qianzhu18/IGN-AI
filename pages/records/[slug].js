import Head from 'next/head'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  MapPin
} from 'lucide-react'
import {
  fetchGlobalAllData,
  fetchRecordsFromOfficialAPI,
  getPostBlocks
} from '@/lib/db/SiteDataApi'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { getAllRecords, getRecordBySlug, recordTypeLabel } from '@/lib/records'
import NotionPage from '@/components/NotionPage'
import {
  getEventHref,
  isExternalEvent,
  normalizeEventList
} from '@/lib/utils/event'

// Walk a Notion blockMap and return the first child paragraph's plain text.
// Used as a fallback excerpt when the Notion `summary` property is empty,
// so editors can skip the summary property and still get a header excerpt.
function extractLeadParagraph(blockMap, pageId) {
  const blocks = blockMap?.block
  if (!blocks || !pageId) return ''
  for (const block of Object.values(blocks)) {
    const value = block?.value
    if (!value || value.type !== 'text') continue
    if (value.parent_id !== pageId) continue
    const title = value?.properties?.title
    if (!Array.isArray(title)) continue
    const text = title
      .flat(Infinity)
      .filter(chunk => typeof chunk === 'string')
      .join('')
      .trim()
    if (text) return text
  }
  return ''
}

const RecordDetailPage = ({
  record,
  moreRecords,
  relatedEvents,
  pageTitle,
  pageDescription
}) => {
  if (!record) {
    return (
      <main className='ignai-themed-page flex min-h-screen items-center justify-center bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <p className='text-white/40'>记录未找到</p>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
      </Head>
      <main className='ignai-themed-page min-h-screen bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <article className='mx-auto max-w-4xl px-6 py-20'>
          <Link
            href='/records'
            className='mb-10 inline-flex items-center gap-2 text-sm text-white/42 no-underline transition hover:text-white'
          >
            <ArrowLeft className='h-4 w-4' />
            返回社区记录
          </Link>

          <div className='flex flex-wrap items-center gap-3 text-sm text-white/50'>
            <span className='rounded-full border border-[#7cc8ff]/16 bg-[#071521]/70 px-3 py-1.5 text-xs text-[#c7e6ff]'>
              {recordTypeLabel[record.type]}
            </span>
            <span className='inline-flex items-center gap-2'>
              <CalendarDays className='h-4 w-4 text-[#F0CB8A]/72' />
              {record.dateText || '日期未确认'}
            </span>
            {record.location && (
              <span className='inline-flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-[#9aceff]/72' />
                {record.location}
              </span>
            )}
          </div>

          <h1 className='mt-6 text-4xl font-semibold leading-tight sm:text-5xl'>
            {record.title}
          </h1>
          <p className='mt-6 max-w-3xl text-base leading-8 text-white/58'>
            {record.excerpt}
          </p>

          {record.cover && (
            <div className='mt-10 overflow-hidden rounded-lg border border-white/10'>
              <img
                src={record.cover}
                alt=''
                className='aspect-[16/9] w-full object-cover'
              />
            </div>
          )}

          {record.outcomes?.length > 0 && (
            <section className='mt-10 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6'>
              <p className='text-xs font-medium uppercase tracking-wider text-[#F0CB8A]/70'>
                Outcomes
              </p>
              <div className='mt-5 grid gap-3 sm:grid-cols-3'>
                {record.outcomes.map(outcome => (
                  <div
                    key={outcome}
                    className='rounded-md border border-white/[0.07] bg-[#070b10]/72 px-4 py-3 text-sm text-white/68'
                  >
                    {outcome}
                  </div>
                ))}
              </div>
            </section>
          )}

          {record.blockMap && (
            <div className='ignai-record-body mt-12'>
              <NotionPage post={{ blockMap: record.blockMap }} />
            </div>
          )}

          <div className='mt-12 flex flex-wrap gap-2'>
            {record.tags.map(tag => (
              <span
                key={tag}
                className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/52'
              >
                {tag}
              </span>
            ))}
          </div>

          {record.links?.length > 0 && (
            <div className='mt-12 border-t border-white/10 pt-8'>
              <h2 className='mb-5 inline-flex items-center gap-2 text-xl font-semibold'>
                <BookOpen className='h-5 w-5 text-[#F0CB8A]/72' />
                相关链接
              </h2>
              <div className='flex flex-wrap gap-3'>
                {record.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/62 no-underline transition hover:border-white/20 hover:text-white'
                  >
                    {link.label}
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedEvents?.length > 0 && (
            <section className='mt-12 border-t border-white/10 pt-8'>
              <h2 className='mb-5 inline-flex items-center gap-2 text-xl font-semibold'>
                <CalendarDays className='h-5 w-5 text-[#F0CB8A]/72' />
                关联活动
              </h2>
              <div className='flex flex-wrap gap-3'>
                {relatedEvents.map(event => {
                  const href = getEventHref(event)
                  const external = isExternalEvent(event)
                  return (
                    <Link
                      key={event.slug}
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className='inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/62 no-underline transition hover:border-white/20 hover:text-white'
                    >
                      {event.title}
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {moreRecords.length > 0 && (
            <section className='mt-16 border-t border-white/10 pt-8'>
              <h2 className='text-xl font-semibold'>更多记录</h2>
              <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                {moreRecords.map(item => (
                  <Link
                    key={item.slug}
                    href={`/records/${item.slug}`}
                    className='rounded-lg border border-white/[0.07] bg-white/[0.025] p-5 no-underline transition hover:border-white/15 hover:bg-white/[0.045]'
                  >
                    <p className='text-xs text-[#F0CB8A]/68'>
                      {recordTypeLabel[item.type]} ·{' '}
                      {item.dateText || '日期未确认'}
                    </p>
                    <h3 className='mt-3 text-lg font-semibold text-white'>
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  let records = []

  try {
    const [props, freshRecords] = await Promise.all([
      fetchGlobalAllData({ from: 'record-paths' }),
      fetchRecordsFromOfficialAPI()
    ])
    const allRecords =
      freshRecords.length > 0 ? freshRecords : props.allRecords || []
    records = allRecords
      .filter(r => Boolean(r?.slug))
      .map(r => ({ slug: r.slug }))
  } catch (error) {
    console.warn(
      '[RECORD-PATHS] Failed to fetch Notion Record paths:',
      error.message
    )
  }

  const paths = records.map(r => ({ params: { slug: r.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params, locale }) {
  const { slug } = params
  const from = 'record-detail'
  const props = await fetchGlobalAllData({ from, locale })
  const freshRecords = await fetchRecordsFromOfficialAPI()
  const allRecords =
    freshRecords.length > 0 ? freshRecords : props.allRecords || []

  const recordItem = getRecordBySlug(allRecords, slug)
  if (!recordItem) {
    return { notFound: true }
  }

  // Pull Notion page blocks so edits made in the Notion page body surface on
  // the site (NotionNext default editing model). Rendered via <NotionRenderer>
  // so all Notion block types are faithfully represented — same pipeline
  // [prefix] uses.
  let blockMap = null
  if (recordItem.id) {
    try {
      const rawBlockMap = await getPostBlocks(recordItem.id, from)
      if (rawBlockMap) {
        const adapted = adapterNotionBlockMap(rawBlockMap)
        blockMap = {
          ...adapted,
          block: formatNotionBlock(adapted.block)
        }
      }
    } catch (err) {
      console.warn(
        '[RECORD-DETAIL] fetchNotionPageBlocks failed:',
        recordItem.id,
        err.message
      )
    }
  }

  const fallbackExcerpt = extractLeadParagraph(blockMap, recordItem.id)
  const record = {
    ...recordItem,
    blockMap,
    excerpt: recordItem.excerpt || fallbackExcerpt
  }

  const allRecordItems = getAllRecords(allRecords)
  const relatedEventSlugs = new Set(recordItem.relatedEventSlugs || [])
  const relatedEvents = normalizeEventList(props.allEvents || []).filter(
    event => relatedEventSlugs.has(event.slug)
  )
  const moreRecords = allRecordItems
    .filter(item => item.slug !== recordItem.slug)
    .slice(0, 2)

  const pageTitle = `${record.title} - IGNAI`
  const pageDescription = record.excerpt || 'IGNAI 社区现场记录。'

  delete props.allPages
  delete props.allMembers
  delete props.allEvents
  delete props.allRecords
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
      record,
      moreRecords,
      relatedEvents,
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

export default RecordDetailPage
