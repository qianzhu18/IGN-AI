import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 搜索路由
 * @param {*} props
 * @returns
 */
const Search = props => {
  const { posts } = props

  const router = useRouter()
  const keyword = router?.query?.s

  let filteredPosts
  // 静态过滤
  if (keyword) {
    filteredPosts = posts.filter(post => {
      const tagContent = Array.isArray(post?.tags) ? post.tags.join(' ') : ''
      const categoryContent = Array.isArray(post?.category)
        ? post.category.join(' ')
        : post?.category || ''
      const searchContent =
        post.title + post.summary + tagContent + categoryContent
      return searchContent.toLowerCase().includes(keyword.toLowerCase())
    })
  } else {
    filteredPosts = []
  }

  props = { ...props, posts: filteredPosts }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

function getSearchablePost(post) {
  return {
    id: post.id ?? null,
    title: post.title ?? null,
    slug: post.slug ?? null,
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
  }
}

/**
 * 浏览器前端搜索
 */
export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({
    from: 'search-props',
    locale
  })
  const { allPages } = props
  props.posts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  ).map(getSearchablePost)
  delete props.allPages
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Search
