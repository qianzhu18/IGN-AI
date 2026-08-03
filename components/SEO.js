import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import {
  buildAbsoluteUrl,
  buildStructuredData,
  getIndexingPolicy,
  resolveSeoImage,
  serializeJsonLd
} from '@/lib/seo/metadata'
import Head from 'next/head'
import { useRouter } from 'next/router'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const LINK = siteConfig('LINK')
  const SUB_PATH = siteConfig('SUB_PATH', '')
  const siteUrl = buildAbsoluteUrl(LINK, SUB_PATH)
  let url = siteUrl
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const indexingPolicy = getIndexingPolicy(router?.route)
  const defaultOgImage = siteConfig(
    'OG_IMAGE',
    '/brand/ignai/og-default.jpg',
    NOTION_CONFIG
  )
  const routeUsesDefaultOg = [
    '/',
    '/members',
    '/events',
    '/records',
    '/join',
    '/about'
  ].includes(router?.route)

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    if (meta.slug) {
      url = /^https?:\/\//i.test(meta.slug)
        ? siteUrl
        : buildAbsoluteUrl(siteUrl, meta.slug)
    }
    image = routeUsesDefaultOg
      ? defaultOgImage
      : meta.image || siteInfo?.pageCover || defaultOgImage
  }
  image = resolveSeoImage(
    image,
    siteUrl,
    defaultOgImage
  )
  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE || 'IGNAI'
  const description = meta?.description || siteConfig('DESCRIPTION') || siteInfo?.description || ''
  const type = meta?.type || 'website'
  const language = siteConfig('LANG', 'zh-CN')
  const lang = language.replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || KEYWORDS // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const favicon = siteConfig('BLOG_FAVICON')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
    'SEO_BAIDU_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_ENABLE = siteConfig(
    'COMMENT_WEBMENTION_ENABLE',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
    'COMMENT_WEBMENTION_HOSTNAME',
    null,
    NOTION_CONFIG
  )
  const COMMENT_WEBMENTION_AUTH = siteConfig(
    'COMMENT_WEBMENTION_AUTH',
    null,
    NOTION_CONFIG
  )
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
    'ANALYTICS_BUSUANZI_ENABLE',
    null,
    NOTION_CONFIG
  )

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)

  const AUTHOR = siteConfig('AUTHOR')
  return (
    <Head>
      <link rel='icon' href={favicon} />
      <title>{title}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta
        name='robots'
        content={
          indexingPolicy.index
            ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
            : 'noindex, follow'
        }
      />
      <meta charSet='UTF-8' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />

      {/* 搜索引擎验证 */}
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name='baidu-site-verification'
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}

      {/* 基础SEO元数据 */}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='NotionNext' />

      {/* 语言和地区 */}
      <meta httpEquiv='content-language' content={language} />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />
      {/* Open Graph 元数据 */}
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:alt' content={title} />
      <meta property='og:site_name' content={siteConfig('TITLE')} />
      <meta property='og:type' content={type} />

      {/* Canonical URL */}
      <link rel='canonical' href={url} />

      {/* Hreflang */}
      <link rel='alternate' hrefLang={language} href={url} />
      <link rel='alternate' hrefLang='x-default' href={url} />

      {/* RSS 发现 */}
      <link
        rel='alternate'
        type='application/rss+xml'
        title='IGNAI RSS'
        href={buildAbsoluteUrl(siteUrl, 'rss/feed.xml')}
      />

      {/* Twitter Card 元数据 */}
      <meta name='twitter:card' content='summary_large_image' />
      {siteConfig('TWITTER_SITE', '') && (
        <meta name='twitter:site' content={siteConfig('TWITTER_SITE', '')} />
      )}
      {siteConfig('TWITTER_CREATOR', '') && (
        <meta name='twitter:creator' content={siteConfig('TWITTER_CREATOR', '')} />
      )}
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:image:alt' content={title} />

      {/* favicon 由上方统一设置，避免重复 */}

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link
            rel='webmention'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
          />
          <link
            rel='pingback'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
          />
          {COMMENT_WEBMENTION_AUTH && (
            <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
          )}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}
      {/* 文章特定元数据 */}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:modified_time' content={meta.lastEditedDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          {FACEBOOK_PAGE && <meta property='article:publisher' content={FACEBOOK_PAGE} />}
        </>
      )}

      {/* 结构化数据 */}
      <script
        id='ignai-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildStructuredData({
              route: router?.route,
              meta: { ...meta, title, description, image },
              siteInfo,
              pageData: props,
              url,
              siteUrl,
              siteTitle: TITLE,
              siteDescription: description,
              language,
              author: AUTHOR,
              logo: siteInfo?.icon || siteConfig('BLOG_FAVICON'),
              sameAs: [
                siteConfig('CONTACT_GITHUB', '', NOTION_CONFIG),
                siteConfig('CONTACT_TWITTER', '', NOTION_CONFIG),
                siteConfig('CONTACT_LINKEDIN', '', NOTION_CONFIG),
                siteConfig('CONTACT_XIAOHONGSHU', '', NOTION_CONFIG)
              ]
            })
          )
        }}
      />

      {/* DNS预取和预连接 */}
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='dns-prefetch' href='//www.google-analytics.com' />
      <link rel='dns-prefetch' href='//www.googletagmanager.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      {children}
    </Head>
  )
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page, pageTitle, pageDescription } = props
  const keyword = router?.query?.s || router?.query?.keyword

  const TITLE = siteConfig('TITLE')
  const DESCRIPTION = siteConfig('DESCRIPTION') || siteInfo?.description
  switch (router.route) {
    case '/':
      return {
        title: `${TITLE} | 长沙 AI 社区`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${TITLE}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${TITLE}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${TITLE}`,
        description: DESCRIPTION,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${TITLE}`,
        description: DESCRIPTION,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${TITLE}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${TITLE}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/members':
      return {
        title: pageTitle || `成员 | ${TITLE}`,
        description: pageDescription || DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'members',
        type: 'website'
      }
    case '/members/[slug]':
      {
      const member = props.member || post
      return {
        title: member?.title ? `${member.title} | ${TITLE}` : `成员 | ${TITLE}`,
        description: member?.summary || member?.bio || DESCRIPTION,
        image: member?.avatar || member?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        slug: member?.slug || `members/${router?.query?.slug || ''}`,
        type: 'profile'
      }
      }
    case '/events':
      return {
        title: pageTitle || `活动 | ${TITLE}`,
        description: pageDescription || DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'events',
        type: 'website'
      }
    case '/events/[slug]':
      {
      const event = props.event
      return {
        title: pageTitle || (event?.title ? `${event.title} | ${TITLE}` : `活动 | ${TITLE}`),
        description: pageDescription || event?.excerpt || event?.subtitle || DESCRIPTION,
        image: event?.cover || `${siteInfo?.pageCover}`,
        slug: event?.slug
          ? event.slug.startsWith('events/')
            ? event.slug
            : `events/${event.slug}`
          : `events/${router?.query?.slug || ''}`,
        type: 'website'
      }
      }
    case '/records':
      return {
        title: pageTitle || `社区记录 | ${TITLE}`,
        description: pageDescription || 'IGNAI 社区记录、活动复盘、项目记录与 AI 工作流工具清单。',
        image: `${siteInfo?.pageCover}`,
        slug: 'records',
        type: 'website'
      }
    case '/records/[slug]':
      {
      const record = props.record
      return {
        title: pageTitle || (record?.title ? `${record.title} | ${TITLE}` : `社区记录 | ${TITLE}`),
        description: pageDescription || record?.excerpt || DESCRIPTION,
        image: record?.cover || `${siteInfo?.pageCover}`,
        slug: record?.slug
          ? record.slug.startsWith('records/')
            ? record.slug
            : `records/${record.slug}`
          : `records/${router?.query?.slug || ''}`,
        type: 'article'
      }
      }
    case '/join':
      return {
        title: pageTitle || `加入社区 | ${TITLE}`,
        description: pageDescription || '提交加入意向和成员资料草稿，和 IGNAI 社区建立第一层连接。',
        image: `${siteInfo?.pageCover}`,
        slug: 'join',
        type: 'website'
      }
    case '/about':
      return {
        title: pageTitle || `关于 | ${TITLE}`,
        description: pageDescription || DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'about',
        type: 'website'
      }
    case '/manage':
    case '/manage/content':
    case '/manage/join':
    case '/manage/members':
      return {
        title: pageTitle || `运营后台 | ${TITLE}`,
        description: 'IGNAI 社区运营后台。',
        image: `${siteInfo?.pageCover}`,
        slug: router?.asPath || 'manage',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${TITLE}`,
        description: TITLE,
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${TITLE} | ${locale.NAV.PAGE_NOT_FOUND}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: '404',
        type: 'website'
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${TITLE}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${TITLE}`,
        description: DESCRIPTION,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${post?.title} | ${TITLE}`
          : TITLE,
        description: post?.summary || DESCRIPTION,
        type: post?.type || 'website',
        slug: post?.slug || '',
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default SEO
