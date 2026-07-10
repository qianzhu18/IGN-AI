/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

'use client'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { BackToTopButton } from './components/BackToTopButton'
import Footer from './components/Footer'
import { Header } from './components/Header'
import CONFIG from './config'
import { Style } from './style'
import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import ShareBar from '@/components/ShareBar'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import SmartLink from '@/components/SmartLink'
import { Banner } from './components/Banner'
import { PostCommunityContext } from './components/PostCommunityContext'
import {
  HomeArticlesSection,
  PostCollectionPage
} from './components/PostCollection'
import SearchInput from './components/SearchInput'
import { SVG404 } from './components/svg/SVG404'
import { ArticleLock } from './components/ArticleLock'
import { siteContent as siteContentFallback } from '@/src/content/site'
import {
  whatIsContent as whatIsContentFallback
} from '@/src/content/community'

/**
 * 从 NOTION_CONFIG 解析 section 数据，回退到静态内容
 * NOTION_CONFIG 中的 key 格式：IGNAI_SECTION_HERO, IGNAI_SECTION_WHATIS 等
 */
function resolveSection(notionConfig, sectionKey, fallback) {
  const key = `IGNAI_SECTION_${sectionKey}`
  return notionConfig?.[key] || fallback
}

const BackgroundFX = dynamic(
  () => import('./components/BackgroundFX').then(mod => mod.BackgroundFX),
  { ssr: false }
)

const UpcomingEventsSection = dynamic(
  () => import('./components/sections/UpcomingEventsSection').then(mod => mod.UpcomingEventsSection),
  { ssr: false }
)
const FieldNotesSection = dynamic(
  () => import('./components/sections/FieldNotesSection').then(mod => mod.FieldNotesSection),
  { ssr: false }
)
const CommunityRolesSection = dynamic(
  () => import('./components/sections/CommunityRolesSection').then(mod => mod.CommunityRolesSection),
  { ssr: false }
)
const JoinSection = dynamic(
  () => import('./components/sections/JoinSection').then(mod => mod.JoinSection),
  { ssr: false }
)

const MOTION_EASE = [0.22, 1, 0.36, 1]
const MOTION_VIEWPORT = { once: true, amount: 0.18 }

