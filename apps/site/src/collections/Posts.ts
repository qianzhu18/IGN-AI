import type { CollectionConfig } from 'payload'

import { admins, contentContributors, publishedOrAuthenticated } from '@/access/roles'
import { contentEditor, seoFields, slugField, sourceFields } from '@/fields/shared'
import { enforceAIServiceDrafts } from '@/hooks/enforceAIServiceDrafts'
import { ensureSlug } from '@/hooks/ensureSlug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: contentContributors,
    delete: admins,
    read: publishedOrAuthenticated,
    update: contentContributors,
  },
  admin: {
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    group: '内容',
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', label: '文章标题', required: true },
    { name: 'excerpt', type: 'textarea', label: '摘要', maxLength: 220, required: true },
    { name: 'cover', type: 'upload', label: '封面', relationTo: 'media' },
    {
      name: 'content',
      type: 'richText',
      editor: contentEditor,
      label: '正文',
      required: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      hasMany: true,
      label: '作者',
      relationTo: 'members',
      required: true,
    },
    {
      name: 'events',
      type: 'relationship',
      hasMany: true,
      label: '关联活动',
      relationTo: 'events',
    },
    {
      name: 'records',
      type: 'relationship',
      hasMany: true,
      label: '关联记录',
      relationTo: 'records',
    },
    {
      name: 'categories',
      type: 'array',
      fields: [{ name: 'label', type: 'text', label: '分类', required: true }],
      label: '分类',
      maxRows: 4,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'label', type: 'text', label: '标签', required: true }],
      label: '标签',
    },
    { name: 'publishedAt', type: 'date', label: '公开时间' },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: '精选文章' },
    slugField(),
    seoFields(),
    sourceFields(),
  ],
  hooks: {
    beforeChange: [enforceAIServiceDrafts],
    beforeValidate: [ensureSlug],
  },
  versions: {
    drafts: { autosave: true, schedulePublish: true },
    maxPerDoc: 30,
  },
}
