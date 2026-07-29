const r2Keys = [
  'R2_BUCKET',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT',
  'R2_PUBLIC_URL',
] as const

const optionalBoolean = (value: string | undefined, key: string, defaultValue: boolean) => {
  if (!value?.trim()) return defaultValue
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`${key} must be either true or false`)
}

type Environment = Record<string, string | undefined>
type RequiredKey = 'DATABASE_URL' | 'PAYLOAD_SECRET' | 'PREVIEW_SECRET'

const readRequired = (source: Environment, key: RequiredKey) => {
  const value = source[key]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export function resolveEnvironment(source: Environment = process.env) {
  const databaseURL = readRequired(source, 'DATABASE_URL')
  const payloadSecret = readRequired(source, 'PAYLOAD_SECRET')
  const previewSecret = readRequired(source, 'PREVIEW_SECRET')
  const serverURL = source.NEXT_PUBLIC_SERVER_URL?.trim() || 'http://localhost:3000'

  if (payloadSecret.length < 32) {
    throw new Error('PAYLOAD_SECRET must be at least 32 characters')
  }
  if (previewSecret.length < 32) {
    throw new Error('PREVIEW_SECRET must be at least 32 characters')
  }

  try {
    new URL(databaseURL)
  } catch {
    throw new Error('DATABASE_URL must be a valid URL')
  }

  try {
    new URL(serverURL)
  } catch {
    throw new Error('NEXT_PUBLIC_SERVER_URL must be a valid URL')
  }

  const configuredR2Keys = r2Keys.filter((key) => Boolean(source[key]?.trim()))
  if (configuredR2Keys.length > 0 && configuredR2Keys.length !== r2Keys.length) {
    const missing = r2Keys.filter((key) => !source[key]?.trim())
    throw new Error(`R2 configuration is incomplete. Missing: ${missing.join(', ')}`)
  }

  return {
    databaseURL,
    hasR2: configuredR2Keys.length === r2Keys.length,
    payloadSecret,
    previewSecret,
    r2: {
      accessKeyID: source.R2_ACCESS_KEY_ID?.trim() || '',
      bucket: source.R2_BUCKET?.trim() || '',
      endpoint: source.R2_ENDPOINT?.trim() || undefined,
      forcePathStyle: optionalBoolean(source.R2_FORCE_PATH_STYLE, 'R2_FORCE_PATH_STYLE', true),
      publicURL: source.R2_PUBLIC_URL?.trim() || '',
      region: source.R2_REGION?.trim() || 'auto',
      secretAccessKey: source.R2_SECRET_ACCESS_KEY?.trim() || '',
    },
    serverURL,
  }
}
