import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const Footer = () => {
  const links = CONFIG.IGNAI_FOOTER_LINKS || []
  const slogan = CONFIG.IGNAI_FOOTER_SLOGAN || 'Ignite before AGI.'
  const subtitle = CONFIG.IGNAI_FOOTER_SUBTITLE || ''
  const location = CONFIG.IGNAI_FOOTER_LOCATION || ''

  return (
    <footer className='relative z-10 border-t border-white/[0.06] bg-[#07080C]'>
      <div className='mx-auto max-w-[1200px] px-5 sm:px-8 py-16 sm:py-20'>
        <div className='flex flex-col lg:flex-row justify-between gap-12 lg:gap-8'>

          {/* 左侧品牌 */}
          <div className='max-w-xs'>
            <p className='text-lg font-semibold text-white'>IGNAI</p>
            {subtitle && (
              <p className='mt-1 text-xs text-neutral-500'>{subtitle}</p>
            )}
            <p className='mt-4 text-sm text-neutral-400 italic'>&ldquo;{slogan}&rdquo;</p>
            {location && (
              <p className='mt-3 text-xs text-neutral-600'>{location}</p>
            )}
          </div>

          {/* 右侧链接 */}
          <div className='flex flex-wrap gap-x-16 gap-y-8'>
            {links.map(group => (
              <div key={group.name}>
                <p className='text-xs font-medium uppercase tracking-wider text-neutral-500 mb-4'>
                  {group.name}
                </p>
                <ul className='space-y-2.5'>
                  {group.menus.map(item => (
                    <li key={item.href || item.title}>
                      <SmartLink
                        href={item.href}
                        className='text-sm text-neutral-400 hover:text-white transition-colors duration-200 no-underline'
                      >
                        {item.title}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className='mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-2'>
          <p className='text-xs text-neutral-600'>
            &copy; {new Date().getFullYear()} IGNAI Community
          </p>
          <p className='text-xs text-neutral-700'>
            Built with NotionNext
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
