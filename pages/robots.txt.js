import BLOG from '@/blog.config'

export function getServerSideProps({ res }) {
  const siteUrl = (BLOG.LINK || 'https://www.yanglaishe.cn').replace(/\/+$/, '')
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /manage',
    'Disallow: /dashboard',
    'Disallow: /auth',
    'Disallow: /sign-in',
    'Disallow: /sign-up',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ''
  ].join('\n')

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59')
  res.write(body)
  res.end()

  return {
    props: {}
  }
}

export default function RobotsTxt() {
  return null
}
