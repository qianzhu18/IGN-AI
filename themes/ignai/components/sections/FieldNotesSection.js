import Image from 'next/image'
import SmartLink from '@/components/SmartLink'
import { getFeaturedRecords } from '@/lib/records'
import { recordTypeLabel } from '@/lib/records'
import { Reveal } from '../Reveal'

export function FieldNotesSection({ records = [] }) {
  const displayItems = getFeaturedRecords(records, 3).map(record => ({
    ...record,
    href: `/records/${record.slug}`
  }))

  if (displayItems.length === 0) return null

  return (
    <section id='field-notes' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='section-eyebrow'>From the community</p>
            <h2 className='section-title mt-6 max-w-[13ch]'>
              我们一起做过的事，
              <br />
              留在这里。
            </h2>
            <p className='section-body mt-6'>
              从一场活动，到一次跨城见面，再到一个被推进的想法。这里讲的是已经真实发生的现场。
            </p>
          </div>
          <SmartLink
            href='/records'
            className='ignai-cta-secondary'
            data-analytics-event='click_view_records'
            data-analytics-label='home_records_all'
            data-analytics-prop-placement='home_records'
          >
            查看全部现场
          </SmartLink>
        </Reveal>

        <div className='mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {displayItems.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.08}>
              <SmartLink
                href={item.href}
                data-analytics-event='click_record_card'
                data-analytics-label={item.title}
                data-analytics-prop-placement='home_records'
                data-analytics-prop-type={item.type}
                className={`group ignai-unified-card ignai-record-card block overflow-hidden rounded-lg ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className='p-5 sm:p-6'>
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                      <p className='text-sm font-semibold text-white'>
                        IGNAI 社区现场
                      </p>
                      <p className='mt-1 text-xs text-white/66'>
                        {item.dateText}
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    </div>
                    <span className='rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70'>
                      {recordTypeLabel[item.type] || '现场故事'}
                    </span>
                  </div>

                  <h3 className='mt-6 text-[1.55rem] font-semibold leading-[1.28] text-white transition group-hover:text-[#d4ecff]'>
                    {item.title}
                  </h3>
                  <p className='mt-3 line-clamp-2 text-sm leading-7 text-white/72'>
                    {item.excerpt}
                  </p>
                </div>

                <div className='px-5 sm:px-6'>
                  <div className='relative aspect-[2.05] w-full overflow-hidden rounded-lg border border-white/8'>
                    <Image
                      src={item.cover}
                      alt=''
                      fill
                      sizes='(max-width: 1024px) 100vw, 50vw'
                      className='object-cover transition duration-500 group-hover:scale-[1.015]'
                    />
                  </div>
                </div>

                <div className='mt-5 border-t border-white/8 px-5 py-4 sm:px-6'>
                  <div className='flex flex-wrap gap-2'>
                    {(item.outcomes?.length ? item.outcomes : item.tags).map(tag => (
                      <span
                        key={tag}
                        className='rounded-full border border-[#7cc8ff]/12 bg-[#08131e]/80 px-3 py-1.5 text-xs text-[#c7e6ff]'
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
