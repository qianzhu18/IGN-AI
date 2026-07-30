import type { Metadata } from 'next'

import { ContentCard } from '@/components/ContentCard'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getPublishedDocuments, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description: '认识正在构成 IGNAI 的社区成员。',
  title: '成员',
}

export default async function MembersPage() {
  const [settingsResult, membersResult] = await Promise.allSettled([
    getSiteSettings(),
    getPublishedDocuments('members', 100),
  ])
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings
  const members = membersResult.status === 'fulfilled' ? membersResult.value : []

  return (
    <main>
      <SiteNav items={settings.navigation?.length ? settings.navigation : fallbackSettings.navigation} />
      <header className="page-heading">
        <p>Members / IGNAI</p>
        <h1>一起把想法带到现场的人。</h1>
        <span>{members.length ? `${members.length} 位已发布成员` : '成员资料正在整理中'}</span>
      </header>
      <section className="content-index">
        {members.length ? (
          members.map((member, index) => <ContentCard collection="members" document={member} index={index} key={member.id} />)
        ) : (
          <div className="empty-proof">
            <span aria-hidden="true">MEMBERS / PENDING</span>
            <h3>成员资料正在整理。</h3>
            <p>编辑者发布第一位成员后，资料会从后台直接出现于此。</p>
          </div>
        )}
      </section>
    </main>
  )
}
