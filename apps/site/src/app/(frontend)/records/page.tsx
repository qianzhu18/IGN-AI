import type { Metadata } from 'next'

import { ContentCard } from '@/components/ContentCard'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getPublishedDocuments, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { description: 'IGNAI 的活动现场、社区故事与行动记录。', title: '记录' }

export default async function RecordsPage() {
  const [settingsResult, recordsResult] = await Promise.allSettled([getSiteSettings(), getPublishedDocuments('records', 100)])
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings
  const records = recordsResult.status === 'fulfilled' ? recordsResult.value : []
  return (
    <main>
      <SiteNav items={settings.navigation?.length ? settings.navigation : fallbackSettings.navigation} />
      <header className="page-heading"><p>Field notes / IGNAI</p><h1>留下那些真实发生过的事。</h1><span>{records.length ? `${records.length} 条已发布记录` : '记录正在归档中'}</span></header>
      <section className="content-index">
        {records.map((record, index) => <ContentCard collection="records" document={record} index={index} key={record.id} />)}
      </section>
    </main>
  )
}
