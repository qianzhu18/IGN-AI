type NotionRichText = string[] | string[][]

type NotionBlockValue = {
  id?: string
  type?: string
  properties?: {
    title?: NotionRichText
    caption?: NotionRichText
    source?: NotionRichText
    [key: string]: unknown
  }
  format?: {
    page_cover?: string
    [key: string]: unknown
  }
  content?: string[]
}

type NotionBlockMap = {
  [id: string]: { value?: NotionBlockValue } | undefined
}

type RecordBlockMedia = {
  src: string
  alt: string
  caption: string
  orientation?: 'portrait'
}

export type RecordContentSection = {
  heading: string
  body: string
  media?: RecordBlockMedia[]
}

const HEADING_TYPES = new Set([
  'header',
  'sub_header',
  'sub_sub_header',
  'toggle',
  'toggle_heading'
])

const TEXT_TYPES = new Set(['text', 'quote', 'bulleted_list', 'numbered_list'])

function flattenRichText(value?: NotionRichText): string {
  if (!value) return ''
  if (typeof value === 'string') return value

  const stack = [value]
  let out = ''

  while (stack.length > 0) {
    const node = stack.shift()
    if (!node) continue
    if (typeof node === 'string') {
      out += node
      continue
    }
    if (Array.isArray(node)) {
      for (let i = node.length - 1; i >= 0; i--) {
        stack.unshift(node[i] as never)
      }
    }
  }

  return out
}

function readImageSource(block?: NotionBlockValue): string {
  if (!block) return ''
  const source = flattenRichText(block.properties?.source)
  if (source) return source

  const fileUrl = (block as unknown as { file?: { url?: string } }).file?.url
  return fileUrl || ''
}

function isPortraitImage(block?: NotionBlockValue): boolean {
  const width = (block?.format as { image_width?: number } | undefined)?.image_width
  const height = (block?.format as { image_height?: number } | undefined)?.image_height
  if (!width || !height) return false
  return height > width
}

function buildSection(): RecordContentSection {
  return { heading: '', body: '', media: [] }
}

export function adaptRecordBlocks(
  blockMap: NotionBlockMap | null | undefined,
  pageId: string
): RecordContentSection[] {
  if (!blockMap || !pageId) return []

  const pageBlock = blockMap[pageId]?.value
  const childIds: string[] = pageBlock?.content || []

  if (childIds.length === 0) {
    // Fallback：按 blockMap 里所有顶层 block 的原始顺序遍历
    const fallbackIds = Object.keys(blockMap)
    return walkBlocks(blockMap, fallbackIds)
  }

  return walkBlocks(blockMap, childIds)
}

function walkBlocks(blockMap: NotionBlockMap, ids: string[]): RecordContentSection[] {
  const sections: RecordContentSection[] = []
  let current = buildSection()
  let hasContent = false

  const flush = () => {
    if (hasContent) sections.push(current)
    current = buildSection()
    hasContent = false
  }

  for (const id of ids) {
    const block = blockMap[id]?.value
    if (!block || !block.type) continue

    if (HEADING_TYPES.has(block.type)) {
      flush()
      current.heading = flattenRichText(block.properties?.title)
      hasContent = true
      continue
    }

    if (TEXT_TYPES.has(block.type)) {
      const text = flattenRichText(block.properties?.title)
      if (!text) continue
      // Each text block becomes its own section so the page renders them
      // as separate paragraphs (NotionNext's default block rendering),
      // instead of merging consecutive paragraphs into one body string.
      flush()
      current.body = text
      hasContent = true
      flush()
      continue
    }

    if (block.type === 'image') {
      const src = readImageSource(block)
      if (!src) continue
      const media: RecordBlockMedia = {
        src,
        alt: flattenRichText(block.properties?.caption) || current.heading || '社区现场图片',
        caption: flattenRichText(block.properties?.caption) || ''
      }
      if (isPortraitImage(block)) media.orientation = 'portrait'
      current.media?.push(media)
      hasContent = true
      continue
    }
  }

  flush()
  return sections
}
