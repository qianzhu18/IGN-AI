/**
 * IGNAI Header — 品牌导航栏
 * 导航项优先读 Notion customMenu（Menu/SubMenu 类型），fallback 到 config.js 硬编码
 */
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'

const HIDDEN_SLUGS = ['/en']

// NotionNext 模板默认菜单标题 — 这些不是 IGNAI 的真实导航
const TEMPLATE_TITLES = new Set([
  '什么是洋来',
  'What',
  'what',
  '创始人',
  'Founder',
  '关于',
  'About',
  '标签',
  'Tags',
  '分类',
  'Categories',
  'home',
  'Home',
  '首页'
])

function buildNavItems(customMenu, fallback) {
  if (!customMenu || customMenu.length === 0) return fallback
  const filtered = customMenu
    .filter(item => !HIDDEN_SLUGS.includes(item.slug || item.href))
    .filter(
      item => !TEMPLATE_TITLES.has((item.title || item.name || '').trim())
    )
    .map(item => ({
      label: item.title || item.name || '',
      href: item.slug || item.href || '#',
      subMenus:
        item.subMenus?.map(sub => ({
          label: sub.title || sub.name || '',
          href: sub.slug || sub.href || '#'
        })) || []
    }))
  // 如果 Notion Menu 过滤后为空，使用 fallback
  return filtered.length > 0 ? filtered : fallback
}

function buildConfiguredNavItems(sectionConfig) {
  const items = sectionConfig?.items
  if (!Array.isArray(items)) return []

  return items
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const label = typeof item.label === 'string' ? item.label.trim() : ''
      const href = typeof item.href === 'string' ? item.href.trim() : ''
      if (!label || !href) return null
      const subMenus = Array.isArray(item.subMenus)
        ? item.subMenus
            .map(sub => {
              const subLabel =
                typeof sub?.label === 'string' ? sub.label.trim() : ''
              const subHref =
                typeof sub?.href === 'string' ? sub.href.trim() : ''
              return subLabel && subHref
                ? { label: subLabel, href: subHref }
                : null
            })
            .filter(Boolean)
        : []
      return { label, href, subMenus }
    })
    .filter(Boolean)
}

