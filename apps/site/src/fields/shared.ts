import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'

export const contentEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const sourceFields = (): Field => ({
  name: 'source',
  type: 'group',
  admin: {
    description: '迁移追踪信息；新内容可留空。',
  },
  fields: [
    { name: 'notionPageId', type: 'text', label: 'Notion Page ID', unique: true },
    { name: 'lastSyncedAt', type: 'date', label: '上次导入时间' },
  ],
  label: '迁移来源',
})

export const seoFields = (): Field => ({
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'title', type: 'text', label: 'SEO 标题', maxLength: 70 },
    { name: 'description', type: 'textarea', label: 'SEO 描述', maxLength: 180 },
    { name: 'image', type: 'upload', label: '分享图片', relationTo: 'media' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false, label: '禁止搜索引擎收录' },
  ],
  label: 'SEO',
})

export const slugField = (): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    description: '公开 URL 的稳定标识。为空时由标题生成。',
  },
  index: true,
  label: 'URL Slug',
  required: true,
  unique: true,
})
