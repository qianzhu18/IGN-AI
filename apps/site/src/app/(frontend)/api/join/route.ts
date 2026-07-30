import { createHash } from 'node:crypto'

import config from '@payload-config'
import { getPayload } from 'payload'

const MAX_BODY_LENGTH = 16_000
const recentSubmissions = new Map<string, number>()
const MIN_INTERVAL_MS = 60_000

const text = (value: unknown, maximum: number) =>
  typeof value === 'string' ? value.trim().slice(0, maximum) : ''

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY_LENGTH) return Response.json({ message: '提交内容过长。' }, { status: 413 })

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ message: '请求格式不正确。' }, { status: 400 })
  }

  if (text(body.company, 80)) return Response.json({ message: '已收到。' }, { status: 201 })
  const name = text(body.name, 80)
  const contact = text(body.contact, 180)
  const role = text(body.role, 160)
  const message = text(body.message, 2000)
  const interests = text(body.interests, 300)
    .split(/[，,]/)
    .map((label) => label.trim())
    .filter(Boolean)
    .slice(0, 12)

  if (!name || !contact || !role || !message) {
    return Response.json({ message: '请完成姓名、联系方式、身份和申请说明。' }, { status: 400 })
  }

  const forwarded = request.headers.get('x-forwarded-for') || 'local'
  const key = `${forwarded}:${contact.toLowerCase()}`
  const now = Date.now()
  if ((recentSubmissions.get(key) || 0) + MIN_INTERVAL_MS > now) {
    return Response.json({ message: '请稍后再试，避免重复提交。' }, { status: 429 })
  }

  const dedupeKey = createHash('sha256')
    .update(`${contact.toLowerCase()}:${new Date().toISOString().slice(0, 10)}`)
    .digest('hex')

  try {
    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'join-submissions',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { dedupeKey: { equals: dedupeKey } },
    })
    if (existing.docs.length) return Response.json({ message: '今天已经收到过这份申请。' }, { status: 200 })
    await payload.create({
      collection: 'join-submissions',
      data: {
        contact,
        dedupeKey,
        interests: interests.map((label) => ({ label })),
        message,
        name,
        role,
        source: 'website',
        status: 'submitted',
      },
      draft: false,
      overrideAccess: true,
    })
    recentSubmissions.set(key, now)
    return Response.json({ message: '已收到。我们会在后台跟进这份申请。' }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ''
    if (errorMessage.includes('dedupe')) return Response.json({ message: '今天已经收到过这份申请。' }, { status: 200 })
    return Response.json({ message: '暂时无法提交，请稍后重试。' }, { status: 500 })
  }
}
