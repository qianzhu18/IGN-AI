import { APIError, type CollectionBeforeValidateHook } from 'payload'

export const normalizeInternalPath = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null
  if (trimmed === '/') return '/'
  return trimmed.replace(/\/+$/, '')
}

export const validateRedirect: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  const fromValue = String(data.from || originalDoc?.from || '')
  const normalizedFrom = normalizeInternalPath(fromValue)
  if (!normalizedFrom) {
    throw new APIError('旧路径必须是以单个 / 开头的站内绝对路径。', 400, undefined, true)
  }

  const toValue = String(data.to || originalDoc?.to || '').trim()
  const normalizedTo = normalizeInternalPath(toValue)
  const isExternalURL = /^https?:\/\/[^\s]+$/i.test(toValue)
  if (!normalizedTo && !isExternalURL) {
    throw new APIError('目标地址必须是站内绝对路径或完整的 HTTP(S) URL。', 400, undefined, true)
  }
  if (normalizedTo === normalizedFrom) {
    throw new APIError('重定向的旧路径和目标地址不能相同。', 400, undefined, true)
  }

  data.from = normalizedFrom
  data.to = normalizedTo || toValue
  return data
}
