import type { Block } from 'payload'

export const AboutStoryBlock: Block = {
  slug: 'aboutStory',
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', label: '眉题', required: true },
        { name: 'line1', type: 'text', label: '主标题第一行', required: true },
        { name: 'line2', type: 'text', label: '主标题强调行', required: true },
        { name: 'copy', type: 'textarea', label: '开场说明', required: true },
      ],
      label: '首屏',
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'num', type: 'text', label: '数字 / 短语', required: true },
        { name: 'label', type: 'text', label: '说明', required: true },
      ],
      label: '关键数字',
      maxRows: 4,
      minRows: 1,
      required: true,
    },
    {
      name: 'mission',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', label: '眉题', required: true },
        { name: 'title', type: 'text', label: '标题', required: true },
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', label: '段落', required: true }],
          label: '正文段落',
          maxRows: 4,
          minRows: 1,
          required: true,
        },
      ],
      label: '使命叙事',
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        { name: 'q', type: 'text', label: '问题', required: true },
        { name: 'a', type: 'textarea', label: '回答', required: true },
      ],
      label: '常见问题',
      maxRows: 6,
      minRows: 1,
      required: true,
    },
    {
      name: 'valuesTitle',
      type: 'text',
      label: '价值观标题',
      required: true,
    },
    {
      name: 'values',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', label: '标题', required: true },
        { name: 'desc', type: 'textarea', label: '说明', required: true },
      ],
      label: '价值观卡片',
      maxRows: 4,
      minRows: 1,
      required: true,
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', label: '标题', required: true },
        { name: 'copy', type: 'textarea', label: '说明', required: true },
        { name: 'label', type: 'text', label: '按钮文字', required: true },
        { name: 'href', type: 'text', label: '按钮链接', required: true },
      ],
      label: '行动号召',
    },
  ],
  labels: {
    plural: 'About 叙事区块',
    singular: 'About 叙事区块',
  },
}
