import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import {
  fetchEventsFromOfficialAPI,
  fetchGlobalAllData,
  fetchMembersFromOfficialAPI,
  getPostBlocks,
  getMembersForScatter
} from '@/lib/db/SiteDataApi'
import { generateRss } from '@/lib/utils/rss'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'
import { normalizeEventList } from '@/lib/utils/event'
import pLimit from 'p-limit'
import { mergeFixturePosts } from '@/lib/dev/contentFixtures'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

function getHomeArticlePosts(posts = [], limit = 4) {
  return posts
    .filter(Boolean)
    .slice(0, limit)
    .map(post => ({
      id: post.id ?? null,
      title: post.title ?? null,
      slug: post.slug ?? null,
      status: post.status ?? null,
      password: post.password ?? null,
      href: post.href ?? null,
      summary: post.summary ?? null,
      category: post.category ?? null,
      tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
      publishDay: post.publishDay ?? null,
      publishDate: post.publishDate ?? null,
      lastEditedDate: post.lastEditedDate ?? null,
      pageCover: post.pageCover ?? null,
      pageCoverThumbnail: post.pageCoverThumbnail ?? null,
      author: post.author ?? null,
      authors: Array.isArray(post.authors)
        ? post.authors.map(author => ({
            id: author.id ?? null,
            title: author.title ?? null,
            slug: author.slug ?? null,
            href: author.href ?? null,
            role: author.role ?? null
          }))
        : []
    }))
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await fetchGlobalAllData({ from, locale })
  const [freshMembers, freshEvents] = await Promise.all([
    fetchMembersFromOfficialAPI(),
    fetchEventsFromOfficialAPI()
  ])
  if (freshMembers.length > 0) {
    props.allMembers = freshMembers
  }
  if (freshEvents.length > 0) {
    props.allEvents = freshEvents
  }
  // 首页只序列化 Notion 中已发布的活动；不再混入仓库里的示例数据。
  props.allEvents = normalizeEventList(props.allEvents || [])
  if (process.env.NODE_ENV === 'development') {
    const configTheme = BLOG.THEME
    const notionTheme = props?.NOTION_CONFIG?.THEME || null
    const finalTheme = siteConfig('THEME', BLOG.THEME, props?.NOTION_CONFIG)
    const source = notionTheme ? 'notion:config' : 'blog/env:config'
    console.log(
      '[ThemeResolver][server-static-props]',
      JSON.stringify({
        route: '/',
        configTheme,
        notionTheme,
        finalTheme,
        source
      })
    )
  }
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    8,
    props?.NOTION_CONFIG
  )
  const POST_PREVIEW_MAX_COUNT = siteConfig(
    'POST_PREVIEW_MAX_COUNT',
    4,
    props?.NOTION_CONFIG
  )
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  props.posts = mergeFixturePosts(props.posts)

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    const previewLimit = pLimit(
      siteConfig('POST_PREVIEW_CONCURRENCY', 5, props?.NOTION_CONFIG)
    )
    const previewTargets = props.posts
      .filter(post => !post.password || post.password === '')
      .slice(0, POST_PREVIEW_MAX_COUNT)
    await Promise.all(
      previewTargets.map(post =>
        previewLimit(async () => {
          post.blockMap = await getPostBlocks(
            post.id,
            'slug',
            POST_PREVIEW_LINES
          )
        })
      )
    )
  }
  props.latestPosts = getHomeArticlePosts(
    props.posts,
    siteConfig('IGNAI_ARTICLES_HOME_COUNT', 4, props?.NOTION_CONFIG)
  )

  const isBuildLifecycle = ['build', 'export'].includes(
    process.env.npm_lifecycle_event
  )
  if (isBuildLifecycle) {
    // 生成Feed订阅
    await generateRss(props)
    // 检查数据是否需要从algolia删除
    checkDataFromAlgolia(props)
    if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
      // 生成重定向 JSON
      generateRedirectJson(props)
    }
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  // 首页散点展示只需要极简成员数据（7 个字段 vs 18 个）
  if (props.allMembers) {
    props.allMembers = getMembersForScatter({ allMembers: props.allMembers })
  }
  delete props.allPages
  delete props.posts
  delete props.allNavPages
  delete props.notice
  delete props.customMenu
  delete props.customNav
  delete props.tagOptions
  delete props.categoryOptions
  delete props.postCount

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : Math.min(
          Number(
            siteConfig(
              'NEXT_REVALIDATE_SECOND',
              BLOG.NEXT_REVALIDATE_SECOND,
              props.NOTION_CONFIG
            )
          ) || 600,
          60
        )
  }
}

export default Index
