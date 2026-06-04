/**
 * IGNAI Header — 品牌导航栏
 * 导航项优先读 Notion customMenu（Menu/SubMenu 类型），fallback 到 config.js 硬编码
 */
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'

const HIDDEN_SLUGS = ['/en']

// NotionNext 模板默认菜单标题 — 这些不是 IGNAI 的真实导航
const TEMPLATE_TITLES = new Set([
  '什么是洋来', 'What', 'what',
  '创始人', 'Founder',
  '关于', 'About',
  '标签', 'Tags', '分类', 'Categories',
  'home', 'Home', '首页',
])

function buildNavItems(customMenu, fallback) {
  if (!customMenu || customMenu.length === 0) return fallback
  const filtered = customMenu
    .filter(item => !HIDDEN_SLUGS.includes(item.slug || item.href))
    .filter(item => !TEMPLATE_TITLES.has((item.title || item.name || '').trim()))
    .map(item => ({
      label: item.title || item.name || '',
      href: item.slug || item.href || '#',
      subMenus: item.subMenus?.map(sub => ({
        label: sub.title || sub.name || '',
        href: sub.slug || sub.href || '#'
      })) || []
    }))
  // 如果 Notion Menu 过滤后为空，使用 fallback
  return filtered.length > 0 ? filtered : fallback
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
        type='button'
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
  const fallbackNavItems = CONFIG.IGNAI_NAV_ITEMS || []
  const useNotionMenu = siteConfig(
    'IGNAI_NAV_USE_NOTION_MENU',
    CONFIG.IGNAI_NAV_USE_NOTION_MENU
  )
  const navItems = useNotionMenu
    ? buildNavItems(props.customMenu, fallbackNavItems)
    : fallbackNavItems
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(false)
  }, [router])

  useEffect(() => {
    const criticalPaths = [
      ...navItems.map(item => item.href).filter(Boolean),
      '/join'
    ]

    criticalPaths
      .filter(href => typeof href === 'string' && href.startsWith('/'))
      .forEach(href => {
        router.prefetch(href).catch(() => {})
      })
  }, [navItems, router])

  // 点击外部关闭移动端菜单
  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      // 点击菜单按钮本身不关闭（它自己处理 toggle）
      if (e.target.closest('button[aria-label]')) return
      if (e.target.closest('nav.ignai-mobile-menu')) return
      setShowMenu(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showMenu])

  return (
    <>
      <div className='ud-header left-0 top-0 z-40 flex w-full items-center'>
        <div className='container'>
          <div className='relative -mx-4 flex items-center justify-between ignai-header-shell'>

            {/* Logo */}
            <div className='max-w-full px-4'>
              <div
                className='navbar-logo ignai-header-brand-lockup flex w-full cursor-pointer items-center gap-3 py-4 sm:py-5'
                onClick={() => {
                  void router.push('/')
                }}>
                <span aria-hidden='true' className='ignai-header-mark-frame'>
                  <span className='ignai-header-flame-shell'>
                    <Image
                      src='/brand/ignai-logo-transparent.png'
                      alt=''
                      width={148}
                      height={30}
                      className='ignai-header-flame-image'
                    />
                  </span>
                </span>
                <div className='flex min-w-0 flex-col justify-center'>
                  <span className='ignai-header-wordmark'>
                    IGNAI
                  </span>
                  <span className='ignai-header-subtitle hidden min-[360px]:block'>
                    Ignite before AGI
                  </span>
                </div>
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
                style={{
                  border: '1px solid rgba(188, 124, 76, 0.34)',
                  background: 'linear-gradient(135deg, rgba(126,79,49,0.94) 0%, rgba(168,104,64,0.92) 54%, rgba(110,70,45,0.95) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,240,224,0.08), 0 12px 34px rgba(69,36,16,0.22)'
                }}>
                加入社区
              </SmartLink>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              type='button'
              onClick={() => setShowMenu(!showMenu)}
              className='ignai-mobile-toggle absolute right-4 top-1/2 -translate-y-1/2 rounded-2xl p-3 md:hidden'
              style={{
                border: '1px solid rgba(171, 111, 71, 0.34)',
                background: 'linear-gradient(180deg, rgba(30,19,15,0.82) 0%, rgba(13,13,20,0.92) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 38px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,122,24,0.05)'
              }}
              aria-label={showMenu ? '关闭菜单' : '打开菜单'}
              aria-expanded={showMenu}>
              <svg
                aria-hidden='true'
                width='22'
                height='22'
                viewBox='0 0 22 22'
                fill='none'
                style={{ display: 'block' }}>
                {showMenu ? (
                  <>
                    <path
                      d='M6 6L16 16'
                      stroke='rgba(255, 239, 222, 0.94)'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                    <path
                      d='M16 6L6 16'
                      stroke='rgba(255, 239, 222, 0.94)'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                  </>
                ) : (
                  <>
                    <path
                      d='M4.5 6.5H17.5'
                      stroke='rgba(255, 236, 214, 0.94)'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                    <path
                      d='M7 11H17.5'
                      stroke='rgba(255, 236, 214, 0.88)'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                    <path
                      d='M10 15.5H17.5'
                      stroke='rgba(255, 236, 214, 0.82)'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                  </>
                )}
              </svg>
            </button>

            {showMenu && (
              <button
                type='button'
                aria-hidden='true'
                tabIndex={-1}
                className='ignai-mobile-backdrop md:hidden'
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 39,
                  border: 0,
                  background: 'linear-gradient(180deg, rgba(7,8,12,0.16) 0%, rgba(7,8,12,0.42) 100%)'
                }}
                onClick={() => setShowMenu(false)}
              />
            )}

            {/* 移动端菜单 */}
            <nav
              className={`absolute right-4 top-full z-50 w-full max-w-[calc(100vw-32px)] rounded-[1.5rem] py-2 md:hidden ignai-mobile-menu ${showMenu ? 'ignai-mobile-menu--visible' : 'ignai-mobile-menu--hidden'}`}
              aria-hidden={!showMenu}
              style={{
                background: 'rgba(13,14,20,0.97)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                opacity: showMenu ? 1 : 0,
                visibility: showMenu ? 'visible' : 'hidden',
                pointerEvents: showMenu ? 'auto' : 'none',
                transform: showMenu ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)'
              }}>
              <div className='ignai-mobile-menu-header px-5 pb-3 pt-4'>
                <p className='ignai-mobile-menu-kicker'>CHANGSHA AI COMMUNITY</p>
                <div className='mt-3 flex items-center gap-3'>
                  <span className='ignai-mobile-menu-title'>IGNAI</span>
                  <span className='ignai-mobile-menu-title-glow'>Ignite before AGI.</span>
                </div>
                <p className='mt-3 text-sm leading-6 text-white/64'>
                  连接本地、面向全球，把真实行动者组织在一起。
                </p>
              </div>

              <ul className='ignai-mobile-menu-list py-1'>
                {navItems.map((item, index) => (
                  <li key={item.label || index}>
                    <SmartLink
                      href={item.href}
                      className='ignai-mobile-menu-link block rounded-xl px-5 py-3 text-sm text-white/78 transition-colors'>
                      {item.label}
                    </SmartLink>
                    {item.subMenus?.map((sub, si) => (
                      <SmartLink
                        key={si}
                        href={sub.href}
                        className='ignai-mobile-menu-sub-link block rounded-xl px-8 py-2 text-[13px] text-white/46 transition-colors'>
                        {sub.label}
                      </SmartLink>
                    ))}
                  </li>
                ))}
                <li className='ignai-mobile-menu-divider mx-5 my-2 border-t border-white/[0.06]' />
                <li>
                  <SmartLink
                    href='/join'
                    className='ignai-mobile-menu-cta mx-5 block rounded-xl px-5 py-3 text-sm font-medium text-white transition-colors'
                    style={{
                      border: '1px solid rgba(188, 124, 76, 0.34)',
                      background: 'linear-gradient(135deg, rgba(126,79,49,0.96) 0%, rgba(168,104,64,0.94) 54%, rgba(110,70,45,0.96) 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,240,224,0.08), 0 12px 34px rgba(69,36,16,0.22)'
                    }}>
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
