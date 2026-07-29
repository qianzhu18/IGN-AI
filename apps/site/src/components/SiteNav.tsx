'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type NavItem = {
  href: string
  label: string
}

export function SiteNav({ items }: { items: NavItem[] }) {
  const [floating, setFloating] = useState(false)

  useEffect(() => {
    const threshold = 80
    let current = false
    let ticking = false

    const update = () => {
      const next = window.scrollY > threshold
      if (next !== current) {
        current = next
        setFloating(next)
      }
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-nav${floating ? ' is-floating' : ''}`}>
      <div className="site-nav__inner">
        <Link aria-label="IGN AI 首页" className="wordmark" href="/">
          <span aria-hidden="true" className="wordmark__spark" />
          IGN AI
        </Link>

        <nav aria-label="主导航" className="site-nav__links">
          {items.map((item) => (
            <Link className="site-nav__link" href={item.href} key={`${item.href}-${item.label}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="mobile-nav">
          <summary aria-label="打开导航">导航</summary>
          <nav aria-label="移动端导航" className="mobile-nav__sheet">
            {items.map((item) => (
              <Link href={item.href} key={`mobile-${item.href}-${item.label}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
