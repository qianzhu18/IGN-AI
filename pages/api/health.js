import BLOG from '@/blog.config'

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  const payload = {
    ok: true,
    service: 'ignai-web',
    site: BLOG.TITLE || 'IGNAI',
    version: process.env.NEXT_PUBLIC_VERSION || null,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || null,
    checkedAt: new Date().toISOString()
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0')

  if (req.method === 'HEAD') {
    return res.status(200).end()
  }

  return res.status(200).json(payload)
}
