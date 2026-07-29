import type { Block } from 'payload'

import { contentEditor } from '@/fields/shared'

export const RichTextBlock: Block = {
  slug: 'richText',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: contentEditor,
      label: '正文',
      required: true,
    },
  ],
  labels: {
    plural: '富文本区块',
    singular: '富文本区块',
  },
}
