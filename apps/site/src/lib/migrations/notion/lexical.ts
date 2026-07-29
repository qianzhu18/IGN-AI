import { readExternalImage, richTextToPlainText } from './properties'
import type { MediaCandidate, NotionBlock, NotionRichText } from './types'

type LexicalNode = Record<string, unknown>

const textFormat = (item: NotionRichText) => {
  let format = 0
  if (item.annotations?.bold) format |= 1
  if (item.annotations?.italic) format |= 2
  if (item.annotations?.strikethrough) format |= 4
  if (item.annotations?.underline) format |= 8
  if (item.annotations?.code) format |= 16
  return format
}

const textNodes = (items: unknown): LexicalNode[] =>
  Array.isArray(items)
    ? (items as NotionRichText[]).map((item) => ({
        detail: 0,
        format: textFormat(item),
        mode: 'normal',
        style: '',
        text: item.plain_text || item.text?.content || '',
        type: 'text',
        version: 1,
      }))
    : []

const paragraph = (children: LexicalNode[]): LexicalNode => ({
  children,
  direction: null,
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  type: 'paragraph',
  version: 1,
})

const blockValue = (block: NotionBlock) => {
  const value = block[block.type]
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

const mediaURL = (block: NotionBlock) => readExternalImage(blockValue(block))

export function notionBlocksToLexical(blocks: NotionBlock[], fallbackText = '') {
  const children: LexicalNode[] = []
  const media: MediaCandidate[] = []
  const warnings: string[] = []

  const visit = (block: NotionBlock) => {
    const value = blockValue(block)
    const richText = value.rich_text
    const plainText = richTextToPlainText(richText)

    if (block.type === 'paragraph') children.push(paragraph(textNodes(richText)))
    else if (['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
      const level = block.type === 'heading_1' ? 'h2' : block.type === 'heading_2' ? 'h3' : 'h4'
      children.push({
        children: textNodes(richText),
        direction: null,
        format: '',
        indent: 0,
        tag: level,
        type: 'heading',
        version: 1,
      })
    } else if (block.type === 'bulleted_list_item') {
      children.push(paragraph(textNodes([{ plain_text: `• ${plainText}` }])))
    } else if (block.type === 'numbered_list_item') {
      children.push(paragraph(textNodes([{ plain_text: `1. ${plainText}` }])))
    } else if (block.type === 'to_do') {
      children.push(paragraph(textNodes([{ plain_text: `${value.checked ? '[x]' : '[ ]'} ${plainText}` }])))
    } else if (block.type === 'quote' || block.type === 'callout' || block.type === 'toggle') {
      children.push(paragraph(textNodes([{ plain_text: plainText }])))
    } else if (block.type === 'code') {
      children.push(paragraph(textNodes([{ plain_text: plainText }])))
      warnings.push(`Block ${block.id}: code converted to plain paragraph`)
    } else if (block.type === 'divider') {
      children.push(paragraph(textNodes([{ plain_text: '---' }])))
    } else if (block.type === 'table_row') {
      const cells = Array.isArray(value.cells) ? value.cells : []
      const row = cells.map((cell) => richTextToPlainText(cell)).join(' | ')
      children.push(paragraph(textNodes([{ plain_text: row }])))
    } else if (block.type === 'image' || block.type === 'video' || block.type === 'file') {
      const url = mediaURL(block)
      if (url) media.push({ field: 'content', kind: block.type === 'image' ? 'image' : 'file', url })
      warnings.push(`Block ${block.id}: ${block.type} requires media migration and manual placement`)
    } else if (
      ![
        'bookmark',
        'column',
        'column_list',
        'link_preview',
        'synced_block',
        'table',
        'table_of_contents',
      ].includes(block.type)
    ) {
      warnings.push(`Block ${block.id}: unsupported Notion block type ${block.type}`)
    }

    for (const nested of block.children || []) visit(nested)
  }

  for (const block of blocks) visit(block)
  if (children.length === 0) children.push(paragraph(textNodes([{ plain_text: fallbackText }])))

  return {
    editorState: {
      root: {
        children,
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    media,
    warnings: [...new Set(warnings)],
  }
}