function DesktopNavItem({ item, onIntent }) {
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
        prefetch={false}
        onMouseEnter={() => onIntent(item.href)}
        onTouchStart={() => onIntent(item.href)}
        className='ignai-nav-link text-sm transition duration-200'
      >
        {item.label}
      </SmartLink>
    )
  }

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen(v => !v)}
        className='ignai-nav-link flex items-center gap-1 text-sm transition duration-200'
      >
        {item.label}
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox='0 0 12 12'
          fill='none'
        >
          <path
            d='M2 4l4 4 4-4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {open && (
        <div className='ignai-nav-dropdown absolute left-0 top-full z-50 mt-2 min-w-[160px] rounded-lg py-2'>
          {item.subMenus.map((sub, i) => (
            <SmartLink
              key={i}
              href={sub.href}
              prefetch={false}
              onMouseEnter={() => onIntent(sub.href)}
              onTouchStart={() => onIntent(sub.href)}
              onClick={() => setOpen(false)}
              className='ignai-nav-dropdown-link block px-4 py-2 text-sm transition'
            >
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
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const fallbackNavItems = CONFIG.IGNAI_NAV_ITEMS || []
  const useNotionMenu = siteConfig(
    'IGNAI_NAV_USE_NOTION_MENU',
    CONFIG.IGNAI_NAV_USE_NOTION_MENU
  )
  const notionNavItems = buildConfiguredNavItems(
    props?.NOTION_CONFIG?.IGNAI_SECTION_NAVIGATION
  )
  const navItems =
    notionNavItems.length > 0
      ? notionNavItems
      : useNotionMenu
        ? buildNavItems(props.customMenu, fallbackNavItems)
        : fallbackNavItems
  const [showMenu, setShowMenu] = useState(false)
  const [hideOnScroll, setHideOnScroll] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setShowMenu(false)
    setHideOnScroll(false)
  }, [router.asPath])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastY = window.scrollY
    let frame = 0

    const updateHeader = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      setIsScrolled(currentY > 8)

      if (showMenu || currentY < 84) {
        setHideOnScroll(false)
      } else if (delta > 8 && currentY > 128) {
        setHideOnScroll(true)
      } else if (delta < -8) {
        setHideOnScroll(false)
      }

      lastY = currentY
      frame = 0
    }

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateHeader)
    }

    updateHeader()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [showMenu])

  const prefetchOnIntent = href => {
    if (typeof href !== 'string' || !href.startsWith('/')) return
    router.prefetch(href).catch(() => {})
  }

  // 点击外部关闭移动端菜单
  useEffect(() => {
    if (!showMenu) return
    const handler = e => {
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
      <div
        className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
          hideOnScroll ? 'ignai-header--hidden' : ''
        } ${isScrolled ? 'ignai-header--scrolled' : ''} ${
          showMenu ? 'ignai-header--menu-open' : ''
        }`}
      >
        <div className='container'>
          <div className='relative -mx-4 flex items-center justify-between ignai-header-shell'>
            {/* Logo */}
            <div className='max-w-full px-4'>
              <div
                className='navbar-logo ignai-header-brand-lockup flex w-full cursor-pointer items-center gap-3 py-4 sm:py-5'
                onClick={() => {
                  void router.push('/')
                }}
              >
                <span aria-hidden='true' className='ignai-header-logo-frame'>
                  <Image
                    src='/brand/ignai/torch-icon-transparent.png'
                    alt=''
                    width={25}
                    height={96}
                    priority
                    className='ignai-header-logo-image'
                  />
                </span>
                <div className='flex min-w-0 flex-col justify-center'>
                  <span className='ignai-header-wordmark'>IGNAI</span>
                  <span className='ignai-header-subtitle hidden min-[360px]:block'>
                    Ignite before AGI
                  </span>
                </div>
              </div>
            </div>

            {/* 桌面端导航 */}
            <div className='hidden md:flex items-center gap-6'>
              {navItems.map((item, index) => (
                <DesktopNavItem
                  key={item.label || index}
                  item={item}
                  onIntent={prefetchOnIntent}
                />
              ))}
              <button
                type='button'
                onClick={toggleDarkMode}
                className='ignai-theme-toggle'
                aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
                aria-pressed={isDarkMode}
                title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
              >
                {isDarkMode ? (
                  <Sun className='h-4 w-4' aria-hidden='true' />
                ) : (
                  <Moon className='h-4 w-4' aria-hidden='true' />
                )}
              </button>
              <SmartLink
                href='/join'
                prefetch={false}
                onMouseEnter={() => prefetchOnIntent('/join')}
                onTouchStart={() => prefetchOnIntent('/join')}
                data-analytics-event='click_join_community'
                data-analytics-label='header_desktop_join'
                data-analytics-prop-placement='header_desktop'
                className='ignai-header-join inline-flex items-center rounded-lg px-5 py-2 text-sm font-medium transition duration-200'
              >
                加入社区
              </SmartLink>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              type='button'
              onClick={() => setShowMenu(!showMenu)}
              className='ignai-mobile-toggle absolute right-4 top-1/2 -translate-y-1/2 rounded-2xl p-3 md:hidden'
              aria-label={showMenu ? '关闭菜单' : '打开菜单'}
              aria-expanded={showMenu}
            >
              <svg
                aria-hidden='true'
                width='22'
                height='22'
                viewBox='0 0 22 22'
                fill='none'
                style={{ display: 'block' }}
              >
                {showMenu ? (
                  <>
                    <path
                      d='M6 6L16 16'
                      stroke='currentColor'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                    <path
                      d='M16 6L6 16'
                      stroke='currentColor'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                  </>
                ) : (
                  <>
                    <path
                      d='M4.5 6.5H17.5'
                      stroke='currentColor'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                    <path
                      d='M7 11H17.5'
                      stroke='currentColor'
                      strokeWidth='1.9'
                      strokeLinecap='round'
                    />
                    <path
                      d='M10 15.5H17.5'
                      stroke='currentColor'
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
                onClick={() => setShowMenu(false)}
              />
            )}

            {/* 移动端菜单 */}
            <nav
              className={`absolute right-4 top-full z-50 w-full max-w-[calc(100vw-32px)] rounded-[1.5rem] py-2 md:hidden ignai-mobile-menu ${showMenu ? 'ignai-mobile-menu--visible' : 'ignai-mobile-menu--hidden'}`}
              aria-hidden={!showMenu}
              style={{
                opacity: showMenu ? 1 : 0,
                visibility: showMenu ? 'visible' : 'hidden',
                pointerEvents: showMenu ? 'auto' : 'none',
                transform: showMenu
                  ? 'scale(1) translateY(0)'
                  : 'scale(0.95) translateY(-8px)'
              }}
            >
              <div className='ignai-mobile-menu-header px-5 pb-3 pt-4'>
                <p className='ignai-mobile-menu-kicker'>
                  CHANGSHA AI COMMUNITY
                </p>
                <div className='mt-3 flex items-center gap-3'>
                  <span className='ignai-mobile-menu-title'>IGNAI</span>
                  <span className='ignai-mobile-menu-title-glow'>
                    Ignite before AGI.
                  </span>
                </div>
                <p className='ignai-mobile-menu-copy mt-3 text-sm leading-6'>
                  连接本地、面向全球，把真实行动者组织在一起。
                </p>
              </div>

              <ul className='ignai-mobile-menu-list py-1'>
                {navItems.map((item, index) => (
                  <li key={item.label || index}>
                    <SmartLink
                      href={item.href}
                      prefetch={false}
                      onTouchStart={() => prefetchOnIntent(item.href)}
                      className='ignai-mobile-menu-link block rounded-xl px-5 py-3 text-sm transition-colors'
                    >
                      {item.label}
                    </SmartLink>
                    {item.subMenus?.map((sub, si) => (
                      <SmartLink
                        key={si}
                        href={sub.href}
                        prefetch={false}
                        onTouchStart={() => prefetchOnIntent(sub.href)}
                        className='ignai-mobile-menu-sub-link block rounded-xl px-8 py-2 text-[13px] transition-colors'
                      >
                        {sub.label}
                      </SmartLink>
                    ))}
                  </li>
                ))}
                <li className='ignai-mobile-menu-divider mx-5 my-2 border-t' />
                <li>
                  <button
                    type='button'
                    onClick={toggleDarkMode}
                    className='ignai-mobile-theme-toggle mx-5 mb-2 flex w-[calc(100%-2.5rem)] items-center justify-between rounded-xl px-5 py-3 text-sm font-medium transition-colors'
                    aria-pressed={isDarkMode}
                  >
                    <span>{isDarkMode ? '浅色模式' : '深色模式'}</span>
                    {isDarkMode ? (
                      <Sun className='h-4 w-4' aria-hidden='true' />
                    ) : (
                      <Moon className='h-4 w-4' aria-hidden='true' />
                    )}
                  </button>
                </li>
                <li>
                  <SmartLink
                    href='/join'
                    prefetch={false}
                    onTouchStart={() => prefetchOnIntent('/join')}
                    data-analytics-event='click_join_community'
                    data-analytics-label='header_mobile_join'
                    data-analytics-prop-placement='header_mobile'
                    className='ignai-mobile-menu-cta mx-5 block rounded-xl px-5 py-3 text-sm font-medium transition-colors'
                  >
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
