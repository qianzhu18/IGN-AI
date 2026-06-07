import Head from 'next/head'
import {
  fetchGlobalAllData,
  fetchMembersFromOfficialAPI,
  getMembersForDirectory
} from '@/lib/db/SiteDataApi'
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
  const freshMembers = await fetchMembersFromOfficialAPI()
  const allMembers = freshMembers.length > 0 ? freshMembers : props.allMembers || []
  const members = getMembersForDirectory({
    allMembers: sortMembers(getPublishedMembers(allMembers))
  })
  const pageTitle = 'IGNAI 成员目录'
  const pageDescription =
    '连接本地 AI 行动者、组织者、创作者和开源贡献者。'

  delete props.allPages
  delete props.allMembers
  delete props.allEvents
  delete props.latestPosts
  delete props.allNavPages
  delete props.notice
  delete props.customMenu
  delete props.customNav
  delete props.tagOptions
  delete props.categoryOptions
  delete props.postCount

  return {
    props: {
      ...props,
      members,
      pageTitle,
      pageDescription
    },
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

export default MembersIndexPage
