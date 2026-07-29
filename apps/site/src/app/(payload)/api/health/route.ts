import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.count({
      collection: 'users',
      overrideAccess: true,
    })

    return Response.json({
      checks: {
        database: 'ok',
        payload: 'ok',
      },
      status: 'ok',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown health check error'
    return Response.json(
      {
        checks: {
          database: 'error',
          payload: 'error',
        },
        error: message,
        status: 'error',
      },
      { status: 503 },
    )
  }
}
