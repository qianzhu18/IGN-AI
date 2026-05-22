/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

'use client'
import Loading from '@/components/Loading'
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
import SmartLink from '@/components/SmartLink'
import { Banner } from './components/Banner'
import { CTA } from './components/CTA'
import SearchInput from './components/SearchInput'
import { SVG404 } from './components/svg/SVG404'
import Lenis from '@/components/Lenis'
import { ArticleLock } from './components/ArticleLock'
import { siteContent as siteContentFallback } from '@/src/content/site'
import {
  cultureContent as cultureContentFallback,
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
      {siteConfig('IGNAI_HERO_ENABLE', CONFIG.IGNAI_HERO_ENABLE) && <HeroSection notionConfig={notionConfig} />}
      {siteConfig('IGNAI_WHATIS_ENABLE', CONFIG.IGNAI_WHATIS_ENABLE) && <WhatIsSection notionConfig={notionConfig} />}
      {siteConfig('IGNAI_CULTURE_ENABLE', CONFIG.IGNAI_CULTURE_ENABLE) && <CultureSection notionConfig={notionConfig} />}
      {siteConfig('IGNAI_EVENTS_ENABLE', CONFIG.IGNAI_EVENTS_ENABLE) && <UpcomingEventsSection notionEvents={props.allEvents || []} />}
      {siteConfig('IGNAI_FIELDNOTES_ENABLE', CONFIG.IGNAI_FIELDNOTES_ENABLE) && <FieldNotesSection notionEvents={props.allEvents || []} />}
      {siteConfig('IGNAI_MEMBERS_ENABLE', CONFIG.IGNAI_MEMBERS_ENABLE) && <CommunityRolesSection allMembers={props.allMembers || []} />}
      {siteConfig('IGNAI_JOIN_ENABLE', CONFIG.IGNAI_JOIN_ENABLE) && <JoinSection notionConfig={notionConfig} />}
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
            <p className='section-eyebrow mb-5'>Community Members</p>
          </Reveal>
          <div className='open-grid'>
            {whatIsContent.memberCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08}>
                <div className='open-grid-item ignai-unified-card'>
                  <p
                    className={`card-eyebrow ${
                      index % 2 === 1 ? 'text-[#9aceff]' : 'text-[#F0CB8A]/72'
                    }`}
                  >
                    0{index + 1} / {card.eyebrow}
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

function CultureSection({ notionConfig }) {
  const cultureContent = resolveSection(notionConfig, 'CULTURE', cultureContentFallback)
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

        <motion.div style={{ y: mediaY }} className='open-grid'>
          {cultureContent.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <div className='open-grid-item ignai-unified-card'>
                <p className='card-eyebrow text-[#F0CB8A]/72'>{card.eyebrow}</p>
                <h3 className='card-title'>{card.title}</h3>
                <p className='card-body'>{card.description}</p>
              </div>
            </Reveal>
          ))}
        </motion.div>
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
