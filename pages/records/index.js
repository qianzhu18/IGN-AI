import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays, MapPin } from 'lucide-react'
import {
  fetchGlobalAllData,
  fetchRecordsFromOfficialAPI
} from '@/lib/db/SiteDataApi'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { getAllRecords, recordTypeLabel } from '@/lib/records'

const RecordsIndexPage = ({ records: recordItems, pageTitle, pageDescription }) => {
  const featuredRecord = recordItems[0]
  const secondaryRecords = recordItems.slice(1)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
      </Head>
      <main className='ignai-themed-page min-h-screen bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <section className='mx-auto max-w-6xl px-6 py-20 lg:py-24'>
          <div className='grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end'>
            <div>
              <p className='mb-5 text-xs font-medium uppercase tracking-wider text-[#F0CB8A]/72'>
                Community stories
              </p>
              <h1 className='max-w-[10ch] text-4xl font-semibold leading-tight sm:text-5xl'>
                我们一起
                <br />
                做过的事。
              </h1>
            </div>
            <p className='max-w-2xl text-base leading-8 text-white/56'>
              按已经确认的发生时间排列。从极客松到跨城见面、项目分享与合作活动，这里只写材料能够证明的真实现场。
            </p>
          </div>

          {featuredRecord && (
            <Link
              href={`/records/${featuredRecord.slug}`}
              data-analytics-event='click_record_card'
              data-analytics-label={featuredRecord.title}
              data-analytics-prop-placement='records_index_featured'
              data-analytics-prop-type={featuredRecord.type}
              className='group ignai-themed-card mt-14 grid overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] no-underline transition hover:border-[#7cc8ff]/24 hover:bg-white/[0.055] lg:grid-cols-[1.1fr_0.9fr]'
            >
              <div className='p-6 sm:p-8 lg:p-10'>
                <div className='flex flex-wrap items-center gap-3 text-sm text-white/48'>
                  <span className='rounded-full border border-[#7cc8ff]/16 bg-[#071521]/70 px-3 py-1.5 text-xs text-[#c7e6ff]'>
                    {recordTypeLabel[featuredRecord.type]}
                  </span>
                  <span className='inline-flex items-center gap-2'>
                    <CalendarDays className='h-4 w-4 text-[#F0CB8A]/72' />
                    {featuredRecord.dateText || '日期未确认'}
                  </span>
                  {featuredRecord.location && (
                    <span className='inline-flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-[#9aceff]/72' />
                      {featuredRecord.location}
                    </span>
                  )}
                </div>
                <h2 className='mt-8 text-3xl font-semibold leading-tight text-white transition group-hover:text-[#d4ecff]'>
                  {featuredRecord.title}
                </h2>
                <p className='mt-5 max-w-2xl text-sm leading-7 text-white/58'>
                  {featuredRecord.excerpt}
                </p>
                <div className='mt-8 flex flex-wrap gap-2'>
                  {(featuredRecord.outcomes || featuredRecord.tags).map(item => (
                    <span
                      key={item}
                      className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58'
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <span className='mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#ffd09a]'>
                  走进现场
                  <ArrowRight className='h-4 w-4 transition group-hover:translate-x-1' />
                </span>
              </div>
              <div className='relative min-h-[260px] overflow-hidden border-t border-white/8 lg:border-l lg:border-t-0'>
                {featuredRecord.cover && (
                  <img
                    src={featuredRecord.cover}
                    alt=''
                    className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]'
                  />
                )}
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.02)_0%,rgba(5,7,12,0.58)_100%)]' />
              </div>
            </Link>
          )}

          <div className='mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {secondaryRecords.map(record => (
              <Link
                key={record.slug}
                href={`/records/${record.slug}`}
                data-analytics-event='click_record_card'
                data-analytics-label={record.title}
                data-analytics-prop-placement='records_index'
                data-analytics-prop-type={record.type}
                className='group ignai-themed-card rounded-lg border border-white/[0.07] bg-white/[0.025] p-6 no-underline transition hover:border-white/15 hover:bg-white/[0.045]'
              >
                <div className='flex items-center justify-between gap-4'>
                  <span className='inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#F0CB8A]/68'>
                    <BookOpen className='h-4 w-4' />
                    {recordTypeLabel[record.type]}
                  </span>
                  <span className='text-xs text-white/35'>
                    {record.dateText || '日期未确认'}
                  </span>
                </div>
                <h3 className='mt-5 text-xl font-semibold text-white transition group-hover:text-[#d4ecff]'>
                  {record.title}
                </h3>
                <p className='mt-3 line-clamp-2 text-sm leading-7 text-white/54'>
                  {record.excerpt}
                </p>
                <div className='mt-6 flex flex-wrap gap-2'>
                  {record.tags.map(tag => (
                    <span
                      key={tag}
                      className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/48'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const from = 'records-index'
  const props = await fetchGlobalAllData({ from, locale })
  const freshRecords = await fetchRecordsFromOfficialAPI()
  const allRecords = freshRecords.length > 0 ? freshRecords : props.allRecords || []
  const records = getAllRecords(allRecords)

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
      records,
      pageTitle: 'IGNAI - 社区现场',
      pageDescription: 'IGNAI 在长沙与不同城市真实发生过的活动、见面和项目故事。'
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

export default RecordsIndexPage
