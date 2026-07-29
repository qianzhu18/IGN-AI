import { describe, expect, it } from 'vitest'

import { resolveEnvironment } from './env'

const validEnvironment = {
  DATABASE_URL: 'postgres://ignai:ignai@localhost:5432/ignai',
  NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
  PAYLOAD_SECRET: 'payload-secret-with-more-than-32-characters',
  PREVIEW_SECRET: 'preview-secret-with-more-than-32-characters',
}

describe('resolveEnvironment', () => {
  it('accepts the required local configuration without object storage', () => {
    const environment = resolveEnvironment(validEnvironment)
    expect(environment.hasR2).toBe(false)
    expect(environment.serverURL).toBe('http://localhost:3000')
  })

  it('rejects missing required secrets', () => {
    expect(() => resolveEnvironment({ ...validEnvironment, PAYLOAD_SECRET: '' })).toThrow(
      'Missing required environment variable: PAYLOAD_SECRET',
    )
  })

  it('rejects partial R2 credentials', () => {
    expect(() => resolveEnvironment({ ...validEnvironment, R2_BUCKET: 'ignai-media' })).toThrow(
      'R2 configuration is incomplete',
    )
  })

  it('accepts a complete R2 configuration', () => {
    const environment = resolveEnvironment({
      ...validEnvironment,
      R2_ACCESS_KEY_ID: 'access',
      R2_BUCKET: 'ignai-media',
      R2_ENDPOINT: 'https://example.r2.cloudflarestorage.com',
      R2_PUBLIC_URL: 'https://media.example.com',
      R2_SECRET_ACCESS_KEY: 'secret',
    })
    expect(environment.hasR2).toBe(true)
    expect(environment.r2.bucket).toBe('ignai-media')
  })
})
