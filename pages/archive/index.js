import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { DynamicLayout } from '@/themes/theme'
import { useEffect } from 'react'
import { mergeFixturePosts } from '@/lib/dev/contentFixtures'
import { fetchPublishedPostsFromOfficialAPI } from '@/lib/db/notion/postDataSource'

/**
 * 归档首页
 * @param {*} props
 * @returns
 */
const ArchiveIndex = props => {
  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1))
          if (anchorElement) {
            anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, [])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutArchive' {...props} />
}

export async function getServerSideProps({ res }) {
  const officialPosts = await fetchPublishedPostsFromOfficialAPI()
  // Query at request time so a temporary Notion failure during a deployment
  // cannot publish an empty article index for the full ISR window.
  if (Array.isArray(officialPosts)) {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
  }
  // The official source is authoritative when configured. In particular, it
  // keeps Articles available when Notion's legacy collection view returns 403.
  const props = {
    NOTION_CONFIG: {},
    allPages: [],
    allMembers: [],
    allEvents: [],
    allRecords: [],
    customMenu: [],
    tagOptions: [],
    categoryOptions: [],
    posts: Array.isArray(officialPosts) ? officialPosts : []
  }
  props.posts = mergeFixturePosts(props.posts || [])
  const postsSortByDate = [...props.posts]

  postsSortByDate.sort((a, b) => {
    return b?.publishDate - a?.publishDate
  })

  const archivePosts = {}

  postsSortByDate.forEach(post => {
    const date = formatDateFmt(post.publishDate, 'yyyy-MM')
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })

  props.archivePosts = archivePosts
  return { props }
}

export default ArchiveIndex
