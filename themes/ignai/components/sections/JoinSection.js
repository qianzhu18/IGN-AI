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
              <div className='relative overflow-hidden rounded-lg border border-white/10 bg-[#06080d] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-6'>
                <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,154,60,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(122,200,255,0.12),transparent_28%)]' />
                <div className='relative z-10 grid gap-5 sm:grid-cols-[0.9fr_1.1fr] sm:items-center'>
                  <div>
                    <p className='section-eyebrow'>Wechat contact</p>
                    <h3 className='mt-4 text-2xl font-semibold leading-[1.18] text-white sm:text-3xl'>
                      直接加千逐，
                      <br />
                      先建立真实连接。
                    </h3>
                    <p className='mt-4 text-sm leading-7 text-white/60'>
                      扫码添加微信，简单说下你是谁、在做什么、想和 IGNAI 交流什么。
                    </p>
                  </div>

                  <div className='rounded-[24px] border border-white/10 bg-[#f7f7f4] p-3 shadow-[0_22px_56px_rgba(0,0,0,0.24)] sm:p-4'>
                    <Image
                      src='/contact/qianzhu-wechat-qr.jpg'
                      alt='扫码添加千逐微信，联系 IGNAI 社区'
                      width={950}
                      height={1295}
                      sizes='(max-width: 640px) 78vw, 320px'
                      className='h-auto w-full rounded-[18px]'
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
