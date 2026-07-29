import type { Block } from 'payload'

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  fields: [
    { name: 'eyebrow', type: 'text', label: '眉题' },
    { name: 'heading', type: 'text', label: '标题', required: true },
    { name: 'body', type: 'textarea', label: '说明' },
    {
      name: 'action',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', label: '文字', required: true },
        { name: 'href', type: 'text', label: '链接', required: true },
      ],
      label: '行动按钮',
    },
  ],
  labels: {
    plural: '行动区块',
    singular: '行动区块',
  },
}
