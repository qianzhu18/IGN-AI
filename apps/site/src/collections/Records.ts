import type { CollectionConfig } from 'payload'

import { admins, contentContributors, publishedOrAuthenticated } from '@/access/roles'
import { contentEditor, seoFields, slugField, sourceFields } from '@/fields/shared'
import { enforceAIServiceDrafts } from '@/hooks/enforceAIServiceDrafts'
import { ensureSlug } from '@/hooks/ensureSlug'

export const Records: CollectionConfig = {
  slug: 'records',
  access: {
    create: contentContributors,
    delete: admins,
    read: publishedOrAuthenticated,
    update: contentContributors,
  },
  admin: {
    defaultColumns: ['title', 'recordType', 'timelineDate', '_status', 'updatedAt'],
    group: '内容',
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', label: '记录标题', required: true },
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
      name: 'recordType',
      type: 'select',
      label: '记录类型',
      options: [
        { label: '活动现场', value: 'recap' },
        { label: '社区故事', value: 'story' },
        { label: '社区观察', value: 'resource' },
        { label: '项目与见面', value: 'project' },
      ],
      required: true,
    },
    { name: 'timelineDate', type: 'date', label: '开始日期' },
    { name: 'timelineEndDate', type: 'date', label: '结束日期' },
    {
      name: 'dateStatus',
      type: 'select',
      defaultValue: 'confirmed',
      label: '日期可信度',
      options: [
        { label: '已确认', value: 'confirmed' },
        { label: '约略日期', value: 'approximate' },
        { label: '未知', value: 'unknown' },
      ],
      required: true,
    },
    { name: 'location', type: 'text', label: '地点' },
    {
      name: 'events',
      type: 'relationship',
      hasMany: true,
      label: '关联活动',
      relationTo: 'events',
    },
    {
      name: 'members',
      type: 'relationship',
      hasMany: true,
      label: '参与成员',
      relationTo: 'members',
    },
    {
      name: 'gallery',
      type: 'relationship',
      hasMany: true,
      label: '现场素材',
      relationTo: 'media',
    },
    {
      name: 'outcomes',
      type: 'array',
      fields: [{ name: 'text', type: 'text', label: '成果', required: true }],
      label: '产出与结果',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'label', type: 'text', label: '标签', required: true }],
      label: '标签',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', label: '文字', required: true },
        { name: 'href', type: 'text', label: '链接', required: true },
      ],
      label: '外部链接',
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: '精选记录' },
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
