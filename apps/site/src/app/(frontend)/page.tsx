import Link from 'next/link'

import { EventCard } from '@/components/EventCard'
import { SignalField } from '@/components/SignalField'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getPublishedEvents, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [settingsResult, eventsResult] = await Promise.allSettled([
    getSiteSettings(),
    getPublishedEvents(6),
  ])

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings
  const events = eventsResult.status === 'fulfilled' ? eventsResult.value : []
  const navigation = settings.navigation?.length ? settings.navigation : fallbackSettings.navigation
  const primaryCTA = settings.primaryCTA?.href ? settings.primaryCTA : fallbackSettings.primaryCTA

  return (
    <main>
      <SiteNav items={navigation} />

      <section className="hero-marquee">
        <SignalField />
        <div className="hero-marquee__meta">
          <span>Changsha · Hunan</span>
          <span>Community signal / 2026</span>
        </div>
        <h1>{settings.heroStatement || fallbackSettings.heroStatement}</h1>
        <p aria-hidden="true" className="hero-marquee__scroll">
          向下看见现场
        </p>
      </section>

      <section className="proof-intro">
        <div>
          <p className="proof-intro__kicker">不是围观 AI，是一起做事。</p>
          <p className="proof-intro__body">{settings.intro || fallbackSettings.intro}</p>
        </div>
        <a className="primary-action" href={primaryCTA.href || fallbackSettings.primaryCTA.href}>
          {primaryCTA.label || fallbackSettings.primaryCTA.label}
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="event-stack" id="events">
        <div className="event-stack__intro">
          <p className="section-label">Recent field notes</p>
          <h2>活动不是栏目，是社区正在发生的证据。</h2>
          <p>
            从第一次见面、一次分享，到下一次共同发起。后台里的每一条 Event，都会成为这里的一段真实现场。
          </p>
          <div className="event-count" aria-label={`当前展示 ${events.length} 场已发布活动`}>
            <strong>{events.length || '—'}</strong>
            <span>场已发布活动</span>
          </div>
        </div>

        <div className="event-stack__list">
          {events.length ? (
            events.map((event, index) => <EventCard event={event} index={index} key={event.id} />)
          ) : (
            <div className="empty-proof">
              <span aria-hidden="true">等待第一束信号</span>
              <h3>后台已经准备好。</h3>
              <p>创建并发布第一场 Event 后，它会自动出现在这里，不再需要维护 Notion 字段映射。</p>
              <Link className="text-link" href="/admin/collections/events/create">
                创建活动草稿 →
              </Link>
            </div>
          )}
        </div>
      </section>

      <footer className="statement-footer">
        <p>下一次真实相遇，从一束信号开始。</p>
        <div>
          <span className="wordmark">IGN AI</span>
          <span>长沙 · 开放协作 · 持续发生</span>
        </div>
      </footer>
    </main>
  )
}
