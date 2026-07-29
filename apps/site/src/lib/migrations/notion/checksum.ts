import { createHash } from 'node:crypto'

const normalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, child]) => child !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, normalize(child)]),
    )
  }
  return value
}

export const canonicalJSON = (value: unknown) => JSON.stringify(normalize(value))

export const checksum = (value: unknown) =>
  createHash('sha256').update(canonicalJSON(value)).digest('hex')

export const projectShape = (value: unknown, shape: unknown): unknown => {
  if (Array.isArray(shape)) {
    if (!Array.isArray(value)) return []
    const itemShape = shape[0]
    return value.map((item) => (itemShape === undefined ? normalize(item) : projectShape(item, itemShape)))
  }
  if (shape && typeof shape === 'object') {
    const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
    return Object.fromEntries(
      Object.entries(shape as Record<string, unknown>).map(([key, childShape]) => [
        key,
        projectShape(source[key], childShape),
      ]),
    )
  }
  return value ?? null
}
