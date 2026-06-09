import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays, MapPin } from 'lucide-react'
import { records, recordTypeLabel } from '@/src/content/records'
import { mergeFixtureRecords } from '@/lib/dev/contentFixtures'

const RecordsIndexPage = ({ records: recordItems, pageTitle, pageDescription }) => {
  const featuredRecord = recordItems[0]
  const secondaryRecords = recordItems.slice(1)
  const recordCounts = recordItems.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1
    return acc
  }, {})

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
                Field Notes
              </p>
              <h1 className='max-w-[10ch] text-4xl font-semibold leading-tight sm:text-5xl'>
                社区现场，
                <br />
                沉淀成记录。
              </h1>
            </div>
            <p className='max-w-2xl text-base leading-8 text-white/56'>
              这里收集活动复盘、项目推进、成员故事和工具清单。活动负责发生，
              记录负责让经验继续流动。
            </p>
          </div>

          <div className='mt-10 grid gap-3 sm:grid-cols-4'>
            {Object.entries(recordTypeLabel).map(([type, label]) => (
              <div key={type} className='rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3'>
                <div className='text-2xl font-semibold text-white'>{recordCounts[type] || 0}</div>
                <div className='mt-1 text-xs text-white/42'>{label}</div>
              </div>
            ))}
          </div>

          {featuredRecord && (
            <Link
              href={`/records/${featuredRecord.slug}`}
              className='group ignai-themed-card mt-14 grid overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] no-underline transition hover:border-[#7cc8ff]/24 hover:bg-white/[0.055] lg:grid-cols-[1.1fr_0.9fr]'
            >
              <div className='p-6 sm:p-8 lg:p-10'>
                <div className='flex flex-wrap items-center gap-3 text-sm text-white/48'>
                  <span className='rounded-full border border-[#7cc8ff]/16 bg-[#071521]/70 px-3 py-1.5 text-xs text-[#c7e6ff]'>
                    {recordTypeLabel[featuredRecord.type]}
                  </span>
                  <span className='inline-flex items-center gap-2'>
                    <CalendarDays className='h-4 w-4 text-[#F0CB8A]/72' />
                    {featuredRecord.dateText}
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
                  阅读记录
                  <ArrowRight className='h-4 w-4 transition group-hover:translate-x-1' />
                </span>
              </div>
              <div className='relative min-h-[260px] overflow-hidden border-t border-white/8 lg:border-l lg:border-t-0'>
                <img
                  src={featuredRecord.cover}
                  alt=''
                  className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]'
                />
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.02)_0%,rgba(5,7,12,0.58)_100%)]' />
              </div>
            </Link>
          )}

          <div className='mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {secondaryRecords.map(record => (
              <Link
                key={record.slug}
                href={`/records/${record.slug}`}
                className='group ignai-themed-card rounded-lg border border-white/[0.07] bg-white/[0.025] p-6 no-underline transition hover:border-white/15 hover:bg-white/[0.045]'
              >
                <div className='flex items-center justify-between gap-4'>
                  <span className='inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#F0CB8A]/68'>
                    <BookOpen className='h-4 w-4' />
                    {recordTypeLabel[record.type]}
                  </span>
                  <span className='text-xs text-white/35'>{record.dateText}</span>
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

export function getStaticProps() {
  const recordItems = mergeFixtureRecords(records)
  return {
    props: {
      records: recordItems,
      pageTitle: 'IGNAI - 社区记录',
      pageDescription: 'IGNAI 社区记录、活动复盘、项目记录与 AI 工作流工具清单。'
    }
  }
}

export default RecordsIndexPage
