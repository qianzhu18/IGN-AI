import Head from 'next/head'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import MemberDirectoryPage from '@/src/components/members/MemberDirectoryPage'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import { getPublishedMembers, sortMembers } from '@/lib/utils/member'

const MembersIndexPage = props => {
  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
        <meta name='description' content={props.pageDescription} />
      </Head>
      <MemberDirectoryPage {...props} />
    </>
  )
}

export async function getStaticProps({ locale }) {
  const from = 'members-index'
  const props = await fetchGlobalAllData({ from, locale })
  const members = sortMembers(getPublishedMembers(props.allMembers || []))
  const pageTitle = `${props.siteInfo?.title || 'Community'} Members`
  const pageDescription =
    props.siteInfo?.description || 'Community member directory'

  delete props.allPages
  delete props.allMembers
  delete props.latestPosts
  delete props.allNavPages

  return {
    props: {
      ...props,
      members,
      pageTitle,
      pageDescription
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

export default MembersIndexPage
