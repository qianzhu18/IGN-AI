import Head from 'next/head'
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import MemberProfilePage from '@/src/components/members/MemberProfilePage'
import {
  getMemberAuthoredPosts,
  resolveAuthorsForPost
} from '@/lib/utils/post'
import { extractMemberPathSlug as extractMemberSlug } from '@/lib/utils/member'

function getPublicMemberDescription(member) {
  const summary = typeof member?.summary === 'string' ? member.summary.trim() : ''
  if (summary) return summary

  const bio = typeof member?.bio === 'string' ? member.bio : ''
  const body = bio
    .split(/\n{2,}/)
    .map(item => item.trim())
    .filter(Boolean)
    .filter(item => !/^(兴趣方向|联系方式|小红书|来源|提交时间|提交日期)：/.test(item))
    .join(' ')
    .trim()

  return body || '连接本地 AI 行动者、组织者、创作者和开源贡献者。'
}

const MemberProfileRoute = props => {
  const member = props.member || props.post
  const title = member?.title
    ? `${member.title} | IGNAI`
    : 'IGNAI Member'
  const description = getPublicMemberDescription(member)

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Head>
      <MemberProfilePage {...props} member={member} authoredPosts={props.authoredPosts} />
    </>
  )
}

export async function getStaticPaths() {
  if (!process.env.EXPORT) {
    return {
      paths: [],
      fallback: 'blocking'
    }
  }

  const { allMembers } = await fetchGlobalAllData({ from: 'member-profile-paths' })

  return {
    paths: (allMembers || []).map(member => ({
      params: {
        slug: extractMemberSlug(member?.slug, member?.id)
      }
    })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { slug }, locale }) {
  const props = await fetchGlobalAllData({
    from: 'member-profile',
    locale
  })
  const member = (props.allMembers || []).find(candidate => {
    const candidateSlug = extractMemberSlug(candidate?.slug, candidate?.id)
    return candidateSlug === slug
  }) || null

  if (!member || member.type !== 'Member') {
    return {
      notFound: true,
      revalidate: process.env.EXPORT
        ? undefined
        : BLOG.NEXT_REVALIDATE_SECOND
    }
  }

  const authoredPosts = (props.allPages || [])
    .filter(post => post?.type === 'Post' && post?.status === 'Published')
    .map(post => ({
      ...post,
      authors: resolveAuthorsForPost(post, [member])
    }))

  const relatedPosts = getMemberAuthoredPosts(member, authoredPosts)
    .sort((a, b) => (b?.publishDate ?? 0) - (a?.publishDate ?? 0))
    .slice(0, 6)

  delete props.allPages
  delete props.allMembers
  delete props.allEvents
  delete props.latestPosts
  delete props.allNavPages
  delete props.notice

  return {
    props: {
      ...props,
      member,
      authoredPosts: relatedPosts
    },
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default MemberProfileRoute
