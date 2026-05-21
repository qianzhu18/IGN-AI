/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

'use client'
import Loading from '@/components/Loading'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { CalendarDays, MapPin, Sparkles } from 'lucide-react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { BackToTopButton } from './components/BackToTopButton'
import { Blog } from './components/Blog'
import Footer from './components/Footer'
import { Header } from './components/Header'
import CONFIG from './config'
import { Style } from './style'
import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import ShareBar from '@/components/ShareBar'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import Link from 'next/link'
import SmartLink from '@/components/SmartLink'
import { Banner } from './components/Banner'
import { CTA } from './components/CTA'
import SearchInput from './components/SearchInput'
import { SVG404 } from './components/svg/SVG404'
import Lenis from '@/components/Lenis'
import CursorDot from '@/components/CursorDot'
import { ArticleLock } from './components/ArticleLock'
import { siteContent } from '@/src/content/site'
import {
  cultureContent,
  joinContent,
  whatIsContent
} from '@/src/content/community'
import {
  eventFormatLabel,
  eventStatusLabel,
  events
} from '@/src/content/events'
import { recordTypeLabel, records } from '@/src/content/records'
import {
  isFeaturedMember,
  getMemberQuote,
  getMemberJoinedAtText
} from '@/lib/utils/member'

const BackgroundFX = dynamic(
  () => import('./components/BackgroundFX').then(mod => mod.BackgroundFX),
  { ssr: false }
)

const roleCards = [
  {
    title: 'AI Builders',
    description: '做 Agent、产品原型和自动化流程的人。'
  },
  {
    title: 'Product Explorers',
    description: '从用户、场景和痛点出发，探索 AI 产品机会的人。'
  },
  {
    title: 'Storytellers',
    description: '用文章、视频和社区记录传播高质量信号的人。'
  },
  {
    title: 'Local Connectors',
    description: '连接长沙高校、开发者、创业者和线下空间的人。'
  }
]

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
    ? 'brightness(0.72) contrast(0.92) blur(10px)'
    : 'brightness(0.72) contrast(0.92)'
  const finalFilter = blur
    ? 'brightness(1) contrast(1) blur(0px)'
    : 'brightness(1) contrast(1)'
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: initialFilter }}
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

  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <div
      id='theme-proxio'
      className={`${siteConfig('FONT_STYLE')} min-h-screen flex-col flex dark:bg-dark scroll-smooth`}
    >
      <Style />
      <BackgroundFX />

      {/* Grid Lines — 92px grid pattern */}
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 z-0 opacity-[0.035]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '92px 92px'
        }}
      />

      {/* Noise Overlay — SVG feTurbulence */}
      <svg
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.05]'
        style={{ mixBlendMode: 'overlay' }}
      >
        <filter id='ignai-noise'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.75'
            numOctaves='4'
            stitchTiles='stitch'
          />
        </filter>
        <rect width='100%' height='100%' filter='url(#ignai-noise)' />
      </svg>

      {/* Glow Orbs */}
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 z-0'
        style={{
          background:
            'radial-gradient(ellipse at 16% 10%, rgba(255,122,24,0.14), transparent 32%), radial-gradient(ellipse at 84% 16%, rgba(93,169,255,0.08), transparent 28%)'
        }}
      />

      <Header {...props} />
      <div id='main-wrapper' className='grow'>
        {children}
      </div>
      <Footer {...props} />
      <BackToTopButton />
      <Lenis />
      <CursorDot />
    </div>
  )
}

/**
 * 首页布局 — IGNAI 品牌社区
 */
