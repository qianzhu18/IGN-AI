/**
 * IGNAI Hero — 品牌首屏
 * 复刻 v1 HeroSection，基于 proxio Hero 骨架爆改
 */
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

export const Hero = props => {
  const config = props?.NOTION_CONFIG || CONFIG

  // 直接从 CONFIG 读取所有值，不依赖 Notion
  const eyebrow = CONFIG.IGNAI_HERO_EYEBROW
  const name = CONFIG.IGNAI_HERO_NAME
  const slogan = CONFIG.IGNAI_HERO_SLOGAN
  const summary = CONFIG.IGNAI_HERO_SUMMARY
  const description = CONFIG.IGNAI_HERO_DESCRIPTION
  const cta1 = CONFIG.IGNAI_HERO_CTA_1 || '加入社区'
  const cta1Url = CONFIG.IGNAI_HERO_CTA_1_URL || '/join'
  const cta2 = CONFIG.IGNAI_HERO_CTA_2 || '查看近期活动'
  const cta2Url = CONFIG.IGNAI_HERO_CTA_2_URL || '#blog'
  const signals = CONFIG.IGNAI_HERO_SIGNALS || []

  return (
    <>
      <div id='home' className='ignai-hero flex items-center min-h-screen'>
        {/* Hero 内容 — 纯 CSS 背景，不用 Notion 封面图 */}
        <div className='relative z-10 container mx-auto'>
          <div className='max-w-[1200px] mx-auto pt-24 pb-16'>

            {/* Eyebrow 标签 */}
            <div className='ignai-eyebrow mb-8'>
              <i className='fa-solid fa-bolt text-xs' />
              {eyebrow}
            </div>

            {/* 品牌名 */}
            <p className='ignai-section-eyebrow mt-2'>
              {name}
            </p>

            {/* 主标语 */}
            <h1 className='ignai-display-title mt-4'>
              {slogan}
            </h1>

            {/* 副标题 */}
            <p className='ignai-section-lead mt-7 max-w-[32ch]'>
              {summary}
            </p>
            <p className='ignai-section-body mt-3 max-w-[40ch]'>
              {description}
            </p>

            {/* CTA 按钮 */}
            <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
              <SmartLink
                href={cta1Url}
                className='ignai-cta-primary'>
                {cta1}
              </SmartLink>
              <SmartLink
                href={cta2Url}
                className='ignai-cta-secondary'>
                {cta2}
              </SmartLink>
            </div>

            {/* Signal 卡片 */}
            {signals && signals.length > 0 && (
              <div className='ignai-signal-grid mt-12 max-w-3xl'>
                {signals.map((signal, index) => (
                  <div key={signal.title || index}>
                    <p className={`text-[0.7rem] font-medium uppercase ${index === 1 ? 'text-[#9aceff]' : 'text-[#f0c78e]/84'}`}>
                      {signal.eyebrow}
                    </p>
                    <h3 className='mt-3 text-base font-semibold leading-[1.32] text-white'>
                      {signal.title}
                    </h3>
                    <p className='mt-2 text-sm leading-6 text-white/64'>
                      {signal.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部渐变过渡 */}
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#07080c] z-20 pointer-events-none' />
      </div>
    </>
  )
}
