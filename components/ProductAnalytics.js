import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com'
const DEFAULT_POSTHOG_UI_HOST = 'https://us.posthog.com'

function normalizeBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'boolean') return value
  return !['false', '0', 'off', 'no'].includes(String(value).toLowerCase())
}

function getTextPreview(element) {
  if (!element?.textContent) return ''
  return element.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)
}

function readDatasetProperties(element) {
  const properties = {}

  Object.entries(element?.dataset || {}).forEach(([key, value]) => {
    if (!key.startsWith('analyticsProp')) return
    const propName = key
      .replace(/^analyticsProp/, '')
      .replace(/^[A-Z]/, char => char.toLowerCase())
    if (propName && value) properties[propName] = value
  })

  return properties
}

function capturePostHogEvent(eventName, properties = {}) {
  if (typeof window === 'undefined') return
  window.posthog?.capture?.(eventName, {
    site: 'ignai',
    ...properties
  })
}

export default function ProductAnalytics({ NOTION_CONFIG }) {
  const router = useRouter()
  const posthogKey = siteConfig('POSTHOG_KEY', '', NOTION_CONFIG)
  const posthogHost = siteConfig(
    'POSTHOG_HOST',
    DEFAULT_POSTHOG_HOST,
    NOTION_CONFIG
  )
  const posthogUiHost = siteConfig(
    'POSTHOG_UI_HOST',
    DEFAULT_POSTHOG_UI_HOST,
    NOTION_CONFIG
  )
  const capturePageview = normalizeBoolean(
    siteConfig('POSTHOG_CAPTURE_PAGEVIEW', true, NOTION_CONFIG),
    true
  )
  const autocapture = normalizeBoolean(
    siteConfig('POSTHOG_AUTOCAPTURE', true, NOTION_CONFIG),
    true
  )
  const enableSessionRecording = normalizeBoolean(
    siteConfig('POSTHOG_SESSION_RECORDING', false, NOTION_CONFIG),
    false
  )

  useEffect(() => {
    if (!posthogKey || typeof window === 'undefined') return

    let mounted = true

    import('posthog-js').then(({ default: posthog }) => {
      if (!mounted || window.__ignaiPostHogInitialized) return
      window.__ignaiPostHogInitialized = true

      posthog.init(posthogKey, {
        api_host: posthogHost || DEFAULT_POSTHOG_HOST,
        ui_host: posthogUiHost || DEFAULT_POSTHOG_UI_HOST,
        autocapture,
        capture_pageview: false,
        capture_pageleave: true,
        disable_session_recording: !enableSessionRecording,
        person_profiles: 'identified_only',
        loaded: instance => {
          window.posthog = instance
          window.ignaiAnalyticsCapture = capturePostHogEvent

          if (capturePageview) {
            capturePostHogEvent('$pageview', {
              $current_url: window.location.href,
              path: window.location.pathname,
              title: document.title
            })
          }
        }
      })
    })

    return () => {
      mounted = false
    }
  }, [
    autocapture,
    capturePageview,
    enableSessionRecording,
    posthogHost,
    posthogKey,
    posthogUiHost
  ])

  useEffect(() => {
    if (!posthogKey || !capturePageview) return

    const handleRouteChange = url => {
      capturePostHogEvent('$pageview', {
        $current_url: window.location.href,
        path: url,
        title: document.title
      })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [capturePageview, posthogKey, router.events])

  useEffect(() => {
    if (!posthogKey || typeof document === 'undefined') return

    const handleClick = event => {
      const target = event.target?.closest?.('[data-analytics-event]')
      if (!target) return

      capturePostHogEvent(target.dataset.analyticsEvent, {
        label:
          target.dataset.analyticsLabel ||
          target.getAttribute('aria-label') ||
          getTextPreview(target),
        href: target.getAttribute('href') || '',
        path: window.location.pathname,
        ...readDatasetProperties(target)
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [posthogKey])

  return null
}
