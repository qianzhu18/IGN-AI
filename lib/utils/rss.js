import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import { getPostBlocks } from '@/lib/db/SiteDataApi'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { Feed } from 'feed'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

const RSS_OUTPUT_DIR = './public/rss'
const RSS_FEED_PATH = `${RSS_OUTPUT_DIR}/feed.xml`
const RSS_ATOM_PATH = `${RSS_OUTPUT_DIR}/atom.xml`
const RSS_JSON_PATH = `${RSS_OUTPUT_DIR}/feed.json`
const RSS_LEGACY_PATH = './public/rss.xml'

/**
 * 生成RSS内容
 * @param {*} post
 * @returns
 */
const createFeedContent = async post => {
  // 加密的文章内容只返回摘要
  if (post.password && post.password !== '') {
    return post.summary
  }
  const blockMap = await getPostBlocks(post.id, 'rss-content')
  if (blockMap) {
    post.blockMap = blockMap
    // Notion修改了数据格式再次做统一兼容
    post.blockMap = adapterNotionBlockMap(post.blockMap)
    // 格式化内容，部分的样式字段格式在此处理
    if (post.blockMap?.block) {
      post.blockMap.block = formatNotionBlock(post.blockMap.block)
    }

    const content = ReactDOMServer.renderToString(<NotionPage post={post} />)
    const regexExp =
      /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
    return content.replace(regexExp, '')
  }
}

/**
 * 生成RSS数据
 * @param {*} props
 */
export async function generateRss(props) {
  const { NOTION_CONFIG, siteInfo, latestPosts } = props
  const TITLE = siteInfo?.title || NOTION_CONFIG?.TITLE || BLOG.TITLE
  const DESCRIPTION =
    siteInfo?.description || NOTION_CONFIG?.DESCRIPTION || BLOG.DESCRIPTION
  const LINK = normalizeSiteRoot(
    siteInfo?.link || NOTION_CONFIG?.LINK || BLOG.LINK,
    NOTION_CONFIG?.SUB_PATH || BLOG.SUB_PATH
  )
  const AUTHOR = NOTION_CONFIG?.AUTHOR || BLOG.AUTHOR
  const LANG = NOTION_CONFIG?.LANG || BLOG.LANG
  const CONTACT_EMAIL = decryptEmail(
    NOTION_CONFIG?.CONTACT_EMAIL || BLOG.CONTACT_EMAIL
  )
  const posts = Array.isArray(latestPosts) ? latestPosts : []

  // 检查 feed 文件是否在10分钟内更新过
  if (isFeedRecentlyUpdated(RSS_FEED_PATH, 10)) {
    return
  }

  console.log('[RSS订阅] 生成/rss/feed.xml')
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: TITLE,
    description: DESCRIPTION,
    link: LINK,
    language: LANG,
    favicon: `${LINK}/favicon.png`,
    copyright: `All rights reserved ${year}, ${AUTHOR}`,
    author: {
      name: AUTHOR,
      email: CONTACT_EMAIL,
      link: LINK
    }
  })
  for (const post of posts) {
    if (!post?.title || !post?.slug || post?.status !== BLOG.NOTION_PROPERTY_NAME.status_publish) {
      continue
    }
    feed.addItem({
      title: post.title,
      link: `${LINK}/${post.slug}`,
      description: post.summary,
      content: await createFeedContent(post),
      date: new Date(post?.publishDay)
    })
  }

  try {
    const rssXml = feed.rss2()
    fs.mkdirSync(RSS_OUTPUT_DIR, { recursive: true })
    fs.writeFileSync(RSS_FEED_PATH, rssXml)
    fs.writeFileSync(RSS_LEGACY_PATH, rssXml)
    fs.writeFileSync(RSS_ATOM_PATH, feed.atom1())
    fs.writeFileSync(RSS_JSON_PATH, feed.json1())
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
    // RSS被高频词访问将大量消耗服务端资源，故作为静态文件
  }
}

/**
 * 检查上次更新，如果60分钟内更新过就不操作。
 * @param {*} filePath
 * @param {*} intervalMinutes
 * @returns
 */
function isFeedRecentlyUpdated(filePath, intervalMinutes = 60) {
  try {
    const stats = fs.statSync(filePath)
    const now = new Date()
    const lastModified = new Date(stats.mtime)
    const timeDifference = (now - lastModified) / (1000 * 60) // 转换为分钟
    return timeDifference < intervalMinutes
  } catch (error) {
    // 如果文件不存在，我们需要创建它
    return false
  }
}

function normalizeSiteRoot(link, subPath) {
  const baseLink = `${link || ''}`.replace(/\/+$/, '')
  const normalizedSubPath = `${subPath || ''}`
    .split('/')
    .filter(Boolean)
    .join('/')

  return normalizedSubPath
    ? `${baseLink}/${normalizedSubPath}`
    : baseLink
}
