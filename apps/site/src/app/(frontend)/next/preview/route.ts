import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayload, type PayloadRequest } from 'payload'

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (!path || !path.startsWith('/')) return new Response('Invalid preview path', { status: 400 })
  if (!process.env.PREVIEW_SECRET || previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('Preview access denied', { status: 403 })
  }

  let user
  try {
    user = await payload.auth({ headers: req.headers, req: req as unknown as PayloadRequest })
  } catch (error) {
    payload.logger.error({ err: error }, 'Preview authentication failed')
    return new Response('Preview access denied', { status: 403 })
  }

  if (!user) return new Response('Preview access denied', { status: 403 })
  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
