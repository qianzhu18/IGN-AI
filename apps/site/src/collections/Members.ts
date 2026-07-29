import type { CollectionConfig } from 'payload'

import { admins, contentContributors, publishedOrAuthenticated } from '@/access/roles'
import { contentEditor, seoFields, slugField, sourceFields } from '@/fields/shared'
import { enforceAIServiceDrafts } from '@/hooks/enforceAIServiceDrafts'
import { ensureSEO } from '@/hooks/ensureSEO'
import { ensureSlug } from '@/hooks/ensureSlug'
import { memberReferences, protectReferencedDocument } from '@/hooks/protectReferencedDocument'
import { previewAdmin } from '@/lib/contentCollections'

export const Members: CollectionConfig = {
  slug: 'members',
  access: {
    create: contentContributors,
    delete: admins,
    read: publishedOrAuthenticated,
    update: contentContributors,
  },
  admin: {
    defaultColumns: ['title', 'role', 'city', '_status', 'updatedAt'],
    group: '社区',
    ...previewAdmin('members'),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', label: '姓名', required: true },
    { name: 'avatar', type: 'upload', label: '头像', relationTo: 'media' },
    { name: 'role', type: 'text', label: '社区角色', required: true },
    { name: 'city', type: 'text', label: '城市' },
    {
      name: 'focusAreas',
      type: 'array',
      fields: [{ name: 'label', type: 'text', label: '方向', required: true }],
      label: '关注方向',
      maxRows: 12,
    },
    { name: 'headline', type: 'textarea', label: '一句话介绍', maxLength: 180 },
    {
      name: 'bio',
      type: 'richText',
      editor: contentEditor,
      label: '成员介绍',
      required: true,
    },
    { name: 'quote', type: 'textarea', label: '成员自述', maxLength: 280 },
    { name: 'joinedAt', type: 'date', label: '加入时间' },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: '精选成员' },
    { name: 'verified', type: 'checkbox', defaultValue: false, label: '资料已核验' },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'website', type: 'text', label: '个人网站' },
        { name: 'github', type: 'text', label: 'GitHub' },
        { name: 'x', type: 'text', label: 'X' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn' },
        { name: 'xiaohongshu', type: 'text', label: '小红书' },
      ],
      label: '外部链接',
    },
    slugField(),
    seoFields(),
    sourceFields(),
  ],
  hooks: {
    beforeChange: [enforceAIServiceDrafts],
    beforeDelete: [protectReferencedDocument(memberReferences)],
    beforeValidate: [ensureSlug, ensureSEO],
  },
  versions: {
    drafts: { autosave: true, schedulePublish: true },
    maxPerDoc: 30,
  },
}
