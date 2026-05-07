/**
 * IGNAI Header — 品牌导航栏
 * 暗色毛玻璃风格，IGNAI 品牌 Logo + 导航
 */
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

export const Header = props => {
  const router = useRouter()
  const navItems = CONFIG.IGNAI_NAV_ITEMS || []

  // 移动端菜单状态
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(false)
  }, [router])

  return (
    <>
      <div className='ud-header left-0 top-0 z-40 flex w-full items-center'>
        <div className='container'>
          <div className='relative -mx-4 flex items-center justify-between ignai-header-shell'>

            {/* Logo */}
            <div className='max-w-full px-4'>
              <div className='navbar-logo flex items-center w-full py-5 cursor-pointer gap-3'>
                <img
                  src='/brand/ignai-logo-transparent.png'
                  alt='IGNAI'
                  className='ignai-header-logo'
                  onClick={() => router.push('/')}
                />
                <span
                  onClick={() => router.push('/')}
                  className='text-white/46 text-xs sm:text-sm mt-0.5 hidden min-[440px]:inline'>
                  Ignite before AGI
                </span>
              </div>
            </div>

            {/* 桌面端导航 */}
            <div className='hidden md:flex items-center gap-6'>
              {navItems.map((item, index) => (
                <SmartLink
                  key={item.label || index}
                  href={item.href}
                  className='text-sm text-white/68 hover:text-white transition duration-200'>
                  {item.label}
                </SmartLink>
              ))}
              <SmartLink
                href='/join'
                className='ml-4 inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium text-white transition duration-200'
                style={{ background: 'linear-gradient(135deg, rgba(255,122,24,0.9), rgba(255,154,60,0.85))' }}>
                加入社区
              </SmartLink>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 md:hidden ${showMenu ? 'navbarTogglerActive' : ''}`}>
              <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
              <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
              <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
            </button>

            {/* 移动端菜单 */}
            <nav className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg py-5 md:hidden ${showMenu ? 'block' : 'hidden'}`}
              style={{ background: 'rgba(13,14,20,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ul className='block'>
                {navItems.map((item, index) => (
                  <li key={item.label || index}>
                    <SmartLink
                      href={item.href}
                      className='block px-6 py-3 text-sm text-white/72 hover:text-white hover:bg-white/4 transition'>
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
                <li>
                  <SmartLink
                    href='/join'
                    className='block px-6 py-3 text-sm font-medium text-[#FF7A18] hover:bg-white/4 transition'>
                    加入社区
                  </SmartLink>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </>
  )
}
