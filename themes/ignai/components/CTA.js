/**
 * IGNAI CTA — "Join the fire" 行动号召区块
 * 复刻 v1 JoinSection：汇聚光线动画 + 会员权益 + CTA
 */
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

export const CTA = () => {
  const enable = CONFIG.IGNAI_CTA_ENABLE
  if (!enable) return null

  const benefits = CONFIG.IGNAI_CTA_BENEFITS || []

  return (
    <section id='join' className='relative z-10 overflow-hidden py-20 lg:py-[115px]'>
      {/* Converge rays 动画背景 */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <span className='converge-ray' style={{ '--ray-y': '20%', '--ray-rotate': '6deg', '--ray-delay': '0s' }} />
        <span className='converge-ray' style={{ '--ray-y': '42%', '--ray-rotate': '-3deg', '--ray-delay': '1.4s' }} />
        <span className='converge-ray' style={{ '--ray-y': '66%', '--ray-rotate': '4deg', '--ray-delay': '2.8s' }} />
      </div>

      <div className='container mx-auto relative z-10'>
        <div className='mx-auto max-w-[680px] text-center wow fadeInUp' data-wow-delay='.2s'>
          {/* 标题 */}
          <p className='ignai-section-eyebrow mb-4'>06 / Join</p>
          <h2 className='ignai-display-title mt-4'>
            <span className='block sm:whitespace-nowrap'>{CONFIG.IGNAI_CTA_TITLE}</span>
            <span className='block sm:whitespace-nowrap'>{CONFIG.IGNAI_CTA_TITLE_2}</span>
          </h2>
          <p className='ignai-section-body mt-6 max-w-[480px] mx-auto'>
            {CONFIG.IGNAI_CTA_DESCRIPTION}
          </p>

          {/* 权益列表 */}
          {benefits && benefits.length > 0 && (
            <div className='mt-8 grid gap-x-6 border-t border-white/10 sm:grid-cols-2 text-left max-w-[480px] mx-auto'>
              {benefits.map((benefit, index) => (
                <div key={index} className='flex min-h-12 items-center gap-3 border-t border-white/10 py-3 text-sm leading-6 text-white/72 first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0'>
                  <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[#ff9a3c]/10 text-[#f2c892]'>
                    <i className='fa-solid fa-check text-xs'></i>
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA 按钮 */}
          {CONFIG.IGNAI_CTA_BUTTON && (
            <div className='mt-10 flex flex-col gap-4 sm:flex-row justify-center'>
              <SmartLink
                href={CONFIG.IGNAI_CTA_BUTTON_URL || '/join'}
                className='ignai-cta-primary'>
                {CONFIG.IGNAI_CTA_BUTTON_TEXT || '加入社区'}
              </SmartLink>
              <SmartLink
                href='mailto:hello@ignai.community'
                className='ignai-cta-secondary'>
                联系合作
              </SmartLink>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
