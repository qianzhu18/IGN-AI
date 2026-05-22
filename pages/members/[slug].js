import Head from 'next/head'
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import {
  fetchGlobalAllData,
  resolvePostProps
} from '@/lib/db/SiteDataApi'
import MemberProfilePage from '@/src/components/members/MemberProfilePage'
import {
  getMemberAuthoredPosts,
  resolveAuthorsForPost
} from '@/lib/utils/post'
import { extractMemberPathSlug as extractMemberSlug } from '@/lib/utils/member'

const MemberProfileRoute = props => {
  const member = props.member || props.post
  const title = member?.title
    ? `${member.title} | ${props.siteInfo?.title || 'Community'}`
    : `${props.siteInfo?.title || 'Community'} Member`
  const description = member?.bio || member?.summary || props.siteInfo?.description || ''

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
  let props = await resolvePostProps({
    prefix: 'members',
    slug,
    locale,
    from: 'member-profile'
  })

  let member = props.post?.type === 'Member' ? props.post : null
  let authoredPosts = []
  let relatedSiteProps = null

  if (!member) {
    const siteProps = await fetchGlobalAllData({
      from: 'member-profile-fallback',
      locale
    })
    relatedSiteProps = siteProps
    member = (siteProps.allMembers || []).find(candidate => {
      const candidateSlug = extractMemberSlug(candidate?.slug, candidate?.id)
      return candidateSlug === slug
    }) || null
    props = {
      ...siteProps,
      post: member
    }
  }

  if (!member || member.type !== 'Member') {
    return {
      notFound: true,
      revalidate: process.env.EXPORT
        ? undefined
        : BLOG.NEXT_REVALIDATE_SECOND
    }
  }

  if (!relatedSiteProps) {
    relatedSiteProps = await fetchGlobalAllData({
      from: 'member-profile-related-posts',
      locale
    })
  }

  authoredPosts = (relatedSiteProps.allPages || []).map(post => ({
    ...post,
    authors: resolveAuthorsForPost(post, relatedSiteProps.allMembers || [])
  }))
  authoredPosts = getMemberAuthoredPosts(member, authoredPosts)
    .sort((a, b) => (b?.publishDate ?? 0) - (a?.publishDate ?? 0))
    .slice(0, 6)

  delete props.allPages
  delete props.allMembers
  delete props.latestPosts
  delete props.allNavPages

  return {
    props: {
      ...props,
      member,
      authoredPosts
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
