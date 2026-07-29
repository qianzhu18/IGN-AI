import { slugify } from '@/lib/slug'

import type { NotionDataSource, NotionPage, NotionProperty, NotionRichText } from './types'

export const richTextToPlainText = (items: unknown): string =>
  Array.isArray(items)
    ? (items as NotionRichText[])
        .map((item) => item.plain_text || item.text?.content || '')
        .join('')
        .trim()
    : ''

export const findPropertyKey = (
  dataSource: NotionDataSource,
  candidates: readonly string[],
): string | null => {
  for (const candidate of candidates) {
    const direct = dataSource.properties[candidate]
    if (direct) return candidate
    const normalized = candidate.toLowerCase()
    const match = Object.entries(dataSource.properties).find(
      ([key, schema]) => key.toLowerCase() === normalized || schema.name?.toLowerCase() === normalized,
    )
    if (match) return match[0]
  }
  return null
}

export const readProperty = (property: NotionProperty | undefined): unknown => {
  if (!property?.type) return null
  const value = property[property.type]

  if (property.type === 'title' || property.type === 'rich_text') return richTextToPlainText(value)
  if (property.type === 'url' || property.type === 'email' || property.type === 'phone_number') {
    return typeof value === 'string' ? value : ''
  }
  if (property.type === 'select' || property.type === 'status') {
    return value && typeof value === 'object' && 'name' in value
      ? String((value as { name?: unknown }).name || '')
      : ''
  }
  if (property.type === 'multi_select') {
    return Array.isArray(value)
      ? value.map((item) => (item && typeof item === 'object' && 'name' in item ? String(item.name) : '')).filter(Boolean)
      : []
  }
  if (property.type === 'date') {
    if (!value || typeof value !== 'object') return null
    const date = value as { end?: unknown; start?: unknown }
    return {
      end: typeof date.end === 'string' ? date.end : '',
      start: typeof date.start === 'string' ? date.start : '',
    }
  }
  if (property.type === 'checkbox') return value === true
  if (property.type === 'number') return typeof value === 'number' ? value : null
  return value ?? null
}

export const createPropertyReader = (page: NotionPage, dataSource: NotionDataSource) =>
  (candidates: readonly string[]) => {
    const key = findPropertyKey(dataSource, candidates)
    return key ? readProperty(page.properties[key]) : null
  }

export const firstString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export const stringList = (...values: unknown[]): string[] => {
  for (const value of values) {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
    if (typeof value === 'string' && value.trim()) {
      return value
        .split(/[,，、\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }
  return []
}

export const terminalSlug = (value: unknown, title: string, pageId: string) => {
  const explicit = firstString(value).replace(/^\/+|\/+$/g, '')
  if (explicit && !/^https?:\/\//i.test(explicit)) {
    const terminal = explicit.split('/').filter(Boolean).pop()
    if (terminal) return slugify(terminal)
  }
  return slugify(title) || `item-${pageId.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(-12)}`
}

export const parseJSON = (value: unknown): Record<string, unknown> | null => {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const parsed: unknown = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

export const readExternalImage = (image: unknown) => {
  if (!image || typeof image !== 'object') return ''
  const source = image as Record<string, unknown>
  for (const key of ['external', 'file']) {
    const candidate = source[key]
    if (candidate && typeof candidate === 'object' && 'url' in candidate) {
      const url = (candidate as { url?: unknown }).url
      if (typeof url === 'string') return url
    }
  }
  return ''
}
