/**
 * IGNAI Header — 品牌导航栏
 * 导航项优先读 Notion customMenu（Menu/SubMenu 类型），fallback 到 config.js 硬编码
 */
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'

function buildNavItems(customMenu, fallback) {
  if (!customMenu || customMenu.length === 0) return fallback
  return customMenu.map(item => ({
    label: item.title || item.name || '',
    href: item.slug || item.href || '#',
    subMenus: item.subMenus?.map(sub => ({
      label: sub.title || sub.name || '',
      href: sub.slug || sub.href || '#'
    })) || []
  }))
}

function DesktopNavItem({ item }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!item.subMenus?.length) {
    return (
      <SmartLink
        href={item.href}
        className='text-sm text-white/68 hover:text-white transition duration-200'>
        {item.label}
      </SmartLink>
    )
  }

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setOpen(v => !v)}
        className='flex items-center gap-1 text-sm text-white/68 hover:text-white transition duration-200'>
        {item.label}
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox='0 0 12 12' fill='none'>
          <path d='M2 4l4 4 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>
      {open && (
        <div className='absolute left-0 top-full mt-2 min-w-[160px] rounded-lg py-2 z-50'
          style={{ background: 'rgba(13,14,20,0.97)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {item.subMenus.map((sub, i) => (
            <SmartLink
              key={i}
              href={sub.href}
              onClick={() => setOpen(false)}
              className='block px-4 py-2 text-sm text-white/68 hover:text-white hover:bg-white/4 transition'>
              {sub.label}
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  )
}

export const Header = props => {
  const router = useRouter()
  const navItems = buildNavItems(props.customMenu, CONFIG.IGNAI_NAV_ITEMS || [])
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
                <DesktopNavItem key={item.label || index} item={item} />
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
                    {item.subMenus?.map((sub, si) => (
                      <SmartLink
                        key={si}
                        href={sub.href}
                        className='block px-10 py-2 text-sm text-white/50 hover:text-white hover:bg-white/4 transition'>
                        {sub.label}
                      </SmartLink>
                    ))}
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
