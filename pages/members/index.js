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
  const pageTitle = 'IGNAI 成员目录'
  const pageDescription =
    '连接本地 AI 行动者、组织者、创作者和开源贡献者。'

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