const LayoutIndex = props => {
  return (
    <main className='ignai-home-shell'>
      {siteConfig('IGNAI_HERO_ENABLE', CONFIG.IGNAI_HERO_ENABLE) && <HeroSection />}
      {siteConfig('IGNAI_WHATIS_ENABLE', CONFIG.IGNAI_WHATIS_ENABLE) && <WhatIsSection />}
      {siteConfig('IGNAI_CULTURE_ENABLE', CONFIG.IGNAI_CULTURE_ENABLE) && <CultureSection />}
      {siteConfig('IGNAI_EVENTS_ENABLE', CONFIG.IGNAI_EVENTS_ENABLE) && <UpcomingEventsSection notionEvents={props.allEvents || []} />}
      {siteConfig('IGNAI_FIELDNOTES_ENABLE', CONFIG.IGNAI_FIELDNOTES_ENABLE) && <FieldNotesSection />}
      {siteConfig('IGNAI_MEMBERS_ENABLE', CONFIG.IGNAI_MEMBERS_ENABLE) && <CommunityRolesSection allMembers={props.allMembers || []} />}
      {siteConfig('IGNAI_JOIN_ENABLE', CONFIG.IGNAI_JOIN_ENABLE) && <JoinSection />}
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
      <Banner title={post?.title} description={post?.summary} />
      <div className='container grow'>
        <div className='flex flex-wrap justify-center -mx-4'>
          <div id='container-inner' className='w-full p-4'>
            {lock && <ArticleLock validPassword={validPassword} />}
            {!lock && post && (
              <div id='article-wrapper' className='mx-auto'>
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
  }, [])

  return (
    <section className='max-w-7xl mx-auto bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]'>
      <SearchInput {...props} />
      {currentSearch && <Blog {...props} />}
    </section>
  )
}

/**
 * 文章归档
 */
const LayoutArchive = props => (
  <>
    <Blog {...props} />
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
    <section className='pb-10 pt-20 lg:pb-20 lg:pt-[120px]'>
      <div className='container mx-auto'>
        <div className='-mx-4 flex flex-wrap justify-center'>
          <div className='w-full px-4'>
            <div className='mx-auto mb-[60px] max-w-[485px] text-center'>
              {slotTitle && (
                <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {slotTitle}
                </h2>
              )}
              {!slotTitle && (
                <>
                  <span className='ignai-badge mb-4 inline-block'>
                    {siteConfig('IGNAI_BLOG_TITLE')}
                  </span>
                  <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                    {siteConfig('IGNAI_BLOG_TEXT_1')}
                  </h2>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='-mx-4 flex flex-wrap'>
          {posts?.map((item, index) => (
            <div key={index} className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <div className='wow fadeInUp group mb-10' data-wow-delay='.1s'>
                <div className='mb-8 overflow-hidden rounded-[8px] border border-white/8'>
                  <SmartLink href={item?.href} className='block'>
                    <img
                      src={item.pageCoverThumbnail}
                      alt={item.title}
                      className='w-full transition group-hover:scale-105 duration-300'
                    />
                  </SmartLink>
                </div>
                <div>
                  <span className='ignai-badge mb-4 inline-block'>
                    {item.publishDay}
                  </span>
                  <h3>
                    <SmartLink
                      href={item?.href}
                      className='mb-4 inline-block text-xl font-semibold text-white hover:text-[#FF7A18] sm:text-2xl lg:text-xl xl:text-2xl'
                    >
                      {item.title}
                    </SmartLink>
                  </h3>
                  <p className='max-w-[370px] text-base text-white/56'>
                    {item.summary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function HeroSection() {
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
          <p className='section-eyebrow mt-8 text-[#f0d48d]/84'>
            {siteContent.name}
          </p>
          <h1 className='display-title ignai-gradient-title mt-4 max-w-[14ch]'>
            {siteContent.slogan}
          </h1>
          <p className='section-lead mt-7 max-w-[17ch] font-medium'>
            在 AGI 到来之前，
            <br />
            先点燃一群真实行动的人。
          </p>
          <p className='section-body mt-6'>
            {siteContent.heroSummary}
            <br />
            <span className='text-white/56'>{siteContent.heroDescription}</span>
          </p>
          <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
            <SmartLink href='/join' className='ignai-cta-primary ignai-motion-cta'>
              加入社区
            </SmartLink>
            <SmartLink href='#upcoming-events' className='ignai-cta-secondary'>
              查看近期活动
            </SmartLink>
          </div>
        </motion.div>

        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className='ignai-home-visual'
        >
          <div className='surface-card-strong ignai-unified-panel overflow-hidden p-4 sm:p-5'>
            <div className='relative overflow-hidden rounded-lg border border-white/10 bg-black/50'>
              <img
                src='/images/generated/local-global-embers.png'
                alt='Warm local embers and blue signal lines'
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
                    className={`text-[0.7rem] font-medium uppercase ${
                      index === 1 ? 'text-[#9aceff]' : 'text-[#f0c78e]/84'
                    }`}
                  >
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

function WhatIsSection() {
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
    <section id='what-is-ignai' className='ignai-home-section' ref={ref}>
      <div className='ignai-home-container section-grid-start'>
        <Reveal className='section-copy'>
          <p className='section-eyebrow'>01 / What is IGNAI</p>
          <h2 className='display-title mt-6 max-w-[12ch]'>
            What is
            <br />
            IGNAI?
          </h2>
          <p className='section-lead mt-6 max-w-[15ch] font-medium'>
            {whatIsContent.definitionLines[0]}
            <br />
            {whatIsContent.definitionLines[1]}
          </p>
          <p className='section-body mt-5'>{whatIsContent.support}</p>
        </Reveal>

        <motion.div style={{ y: mediaY }}>
          <Reveal>
            <p className='section-eyebrow mb-8'>Community Members</p>
          </Reveal>
          <div className='flex flex-col gap-6'>
            {whatIsContent.memberCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.06}>
                <div className='flex items-baseline gap-4'>
                  <span className={`text-xs font-medium tracking-wider uppercase ${
                    index % 2 === 1 ? 'text-[#9aceff]' : 'text-[#F0CB8A]/72'
                  }`}>
                    {card.eyebrow}
                  </span>
                  <span className='text-white/90 font-medium'>{card.title}</span>
                  <span className='text-white/40 text-sm'>{card.description}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CultureSection() {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 28]
  )

  return (
    <section id='culture' className='ignai-home-section' ref={ref}>
      <div className='ignai-home-container section-grid-start'>
        <Reveal className='section-copy'>
          <p className='section-eyebrow'>03 / Culture</p>
          <h2 className='section-title mt-6 max-w-[11ch]'>
            {cultureContent.titleLines[0]}
            <br />
            {cultureContent.titleLines[1]}
          </h2>
          <p className='section-lead mt-6 max-w-[18ch] font-medium'>
            {cultureContent.support}
          </p>
          <p className='section-body mt-5'>{cultureContent.paragraph}</p>
        </Reveal>

        <motion.div style={{ y: mediaY }} className='flex flex-col gap-5'>
          {cultureContent.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <div className='flex items-baseline gap-4'>
                <span className='text-xs font-medium tracking-wider text-[#F0CB8A]/72'>{card.eyebrow}</span>
                <span className='text-white/90 font-medium'>{card.title}</span>
                <span className='text-white/40 text-sm'>{card.description}</span>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function UpcomingEventsSection({ notionEvents = [] }) {
  // Merge Notion events with static events; Notion events take priority
  const mergedEvents = notionEvents.length > 0
    ? notionEvents.map(e => ({
        slug: e.slug || e.id,
        title: e.title,
        subtitle: e.summary || '',
        status: e.ext?.status || 'planning',
        dateText: e.date?.start_date || e.ext?.dateText || '待定',
        location: e.ext?.location || '待定',
        format: e.ext?.format || 'offline',
        cover: e.pageCoverThumbnail || e.ext?.cover || '/images/generated/ignite-core.png',
        excerpt: e.summary || '',
        tags: e.tags || [],
      }))
    : events

  return (
    <section id='upcoming-events' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='section-eyebrow'>Upcoming Events</p>
            <h2 className='section-title mt-6 max-w-[13ch]'>
              近期活动，
              <br />
              真实发生。
            </h2>
            <p className='section-body mt-6'>
              线下聚会、主题共创、工作坊和社区实验，都会在这里持续更新。
            </p>
          </div>
          <div className='flex gap-4'>
            <SmartLink href='/events' className='ignai-cta-primary'>
              查看全部活动
            </SmartLink>
          </div>
        </Reveal>

        <div className='mt-16 flex flex-col gap-4'>
          {mergedEvents.slice(0, 3).map((event, index) => (
            <Reveal key={event.slug} delay={index * 0.06}>
              <SmartLink
                href={`/events/${event.slug}`}
                className='group flex items-center gap-6 rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
              >
                <div className='flex-shrink-0 w-16 text-center'>
                  <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                    event.status === 'open'
                      ? 'border-[#ffb879]/20 bg-[#140b07]/74 text-[#ffd09a]'
                      : 'border-white/10 bg-white/5 text-white/50'
                  }`}>
                    {eventStatusLabel[event.status]}
                  </span>
                </div>

                <div className='flex-shrink-0 hidden sm:block'>
                  <img
                    src={event.cover}
                    alt=''
                    className='h-16 w-24 rounded object-cover'
                  />
                </div>

                <div className='flex-1 min-w-0'>
                  <h3 className='text-base font-semibold text-white truncate transition group-hover:text-[#ffd09a]'>
                    {event.title}
                  </h3>
                  <div className='flex flex-wrap gap-4 mt-1.5 text-xs text-white/45'>
                    <span className='inline-flex items-center gap-1.5'>
                      <CalendarDays className='h-3.5 w-3.5 text-[#F0CB8A]/60' />
                      {event.dateText}
                    </span>
                    <span className='inline-flex items-center gap-1.5'>
                      <MapPin className='h-3.5 w-3.5 text-[#9aceff]/60' />
                      {event.location} · {eventFormatLabel[event.format]}
                    </span>
                  </div>
                </div>

                <div className='flex-shrink-0 hidden md:flex flex-wrap gap-1.5 max-w-[200px]'>
                  {event.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className='rounded-full border border-white/8 px-2.5 py-1 text-[11px] text-white/40'
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className='flex-shrink-0 text-white/30 group-hover:text-white/60 transition'>
                  <span className='text-sm'>&rarr;</span>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FieldNotesSection() {
  return (
    <section id='field-notes' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='section-eyebrow'>Field Notes</p>
            <h2 className='section-title mt-6 max-w-[13ch]'>
              社区现场，
              <br />
              沉淀成记录。
            </h2>
            <p className='section-body mt-6'>
              把活动、项目、思考和成员故事沉淀成可以被继续阅读和传播的内容资产。
            </p>
          </div>
          <SmartLink href='/records' className='ignai-cta-secondary'>
            查看现场记录
          </SmartLink>
        </Reveal>

        <div className='mt-16 flex flex-col gap-4'>
          {records.slice(0, 3).map((record, index) => (
            <Reveal key={record.slug} delay={index * 0.06}>
              <SmartLink
                href={`/records/${record.slug}`}
                className='group flex items-center gap-6 rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] no-underline'
              >
                <div className='flex-shrink-0 hidden sm:block'>
                  <img
                    src={record.cover}
                    alt=''
                    className='h-16 w-24 rounded object-cover'
                  />
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-1.5'>
                    <span className='text-xs text-white/30'>{record.dateText}</span>
                    {record.location && (
                      <span className='text-xs text-white/20'>· {record.location}</span>
                    )}
                    <span className='rounded-full border border-white/8 px-2 py-0.5 text-[11px] text-white/40'>
                      {recordTypeLabel[record.type]}
                    </span>
                  </div>
                  <h3 className='text-base font-semibold text-white truncate transition group-hover:text-[#d4ecff]'>
                    {record.title}
                  </h3>
                  <p className='mt-1 text-sm text-white/40 line-clamp-1'>
                    {record.excerpt}
                  </p>
                </div>

                <div className='flex-shrink-0 hidden md:flex flex-wrap gap-1.5 max-w-[160px]'>
                  {(record.outcomes?.length ? record.outcomes : record.tags).slice(0, 2).map(item => (
                    <span
                      key={item}
                      className='rounded-full border border-[#7cc8ff]/10 px-2.5 py-1 text-[11px] text-[#c7e6ff]/60'
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className='flex-shrink-0 text-white/30 group-hover:text-white/60 transition'>
                  <span className='text-sm'>&rarr;</span>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CommunityRolesSection({ allMembers = [] }) {
  const hasMembers = Array.isArray(allMembers) && allMembers.length > 0
  const displayMembers = allMembers.slice(0, 12)

  return (
    <section id='community-roles' className='ignai-home-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <Reveal className='text-center mb-16'>
          <p className='section-eyebrow'>Community Members</p>
          <h2 className='section-title mt-6'>这里有谁？</h2>
          <p className='section-body mt-6 max-w-lg mx-auto'>
            {hasMembers
              ? 'IGNAI 聚集了一群关注 AI、产品、表达和行动的人。'
              : 'IGNAI 聚集了一群关注 AI、产品、表达和行动的人。第一版先展示角色画像，等有真实授权后再升级成成员墙。'}
          </p>
        </Reveal>

        {hasMembers ? (
          <Reveal>
            <AvatarRing members={displayMembers} />
          </Reveal>
        ) : (
          <div className='flex flex-wrap justify-center gap-4 max-w-2xl mx-auto'>
            {roleCards.map((role, index) => (
              <Reveal key={role.title} delay={index * 0.08}>
                <div className='rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/70 hover:text-white hover:border-white/25 transition-all duration-300'>
                  {role.title}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {hasMembers && (
          <Reveal className='text-center mt-12'>
            <Link href='/members' className='text-sm text-neutral-400 hover:text-white transition no-underline'>
              View all members &rarr;
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}

function AvatarRing({ members }) {
  const count = members.length
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef(null)
  const rotationRef = useRef(0)
  const lastAngleRef = useRef(null)
  const isDragging = useRef(false)
  const dragMoved = useRef(false)

  const avatarSize = count <= 6 ? 72 : count <= 10 ? 60 : 52
  const ringRadius = count <= 4 ? 120 : count <= 6 ? 160 : count <= 8 ? 200 : count <= 10 ? 240 : 260
  const containerSize = ringRadius * 2 + avatarSize + 40

  const getAngle = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
  }

  const handlePointerDown = (e) => {
    isDragging.current = true
    dragMoved.current = false
    lastAngleRef.current = getAngle(e)
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    dragMoved.current = true
    const angle = getAngle(e)
    let delta = angle - lastAngleRef.current
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    rotationRef.current += delta
    setRotation(rotationRef.current)
    lastAngleRef.current = angle
  }

  const handlePointerUp = () => {
    isDragging.current = false
    lastAngleRef.current = null
    setDragging(false)
  }

  return (
    <div className='avatar-ring-container'>
      <div
        ref={containerRef}
        className='avatar-ring'
        style={{ width: containerSize, height: containerSize, cursor: dragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {members.map((member, index) => {
          const baseAngle = (360 / count) * index - 90
          const angle = baseAngle + rotation
          const rad = (angle * Math.PI) / 180
          const x = Math.cos(rad) * ringRadius
          const y = Math.sin(rad) * ringRadius
          const avatar = member?.avatar || member?.pageIcon || '/avatar.svg'
          const slug = member?.slug || member?.id || ''
          const path = String(slug).replace(/^\/+/, '')
          const href = path.startsWith('members/') ? `/${path}` : `/members/${path.split('/').filter(Boolean).pop()}`
          const bio = member?.bio || member?.summary || ''
          const quote = getMemberQuote(member)
          const isHovered = hoveredIndex === index && !dragging

          return (
            <motion.div
              key={member.id || member.slug}
              className='avatar-ring-item'
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: avatarSize,
                height: avatarSize,
                marginLeft: -avatarSize / 2,
                marginTop: -avatarSize / 2,
              }}
              animate={{ scale: isHovered ? 1.6 : 1, zIndex: isHovered ? 20 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onMouseEnter={() => !dragging && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                href={href}
                className='block no-underline'
                onClick={e => { if (dragMoved.current) e.preventDefault() }}
              >
                <img
                  src={avatar}
                  alt={member.title}
                  className='avatar-ring-img'
                  style={{ width: avatarSize, height: avatarSize }}
                  draggable={false}
                />
              </Link>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className='avatar-ring-tooltip'
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className='avatar-ring-tooltip-name'>{member.title}</p>
                    {member.role && <p className='avatar-ring-tooltip-role'>{member.role}</p>}
                    {bio && <p className='avatar-ring-tooltip-bio'>{bio}</p>}
                    {quote && <p className='avatar-ring-tooltip-quote'>&ldquo;{quote}&rdquo;</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function JoinSection() {
  return (
    <section id='join' className='ignai-home-section pb-8'>
      <div className='ignai-home-container'>
        <div className='relative overflow-hidden border-y border-white/10 py-10 sm:py-12 lg:py-16'>
          <div className='converge-field'>
            <span
              className='converge-ray'
              style={{
                '--ray-y': '20%',
                '--ray-rotate': '6deg',
                '--ray-delay': '0s'
              }}
            />
            <span
              className='converge-ray'
              style={{
                '--ray-y': '42%',
                '--ray-rotate': '-3deg',
                '--ray-delay': '1.4s'
              }}
            />
            <span
              className='converge-ray'
              style={{
                '--ray-y': '66%',
                '--ray-rotate': '4deg',
                '--ray-delay': '2.8s'
              }}
            />
          </div>

          <div className='relative grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-[72px]'>
            <Reveal>
              <p className='section-eyebrow'>06 / Join</p>
              <h2 className='display-title mt-6 max-w-[20ch]'>
                <span className='block sm:whitespace-nowrap'>
                  Join the fire.
                </span>
                <span className='block sm:whitespace-nowrap'>
                  Bring your signal.
                </span>
              </h2>
              <p className='section-body mt-6'>{joinContent.support}</p>

              <div className='mt-8 grid max-w-[520px] gap-x-6 border-y border-white/10 sm:grid-cols-2'>
                {joinContent.benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className='flex min-h-12 items-center gap-3 border-t border-white/10 py-3 text-sm leading-6 text-white/72 sm:[&:nth-child(-n+2)]:border-t-0'
                  >
                    <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[#ff9a3c]/10 text-[#f2c892]'>
                      {index + 1}
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
                <SmartLink href='/join' className='ignai-cta-primary'>
                  加入社区
                </SmartLink>
                <SmartLink href='/archive' className='ignai-cta-secondary'>
                  查看社区内容
                </SmartLink>
              </div>
            </Reveal>

            <Reveal className='relative overflow-hidden' delay={0.1}>
              <motion.div
                animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className='relative overflow-hidden rounded-lg border border-white/10 bg-[#06080d] shadow-[0_28px_80px_rgba(0,0,0,0.24)]'
              >
                <img
                  src='/images/generated/collaboration-threads.png'
                  alt='Warm collaboration threads and blue signal lines'
                  className='aspect-[1.45] w-full object-cover opacity-90'
                />
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.14)_0%,rgba(4,6,10,0.1)_30%,rgba(4,6,10,0.88)_100%)]' />
                <div className='absolute left-4 top-4 rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/72 px-3 py-1.5 text-[0.68rem] uppercase text-[#9aceff]'>
                  Signal threads
                </div>
                <div className='absolute bottom-0 left-0 right-0 p-5'>
                  <p className='max-w-[16ch] text-xl font-semibold leading-[1.35] text-white'>
                    把你的表达、行动和信号，
                    <br />
                    带进这团火里。
                  </p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
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
