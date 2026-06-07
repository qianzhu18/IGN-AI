import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, MapPin } from 'lucide-react'
import { records, recordTypeLabel } from '@/src/content/records'

const RecordDetailPage = ({ record, moreRecords, pageTitle, pageDescription }) => {
  if (!record) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#07080C] text-white'>
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
      <main className='min-h-screen bg-[#07080C] text-white'>
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
              {record.dateText}
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

          {record.content?.length > 0 && (
            <div className='mt-12 space-y-10'>
              {record.content.map((block, index) => (
                <section key={`${block.heading}-${index}`}>
                  <h2 className='text-2xl font-semibold text-white'>{block.heading}</h2>
                  <p className='mt-4 text-base leading-8 text-white/56'>{block.body}</p>
                </section>
              ))}
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
                      {recordTypeLabel[item.type]} · {item.dateText}
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

export function getStaticPaths() {
  return {
    paths: records.map(record => ({ params: { slug: record.slug } })),
    fallback: false
  }
}

export function getStaticProps({ params }) {
  const record = records.find(item => item.slug === params.slug) || null

  if (!record) {
    return { notFound: true }
  }

  return {
    props: {
      record,
      moreRecords: records.filter(item => item.slug !== record.slug).slice(0, 2),
      pageTitle: `${record.title} - IGNAI`,
      pageDescription: record.excerpt
    }
  }
}

export default RecordDetailPage
