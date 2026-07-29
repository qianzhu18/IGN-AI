import type { Metadata } from 'next'

import { EventCard } from '@/components/EventCard'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getPublishedEvents, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description: 'IGNAI 已发布和即将发生的社区活动。',
  title: '活动',
}

export default async function EventsPage() {
  const [settingsResult, eventsResult] = await Promise.allSettled([
    getSiteSettings(),
    getPublishedEvents(50),
  ])
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings
  const events = eventsResult.status === 'fulfilled' ? eventsResult.value : []

  return (
    <main>
      <SiteNav items={settings.navigation?.length ? settings.navigation : fallbackSettings.navigation} />
      <header className="page-heading">
        <p>Events / Changsha</p>
        <h1>我们在现场见。</h1>
        <span>{events.length ? `${events.length} 场已发布活动` : '第一场活动正在准备中'}</span>
      </header>
      <section className="event-index">
        {events.map((event, index) => (
          <EventCard event={event} index={index} key={event.id} />
        ))}
      </section>
    </main>
  )
}
