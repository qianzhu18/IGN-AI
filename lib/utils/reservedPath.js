const RESERVED_PREFIXES = new Set([
  '_next',
  'api',
  'static',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'rss.xml',
  'feed'
])

export function isReservedPathSegment(value) {
  if (typeof value !== 'string') return false
  const segment = value.trim()
  if (!segment) return false
  if (RESERVED_PREFIXES.has(segment)) return true
  if (segment.startsWith('_')) return true
  return /\.[a-z0-9]{1,12}$/i.test(segment)
}

export function hasReservedPathSegment(...segments) {
  return segments.flat().filter(Boolean).some(isReservedPathSegment)
}
