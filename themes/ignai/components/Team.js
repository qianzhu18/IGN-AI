/**
 * IGNAI Team — 关于社区区块
 * 左侧品牌视觉 + 右侧说明文字 + 数值卡片
 */
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

export const Team = () => {
  return (
    <section id='about' className='overflow-hidden pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]'>
      <div className='container mx-auto wow fadeInUp' data-wow-delay='.2s'>
        <div className='flex flex-col md:flex-row -mx-4 justify-between'>

          {/* 左侧品牌卡片 */}
          <div className='mx-6 mb-6 max-w-96 ignai-card overflow-hidden p-0 border-0'>
            <div className='relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#0d1118] to-[#07080c] p-8 flex flex-col items-center justify-center min-h-[320px]'>
              <p className='text-6xl font-bold text-white italic tracking-tight'>IGNAI</p>
              <p className='mt-3 text-sm text-[#f0d48d]/72'>Ignite before AGI.</p>
              <div className='absolute bottom-[-60px] left-[-40px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,122,24,0.12)_0%,transparent_72%)] blur-2xl' />
              <div className='absolute top-[-40px] right-[-40px] h-[160px] w-[160px] rounded-full bg-[radial-gradient(circle,rgba(93,169,255,0.08)_0%,transparent_72%)] blur-2xl' />
            </div>
          </div>

          {/* 右侧说明文字 */}
          <div className='flex flex-col px-4 space-y-4 mx-auto justify-between max-w-[520px]'>
            <div>
              <span className='ignai-badge'>
                {CONFIG.IGNAI_ABOUT_TITLE}
              </span>
            </div>
            <h2 className='mb-3 text-xl md:text-3xl leading-[1.2] text-white font-bold'>
              {CONFIG.IGNAI_ABOUT_TEXT_1}
            </h2>
            <p className='text-base text-white/56 leading-relaxed'>
              {CONFIG.IGNAI_ABOUT_TEXT_2}
            </p>

            {/* 数值四宫格 */}
            <div className='grid grid-cols-2 grid-rows-2 pt-6 gap-4'>
              <KeyVal k={CONFIG.IGNAI_ABOUT_KEY_1} v={CONFIG.IGNAI_ABOUT_VAL_1} />
              <KeyVal k={CONFIG.IGNAI_ABOUT_KEY_2} v={CONFIG.IGNAI_ABOUT_VAL_2} />
              <KeyVal k={CONFIG.IGNAI_ABOUT_KEY_3} v={CONFIG.IGNAI_ABOUT_VAL_3} />
              <KeyVal k={CONFIG.IGNAI_ABOUT_KEY_4} v={CONFIG.IGNAI_ABOUT_VAL_4} />
            </div>

            <div className='mt-8 w-full flex justify-end py-2'>
              <SmartLink
                href={CONFIG.IGNAI_ABOUT_BUTTON_URL || '/join'}
                className='ignai-cta-secondary'>
                {CONFIG.IGNAI_ABOUT_BUTTON_TEXT || '了解更多'}
                <i className='pl-3 fa-solid fa-arrow-right text-sm'></i>
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 显示一组键值对
const KeyVal = ({ k, v }) => {
  if (!k) return null
  return (
    <div className='space-y-2'>
      <div className='text-white/56 text-sm'>{k}</div>
      <div className='text-white text-2xl font-semibold'>{v}</div>
    </div>
  )
}
