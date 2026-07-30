import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

import { AboutStorySection, type AboutStoryData, defaultAboutStory } from '@/components/AboutStory'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { SiteNav } from '@/components/SiteNav'
import { fallbackSettings, getDocumentBySlug, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-dynamic'

function getAboutStory(pageLayout: unknown): AboutStoryData {
  if (!Array.isArray(pageLayout)) return defaultAboutStory
  return (pageLayout.find((block) => block?.blockType === 'aboutStory') as AboutStoryData | undefined) || defaultAboutStory
}

async function getAboutPage() {
  const { isEnabled: draft } = await draftMode()
  const page = await getDocumentBySlug('pages', 'about', draft)
  return { draft, page, story: getAboutStory(page?.layout) }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getAboutPage()
  return {
    description:
      page?.excerpt ||
      'IGNAI 是一个从长沙出发的青年 AI 社区。我们让活动之后的人继续相遇，让想法有下一次行动。',
    title: page?.title || '关于 IGNAI',
  }
}

export default async function AboutPage() {
  const [{ draft, story }, settingsResult] = await Promise.all([
    getAboutPage(),
    getSiteSettings().catch(() => fallbackSettings),
  ])

  return (
    <>
      <SiteNav items={settingsResult.navigation?.length ? settingsResult.navigation : fallbackSettings.navigation} />
      {draft ? <LivePreviewListener /> : null}
      <AboutStorySection story={story} />
    </>
  )
}
