import { describe, expect, it } from 'vitest'

import { notionBlocksToLexical } from './lexical'

describe('Notion block to Lexical conversion', () => {
  it('converts headings, paragraphs, and nested text', () => {
    const result = notionBlocksToLexical([
      {
        heading_1: { rich_text: [{ annotations: { bold: true }, plain_text: '标题' }] },
        id: 'heading',
        type: 'heading_1',
      },
      {
        id: 'paragraph',
        paragraph: { rich_text: [{ plain_text: '正文' }] },
        type: 'paragraph',
      },
    ])
    expect(result.editorState.root.children).toHaveLength(2)
    expect(result.editorState.root.children[0]).toMatchObject({ tag: 'h2', type: 'heading' })
  })

  it('reports media for object storage migration instead of embedding temporary URLs', () => {
    const result = notionBlocksToLexical([
      {
        id: 'image',
        image: { external: { url: 'https://example.com/image.jpg' }, type: 'external' },
        type: 'image',
      },
    ])
    expect(result.media).toEqual([
      { field: 'content', kind: 'image', url: 'https://example.com/image.jpg' },
    ])
    expect(result.warnings[0]).toContain('manual placement')
  })
})