function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 28,
  blur = true
}) {
  const initialFilter = blur
    ? 'brightness(0.92) contrast(0.98) blur(4px)'
    : 'brightness(0.92) contrast(0.98)'
  const finalFilter = blur
    ? 'brightness(1) contrast(1) blur(0px)'
    : 'brightness(1) contrast(1)'
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.24, y: Math.min(y, 18), filter: initialFilter }}
      whileInView={{ opacity: 1, y: 0, filter: finalFilter }}
      viewport={MOTION_VIEWPORT}
      transition={{ duration, delay, ease: MOTION_EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * IGNAI 布局框架
 * 基于 proxio 骨架，爆改为 IGNAI 品牌社区官网
 */
const LayoutBase = props => {
  const { children } = props
  const cursorGlowRef = useRef(null)
  const router = useRouter()
  const isHomePage = router.pathname === '/'

  useEffect(() => {
    loadWowJS()
  }, [])

  useEffect(() => {
    const removeDuplicateThemeRoots = () => {
      const roots = Array.from(document.querySelectorAll('#theme-proxio'))
      if (roots.length <= 1) return

      const keep = roots[roots.length - 1]
      roots.slice(0, -1).forEach(root => {
        root.parentNode?.removeChild(root)
      })
      keep?.scrollIntoView({ block: 'start' })
    }

    removeDuplicateThemeRoots()
    const timer = window.setTimeout(removeDuplicateThemeRoots, 240)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const glow = cursorGlowRef.current
    if (!glow || !isHomePage) return
    const media = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!media.matches || reducedMotion.matches) return

    let frame = 0
    let x = -500
    let y = -500
    const handleMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`
        frame = 0
      })
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [isHomePage])

  return (
    <div
      id='theme-proxio'
      className={`${siteConfig('FONT_STYLE')} min-h-screen flex-col flex dark:bg-dark scroll-smooth`}
    >
      <Style />
      {isHomePage && <BackgroundFX />}

      {/* Grid Lines — 92px grid pattern */}
      <div
        aria-hidden='true'
        className='ignai-grid-overlay pointer-events-none fixed inset-0 z-0'
      />

      {/* Noise Overlay — CSS SVG filter */}
      <div aria-hidden='true' className='ignai-noise-overlay' />

      <div aria-hidden='true' className='ignai-background-field pointer-events-none fixed inset-0 z-0' />

      {/* Cursor Glow — 桌面端鼠标跟随光晕 */}
      {isHomePage && (
        <div
          ref={cursorGlowRef}
          aria-hidden='true'
          className='ignai-cursor-glow'
          style={{ transform: 'translate3d(-500px, -500px, 0)' }}
        />
      )}

      {/* Rig 覆盖效果：首页保留动态质感，子页面避免常驻绘制拖慢跳转 */}
      {isHomePage && (
        <>
          <div aria-hidden='true' className='rig-scanlines' />
          <div aria-hidden='true' className='rig-rgb-fringe' />
          <div aria-hidden='true' className='rig-content-lines' />
        </>
      )}
      {/* Rig noise SVG filter */}
      <svg aria-hidden='true' style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id='rig-grainy'>
          <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' />
        </filter>
      </svg>

      <Header {...props} />
      <div id='main-wrapper' className='grow'>
        {children}
      </div>
      <Footer {...props} />
      <BackToTopButton />
    </div>
  )
}

/**
 * 首页布局 — IGNAI 品牌社区
 */
const LayoutIndex = props => {
  const notionConfig = props?.NOTION_CONFIG
  return (
    <main className='ignai-home-shell'>
      <RigHeroSection />
      <RigTicker />
      <div className='rig-divider' />
      <RigProblemSection />
      <div className='rig-divider' />
      <RigCapabilitiesSection />
      <RigStatsStrip />
      <RigTerminalBlock />
      {siteConfig('IGNAI_EVENTS_ENABLE', CONFIG.IGNAI_EVENTS_ENABLE) && <UpcomingEventsSection notionEvents={props.allEvents || []} />}
      {siteConfig('IGNAI_ARTICLES_ENABLE', CONFIG.IGNAI_ARTICLES_ENABLE) && <HomeArticlesSection posts={props.latestPosts || []} />}
      {siteConfig('IGNAI_FIELDNOTES_ENABLE', CONFIG.IGNAI_FIELDNOTES_ENABLE) && <FieldNotesSection />}
      {siteConfig('IGNAI_MEMBERS_ENABLE', CONFIG.IGNAI_MEMBERS_ENABLE) && <CommunityRolesSection allMembers={props.allMembers || []} />}
      <RigFAQSection />
      <RigCTASection />
    </main>
  )
}

/**
 * 文章详情页布局
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  return (
    <>
      <Banner title={post?.title} description={post?.summary} post={post} />
      <div className='container grow'>
        <div className='flex flex-wrap justify-center -mx-4'>
          <div id='container-inner' className='w-full p-4'>
            {lock && <ArticleLock validPassword={validPassword} />}
            {!lock && post && (
              <div id='article-wrapper' className='mx-auto'>
                <PostCommunityContext post={post} />
                <NotionPage {...props} />
                <Comment frontMatter={post} />
                <ShareBar post={post} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * 搜索
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [keyword])

  return (
    <section className='ignai-search-page'>
      <SearchInput {...props} />
      {currentSearch && (
        <PostCollectionPage
          posts={props.posts || []}
          eyebrow='Search'
          title={`搜索：${currentSearch}`}
          description='从已发布文章中查找相关内容。'
          emptyText='没有匹配的文章。'
        />
      )}
    </section>
  )
}

/**
 * 文章归档
 */
const LayoutArchive = props => (
  <>
    <PostCollectionPage
      posts={props.posts || []}
      eyebrow='Articles'
      title='内容文章'
      description='成员观点、活动复盘、工具实践和社区写作会在这里集中展示。'
    />
  </>
)

/**
 * 404页面
 */
const Layout404 = props => {
  return (
    <section className='py-20 lg:py-[110px]'>
      <div className='container mx-auto'>
        <div className='flex flex-wrap items-center -mx-4'>
          <div className='w-full px-4 text-center'>
            <div className='mb-8'>
              <SVG404 />
            </div>
            <h3 className='mb-5 text-2xl font-semibold text-white'>
              {siteConfig('IGNAI_404_TITLE')}
            </h3>
            <p className='mb-8 text-base text-white/56'>
              {siteConfig('IGNAI_404_TEXT')}
            </p>
            <SmartLink href='/' className='ignai-cta-primary'>
              {siteConfig('IGNAI_404_BACK')}
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 博客列表
 */
const LayoutPostList = props => {
  const { posts, category, tag } = props
  const slotTitle = category || tag

  return (
    <PostCollectionPage
      posts={posts || []}
      eyebrow={category ? 'Category' : tag ? 'Tag' : 'Articles'}
      title={slotTitle || siteConfig('IGNAI_BLOG_TEXT_1')}
      description={
        slotTitle
          ? '当前筛选下的已发布文章。'
          : '成员观点、活动复盘、工具实践和社区写作会在这里集中展示。'
      }
    />
  )
}

/**
 * 分类列表
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  return (
    <section className='pb-10 pt-20 lg:pb-20 lg:pt-[120px]'>
      <div className='container mx-auto min-h-96'>
        <span className='ignai-badge mb-4 inline-flex justify-center items-center w-full'>
          {locale.COMMON.CATEGORY}
        </span>
        <div
          id='category-list'
          className='duration-200 flex flex-wrap justify-center items-center'
        >
          {categoryOptions?.map(category => (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior
            >
              <h2 className='hover:text-[#FF7A18] text-2xl font-semibold text-white/72 sm:text-4xl md:text-[40px] md:leading-[1.2] px-5 cursor-pointer py-2 hover:bg-white/4 rounded-lg'>
                <i className='mr-4 fas fa-folder' />
                {category.name}({category.count})
              </h2>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * 标签列表
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
    <section className='pb-10 pt-20 lg:pb-20 lg:pt-[120px]'>
      <div className='container mx-auto min-h-96'>
        <span className='ignai-badge mb-4 inline-flex justify-center items-center w-full'>
          {locale.COMMON.TAGS}
        </span>
        <div
          id='tags-list'
          className='duration-200 flex flex-wrap justify-center items-center'
        >
          {tagOptions.map(tag => (
            <div key={tag.name} className='p-2'>
              <SmartLink
                key={tag}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                className='cursor-pointer inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/56 hover:border-[#FF7A18]/24 hover:text-[#FF7A18] duration-200'
              >
                <div className='font-light'>
                  <i className='mr-1 fas fa-tag' />
                  {tag.name + (tag.count ? `(${tag.count})` : '')}
                </div>
              </SmartLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroSection({ notionConfig }) {
  const siteContent = resolveSection(notionConfig, 'HERO', siteContentFallback)
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.68],
    [0, shouldReduceMotion ? 0 : -44]
  )
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 1, shouldReduceMotion ? 1 : 0.38]
  )
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 56]
  )
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.015, shouldReduceMotion ? 1.015 : 1.08]
  )

  return (
    <section ref={ref} className='ignai-hero-section'>
      <div className='ignai-home-container section-grid ignai-hero-grid'>
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className='ignai-home-copy'
        >
          <div className='eyebrow-label'>
            <Sparkles className='h-[14px] w-[14px]' />
            {siteContent.eyebrow}
          </div>

          <div className='ignai-hero-identity mt-6 w-full max-w-[42rem] sm:w-auto'>
            <div className='ignai-hero-brand-row'>
              <p className='ignai-hero-wordmark'>
                {siteContent.name}
              </p>
              <span className='ignai-hero-brand-divider' />
              <p className='ignai-hero-brand-context'>
                长沙 AI Community
              </p>
            </div>
            <p className='ignai-hero-tagline text-white'>
              {siteContent.slogan}
            </p>
            <div className='ignai-hero-pill-row mt-4'>
              {['Local roots', 'Global signal', '真实行动'].map(label => (
                <span key={label} className='ignai-hero-pill'>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <h1 className='ignai-hero-manifesto mt-9'>
            在 AGI 到来之前，
            <br />
            先点燃一群真实行动的人。
          </h1>
          <p className='ignai-hero-summary mt-6'>
            <span className='text-white/92'>{siteContent.heroSummary}</span>
            <br />
            <span className='text-white/64'>{siteContent.heroDescription}</span>
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
            <SmartLink
              href='/join'
              className='ignai-motion-cta ignai-hero-cta ignai-hero-cta--primary inline-flex items-center justify-center rounded-[14px] px-7 py-4 text-[0.95rem] font-semibold text-white transition'
            >
              加入社区
            </SmartLink>
            <SmartLink
              href='/events'
              className='ignai-hero-cta ignai-hero-cta--secondary inline-flex items-center justify-center rounded-[14px] px-7 py-4 text-[0.95rem] font-medium text-white/88 transition'
            >
              查看活动
            </SmartLink>
          </div>

          <div className='ignai-mobile-hero-panel mt-7 md:hidden'>
            <p className='ignai-mobile-hero-kicker'>
              COMMUNITY SNAPSHOT
            </p>
            <div className='ignai-mobile-signal-list mt-4'>
              {siteContent.heroSignals.map((signal, index) => (
                <div key={signal.title} className='ignai-mobile-signal-item'>
                  <span
                    className={`ignai-mobile-signal-dot ${index === 0 ? 'ignai-mobile-signal-dot--heat' : 'ignai-mobile-signal-dot--soft'}`}
                  />
                  <div>
                    <p className='ignai-mobile-signal-eyebrow'>{signal.eyebrow}</p>
                    <p className='ignai-mobile-signal-title'>{signal.title}</p>
                    <p className='ignai-mobile-signal-description'>{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className='ignai-home-visual'
        >
          <div className='surface-card-strong ignai-unified-panel overflow-hidden p-4 sm:p-5'>
            <div className='relative overflow-hidden rounded-lg border border-white/10 bg-black/50'>
              <Image
                src='/images/generated/local-global-embers.png'
                alt='Warm local embers and blue signal lines'
                width={1376}
                height={768}
                priority
                sizes='(max-width: 768px) 100vw, 50vw'
                className='ignai-hero-image'
              />
              <div className='ignai-hero-image-overlay' />
              <div className='ignai-hero-badge'>
                Local roots / Global signal
              </div>
              <div className='ignai-hero-caption'>
                让本地土壤和全球信号，
                <br />
                同时亮起来。
              </div>
            </div>

            <div className='ignai-signal-grid mt-6'>
              {siteContent.heroSignals.map((signal, index) => (
                <div key={signal.title} className='ignai-signal-item'>
                  <p
                    className={`text-[0.7rem] font-medium uppercase inline-flex items-center gap-2 ${
                      index === 1 ? 'text-[#9aceff]' : 'text-[#f0c78e]/84'
                    }`}
                  >
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                      index === 1 ? 'bg-[#5DA9FF]' : 'bg-[#FF7A18]'
                    }`} />
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
          </div>
        </motion.div>
      </div>

      {/* Ambient decorative orbs */}
      <div aria-hidden='true' className='ignai-ambient-orb ignai-orb-heat' style={{ width: 320, height: 320, top: '12%', left: '-4%' }} />
      <div aria-hidden='true' className='ignai-ambient-orb ignai-orb-signal' style={{ width: 240, height: 240, bottom: '18%', right: '-2%' }} />

      {/* Scroll hint */}
      <div className='ignai-scroll-hint'>
        <span>Scroll</span>
        <svg viewBox='0 0 24 24'><path d='M12 5v14M5 12l7 7 7-7' /></svg>
      </div>
    </section>
  )
}

function WhatIsSection({ notionConfig }) {
  const whatIsContent = resolveSection(notionConfig, 'WHATIS', whatIsContentFallback)
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 36]
  )

  return (
    <section id='about' className='ignai-home-section' ref={ref}>
      <div className='ignai-home-container section-grid-start'>
        <Reveal className='section-copy'>
          <p className='section-eyebrow'>About IGNAI</p>
          <h2 className='display-title mt-6 max-w-[14ch]'>
            {whatIsContent.definitionLines[0]}
            <br />
            {whatIsContent.definitionLines[1]}
          </h2>
          <p className='section-lead mt-6 max-w-[18ch] font-medium'>
            {whatIsContent.support}
          </p>
          <p className='section-body mt-5'>
            {whatIsContent.paragraph || '我们在这里学习 AI、做项目、分享观点、连接彼此。'}
          </p>
          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <SmartLink href='/join' className='ignai-cta-primary'>
              加入社区
            </SmartLink>
          </div>
        </Reveal>

        <motion.div style={{ y: mediaY }}>
          <div className='open-grid'>
            {whatIsContent.memberCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08}>
                <div className='open-grid-item ignai-unified-card'>
                  <p
                    className={`card-eyebrow ${
                      index % 2 === 1 ? 'text-[#9aceff]' : 'text-[#F0CB8A]/72'
                    }`}
                  >
                    {card.eyebrow}
                  </p>
                  <h3 className='card-title'>{card.title}</h3>
                  <p className='card-body'>{card.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================
   RIG AI 风格组件
   ================================================================ */

function RigHeroSection() {
  const title = siteConfig('RIG_HERO_TITLE', CONFIG.RIG_HERO_TITLE)
  const sub = siteConfig('RIG_HERO_SUB', CONFIG.RIG_HERO_SUB)
  const cta1Text = siteConfig('RIG_HERO_CTA_1', CONFIG.RIG_HERO_CTA_1)
  const cta1Url = siteConfig('RIG_HERO_CTA_1_URL', CONFIG.RIG_HERO_CTA_1_URL)
  const cta2Text = siteConfig('RIG_HERO_CTA_2', CONFIG.RIG_HERO_CTA_2)
  const cta2Url = siteConfig('RIG_HERO_CTA_2_URL', CONFIG.RIG_HERO_CTA_2_URL)

  return (
    <section className='rig-hero'>
      <div aria-hidden='true' className='rig-hero-artwash' />
      <div className='rig-hero-inner'>
        <div className='rig-hero-copy'>
          <Reveal>
            <div className='rig-hero-kicker'>
              <span className='rig-hero-kicker-dot' />
              Changsha AI Community
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 dangerouslySetInnerHTML={{ __html: title }} />
          </Reveal>
          <Reveal delay={0.12}>
            <p className='rig-hero-sub'>{sub}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className='rig-hero-actions'>
              <SmartLink
                href={cta1Url}
                className='rig-btn rig-btn--dark'
                data-analytics-event='click_join_community'
                data-analytics-label='home_hero_primary'
                data-analytics-prop-placement='home_hero'
              >
                {cta1Text}
              </SmartLink>
              <SmartLink
                href={cta2Url}
                className='rig-btn rig-btn--outline'
                data-analytics-event='click_view_events'
                data-analytics-label='home_hero_secondary'
                data-analytics-prop-placement='home_hero'
              >
                {cta2Text}
              </SmartLink>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.16} className='rig-hero-visual-wrap'>
          <div className='rig-hero-visual'>
            <Image
              src='/brand/ignai/hero-gradient-brand.webp'
              alt='IGNAI brand gradient lockup'
              width={1600}
              height={893}
              priority
              sizes='(max-width: 960px) 100vw, 42vw'
              className='rig-hero-brand-image rig-hero-brand-image--light'
            />
            <Image
              src='/brand/ignai/storefront-sign.webp'
              alt='IGNAI storefront sign'
              width={1600}
              height={893}
              priority
              sizes='(max-width: 960px) 100vw, 42vw'
              className='rig-hero-brand-image rig-hero-brand-image--dark'
            />
            <div className='rig-hero-visual-caption'>
              <span>Brand Assets</span>
              <strong>IGNITE BEFORE AGI</strong>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function RigTicker() {
  const items = siteConfig('RIG_HERO_TICKER', CONFIG.RIG_HERO_TICKER)
  const doubled = [...items, ...items]
  return (
    <div className='rig-ticker'>
      <div className='rig-ticker-track'>
        {doubled.map((t, i) => (
          <span key={i}>
            {t}
            <span className='rig-ticker-dot'>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function RigProblemSection() {
  const badge = siteConfig('RIG_PROBLEM_BADGE', CONFIG.RIG_PROBLEM_BADGE)
  const title = siteConfig('RIG_PROBLEM_TITLE', CONFIG.RIG_PROBLEM_TITLE)
  const cards = siteConfig('RIG_PROBLEM_CARDS', CONFIG.RIG_PROBLEM_CARDS)

  return (
    <section className='rig-section'>
      <Reveal>
        <div className='rig-badge'>
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <circle cx='12' cy='12' r='10' /><path d='M12 8v4M12 16h.01' />
          </svg>
          {badge}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className='rig-section-title' style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: title }} />
      </Reveal>
      <div className='rig-problem-grid' style={{ marginTop: '3rem' }}>
        {cards.map((card, i) => (
          <Reveal key={card.number} delay={i * 0.08}>
            <div className='rig-problem-card'>
              <p className='rig-problem-card-label'>{card.label}</p>
              <p className='rig-problem-card-num'>{card.number}</p>
              <p className='rig-problem-card-title'>{card.title}</p>
              <p className='rig-problem-card-desc'>{card.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function RigCapabilitiesSection() {
  const badge = siteConfig('RIG_CAPS_BADGE', CONFIG.RIG_CAPS_BADGE)
  const title = siteConfig('RIG_CAPS_TITLE', CONFIG.RIG_CAPS_TITLE)
  const cards = siteConfig('RIG_CAPS_CARDS', CONFIG.RIG_CAPS_CARDS)

  return (
    <section className='rig-section'>
      <Reveal>
        <div className='rig-badge'>
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <polygon points='12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5' />
          </svg>
          {badge}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className='rig-section-title' style={{ textAlign: 'center' }}>{title}</h2>
      </Reveal>
      <div className='rig-caps-grid' style={{ marginTop: '3rem' }}>
        {cards.map((card, i) => (
          <Reveal key={card.label} delay={i * 0.06}>
            <div className='rig-cap-card'>
              <p className='rig-cap-label'>{card.label}</p>
              <p className='rig-cap-title'>{card.title}</p>
              <p className='rig-cap-desc'>{card.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function RigStatsStrip() {
  const stats = CONFIG.RIG_STATS
  return (
    <div style={{ maxWidth: 'var(--rig-max-w)', margin: '0 auto' }}>
      <Reveal>
        <div className='rig-stats'>
          {stats.map(s => (
            <div key={s.label} className='rig-stat'>
              <p className='rig-stat-value'>{s.value}</p>
              <p className='rig-stat-label'>{s.label}</p>
              <p className='rig-stat-note'>{s.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

function RigTerminalBlock() {
  const title = siteConfig('RIG_TERM_TITLE', CONFIG.RIG_TERM_TITLE)
  const lines = CONFIG.RIG_TERM_LINES
  const [typingIdx, setTypingIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const typingLine = lines.find(l => l.type === 'typing')
  const prompts = typingLine?.prompts || []

  useEffect(() => {
    if (!prompts.length) return
    const current = prompts[typingIdx % prompts.length]
    let i = 0
    setDisplayed('')
    const timer = setInterval(() => {
      i++
      setDisplayed(current.slice(0, i))
      if (i >= current.length) {
        clearInterval(timer)
        setTimeout(() => setTypingIdx(prev => prev + 1), 2200)
      }
    }, 80)
    return () => clearInterval(timer)
  }, [typingIdx, prompts])

  return (
    <section className='rig-section'>
      <Reveal>
        <p className='rig-section-title' style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{title}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className='rig-terminal' style={{ maxWidth: 640, margin: '2rem auto 0' }}>
          <div className='rig-terminal-bar'>
            <span className='rig-terminal-dot' style={{ background: '#ef4444' }} />
            <span className='rig-terminal-dot' style={{ background: '#eab308' }} />
            <span className='rig-terminal-dot' style={{ background: '#22c55e' }} />
            <span style={{ marginLeft: '0.5rem' }}>ignai@community</span>
          </div>
          <div className='rig-terminal-body'>
            {lines.filter(l => l.type !== 'typing').map((line, i) => (
              <div key={i} className={`rig-term-${line.type}`}>
                {line.text}
              </div>
            ))}
            {prompts.length > 0 && (
              <div className='rig-term-prompt'>
                {displayed}
                <span className='rig-term-cursor' />
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function RigFAQSection() {
  const badge = siteConfig('RIG_FAQ_BADGE', CONFIG.RIG_FAQ_BADGE)
  const title = siteConfig('RIG_FAQ_TITLE', CONFIG.RIG_FAQ_TITLE)
  const items = siteConfig('RIG_FAQ_ITEMS', CONFIG.RIG_FAQ_ITEMS)
  const [openIdx, setOpenIdx] = useState(-1)

  return (
    <section className='rig-section'>
      <Reveal>
        <div className='rig-badge'>
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <circle cx='12' cy='12' r='10' /><path d='M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3' /><path d='M12 17h.01' />
          </svg>
          {badge}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className='rig-section-title' style={{ textAlign: 'center' }}>{title}</h2>
      </Reveal>
      <div style={{ maxWidth: 720, margin: '3rem auto 0' }}>
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className={`rig-faq-item ${openIdx === i ? 'rig-faq-item--open' : ''}`}>
              <div className='rig-faq-q' onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
                <span>{item.q}</span>
                <svg className='rig-faq-chevron' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <polyline points='6 9 12 15 18 9' />
                </svg>
              </div>
              <div className='rig-faq-a'>{item.a}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function RigCTASection() {
  const title = siteConfig('RIG_CTA_TITLE', CONFIG.RIG_CTA_TITLE)
  const sub = siteConfig('RIG_CTA_SUB', CONFIG.RIG_CTA_SUB)
  const btn = siteConfig('RIG_CTA_BTN', CONFIG.RIG_CTA_BTN)
  const btnUrl = siteConfig('RIG_CTA_BTN_URL', CONFIG.RIG_CTA_BTN_URL)

  return (
    <section className='rig-cta'>
      <div className='rig-cta-glow' />
      <Reveal>
        <h2 className='rig-cta-title'>{title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className='rig-cta-sub'>{sub}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <SmartLink
          href={btnUrl}
          className='rig-btn rig-btn--heat'
          data-analytics-event='click_join_community'
          data-analytics-label='home_bottom_cta'
          data-analytics-prop-placement='home_bottom_cta'
        >
          {btn}
        </SmartLink>
      </Reveal>
    </section>
  )
}


export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
