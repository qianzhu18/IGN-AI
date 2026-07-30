import type { Metadata } from 'next'

import { JoinForm } from '@/components/JoinForm'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getSiteSettings } from '@/lib/content'

export const metadata: Metadata = { description: '提交 IGNAI 社区加入申请。', title: '加入社区' }

export default async function JoinPage() {
  const settings = await getSiteSettings().catch(() => fallbackSettings)
  return (
    <main>
      <SiteNav items={settings.navigation?.length ? settings.navigation : fallbackSettings.navigation} />
      <section className="join-page">
        <div className="join-page__intro"><p className="section-label">Join IGNAI</p><h1>想做点真的，就来一起做。</h1><p>这份申请会直接进入运营后台。我们不会公开你的联系方式，也不会用它做营销。</p></div>
        <JoinForm />
      </section>
    </main>
  )
}
