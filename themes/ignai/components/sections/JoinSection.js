import { motion } from 'framer-motion'
import Image from 'next/image'
import SmartLink from '@/components/SmartLink'
import { joinContent as joinContentFallback } from '@/src/content/community'
import { Reveal } from '../Reveal'

function resolveSection(notionConfig, sectionKey, fallback) {
  const key = `IGNAI_SECTION_${sectionKey}`
  return notionConfig?.[key] || fallback
}

export function JoinSection({ notionConfig }) {
  const joinContent = resolveSection(notionConfig, 'JOIN', joinContentFallback)
  return (
    <section id='join' className='ignai-home-section pb-8'>
      <div className='ignai-home-container'>
        <div className='relative overflow-hidden border-y border-white/10 py-10 sm:py-12 lg:py-16'>
          <div className='converge-field'>
            <span
              className='converge-ray'
              style={{
                '--ray-y': '20%',
                '--ray-rotate': '6deg',
                '--ray-delay': '0s'
              }}
            />
            <span
              className='converge-ray'
              style={{
                '--ray-y': '42%',
                '--ray-rotate': '-3deg',
                '--ray-delay': '1.4s'
              }}
            />
            <span
              className='converge-ray'
              style={{
                '--ray-y': '66%',
                '--ray-rotate': '4deg',
                '--ray-delay': '2.8s'
              }}
            />
          </div>

          <div className='relative grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-[72px]'>
            <Reveal>
              <p className='section-eyebrow'>Join IGNAI</p>
              <h2 className='display-title mt-6 max-w-[20ch]'>
                <span className='block sm:whitespace-nowrap'>
                  Join the fire.
                </span>
                <span className='block sm:whitespace-nowrap'>
                  Bring your signal.
                </span>
              </h2>
              <p className='section-body mt-6'>{joinContent.support}</p>

              <div className='mt-8 grid max-w-[520px] gap-x-6 border-y border-white/10 sm:grid-cols-2'>
                {joinContent.benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className='flex min-h-12 items-center gap-3 border-t border-white/10 py-3 text-sm leading-6 text-white/72 sm:[&:nth-child(-n+2)]:border-t-0'
                  >
                    <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[#ff9a3c]/10 text-[#f2c892]'>
                      {index + 1}
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
                <SmartLink href='/join' className='ignai-cta-primary'>
                  加入社区
                </SmartLink>
                <SmartLink href='/archive' className='ignai-cta-secondary'>
                  查看社区内容
                </SmartLink>
              </div>
            </Reveal>

            <Reveal className='relative overflow-hidden' delay={0.1}>
              <motion.div
                animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className='relative overflow-hidden rounded-lg border border-white/10 bg-[#06080d] shadow-[0_28px_80px_rgba(0,0,0,0.24)]'
              >
                <Image
                  src='/images/generated/collaboration-threads.png'
                  alt='Warm collaboration threads and blue signal lines'
                  width={1376}
                  height={768}
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='aspect-[1.45] w-full object-cover opacity-90'
                />
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.14)_0%,rgba(4,6,10,0.1)_30%,rgba(4,6,10,0.88)_100%)]' />
                <div className='absolute left-4 top-4 rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/72 px-3 py-1.5 text-[0.68rem] uppercase text-[#9aceff]'>
                  Signal threads
                </div>
                <div className='absolute bottom-0 left-0 right-0 p-5'>
                  <p className='max-w-[16ch] text-xl font-semibold leading-[1.35] text-white'>
                    把你的表达、行动和信号，
                    <br />
                    带进这团火里。
                  </p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
