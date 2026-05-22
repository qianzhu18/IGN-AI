/**
 * IGNAI Features — "What is IGNAI" 区块
 * 四宫格角色卡片：Learners / Builders / Storytellers / Connectors
 */
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

export const Features = () => {
  const cards = CONFIG.IGNAI_FEATURE_CARDS || []

  return (
    <section id='feature' className='py-20 lg:py-[120px]'>
      <div className='container'>
        {/* 区块标题 */}
        <div className='wow fadeInUp' data-wow-delay='.2s'>
          <div className='mx-auto mb-12 max-w-[600px]'>
            <span className='ignai-badge'>
              {CONFIG.IGNAI_FEATURE_TITLE}
            </span>
            <h2 className='my-5 text-3xl font-bold text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
              {CONFIG.IGNAI_FEATURE_TEXT_1}
            </h2>
            <p className='text-base text-white/56'>
              {CONFIG.IGNAI_FEATURE_TEXT_2}
            </p>
          </div>
        </div>

        {/* 角色卡片 */}
        {cards && cards.length > 0 && (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {cards.map((card, index) => (
              <div key={card.title || index} className='ignai-card wow fadeInUp' data-wow-delay={`.${index + 1}s`}>
                <div className='flex flex-col space-y-3'>
                  <div className='flex items-center gap-3'>
                    <div className='flex w-10 h-10 items-center justify-center rounded-lg border border-[#ffb879]/16 bg-[#ff9a3c]/8 text-[#f2c892]'>
                      <i className={card.icon || 'fa-solid fa-star'}></i>
                    </div>
                    <span className='text-xs font-medium uppercase text-[#f0c78e]/72 tracking-wider'>
                      {card.eyebrow}
                    </span>
                  </div>
                  <h4 className='text-lg font-bold text-white'>
                    {card.title}
                  </h4>
                  <p className='text-sm text-white/56 leading-relaxed'>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部按钮 */}
        <div className='mt-8 w-full flex justify-center items-center'>
          <SmartLink
            href={CONFIG.IGNAI_FEATURE_BUTTON_URL || '#about'}
            className='ignai-cta-secondary'>
            {CONFIG.IGNAI_FEATURE_BUTTON_TEXT || '了解更多'}
            <i className='pl-3 fa-solid fa-arrow-right text-sm'></i>
          </SmartLink>
        </div>
      </div>
    </section>
  )
}
