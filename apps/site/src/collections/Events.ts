import type { CollectionConfig } from 'payload'

import { admins, contentContributors, publishedOrAuthenticated } from '@/access/roles'
import { contentEditor, seoFields, slugField, sourceFields } from '@/fields/shared'
import { enforceAIServiceDrafts } from '@/hooks/enforceAIServiceDrafts'
import { ensureSEO } from '@/hooks/ensureSEO'
import { ensureSlug } from '@/hooks/ensureSlug'
import { eventReferences, protectReferencedDocument } from '@/hooks/protectReferencedDocument'
import { previewAdmin } from '@/lib/contentCollections'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: contentContributors,
    delete: admins,
    read: publishedOrAuthenticated,
    update: contentContributors,
  },
  admin: {
    defaultColumns: ['title', 'startAt', '_status', 'updatedAt'],
    description: '从草稿、预览到发布，管理 IGNAI 的真实活动。',
    group: '社区',
    ...previewAdmin('events'),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    startAt: true,
    location: true,
    cover: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '内容',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: '活动名称',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: '活动摘要',
              maxLength: 220,
              required: true,
            },
            {
              name: 'cover',
              type: 'upload',
              label: '活动封面',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: contentEditor,
              label: '活动详情',
              required: true,
            },
          ],
        },
        {
          label: '时间与报名',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startAt',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
                  label: '开始时间',
                  required: true,
                },
                {
                  name: 'endAt',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
                  label: '结束时间',
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              label: '地点',
              required: true,
            },
            {
              name: 'format',
              type: 'select',
              defaultValue: 'offline',
              label: '形式',
              options: [
                { label: '线下', value: 'offline' },
                { label: '线上', value: 'online' },
                { label: '混合', value: 'hybrid' },
              ],
              required: true,
            },
            {
              name: 'registrationURL',
              type: 'text',
              label: '报名链接',
            },
            {
              name: 'organizers',
              type: 'relationship',
              hasMany: true,
              label: '组织成员',
              relationTo: 'members',
            },
            {
              name: 'participants',
              type: 'relationship',
              hasMany: true,
              label: '参与成员',
              relationTo: 'members',
            },
          ],
        },
        {
          label: '发布与迁移',
          fields: [
            slugField(),
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: '首页重点展示',
            },
            seoFields(),
            sourceFields(),
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [enforceAIServiceDrafts],
    beforeDelete: [protectReferencedDocument(eventReferences)],
    beforeValidate: [ensureSlug, ensureSEO],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
}
