import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { admins, contentContributors, publishedOrAuthenticated } from '@/access/roles'
import { enforceAIServiceDrafts } from '@/hooks/enforceAIServiceDrafts'
import { slugify } from '@/lib/slug'

const ensureSlug: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  const explicitSlug = typeof data.slug === 'string' ? data.slug : ''
  const title = typeof data.title === 'string' ? data.title : ''
  data.slug = slugify(explicitSlug || originalDoc?.slug || title)
  return data
}

const serverURL = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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
    livePreview: {
      url: ({ data }) => `${serverURL()}/events/${data?.slug || 'preview'}`,
    },
    preview: (data) => {
      const path = `/events/${data?.slug || 'preview'}`
      const params = new URLSearchParams({
        path,
        previewSecret: process.env.PREVIEW_SECRET || '',
      })
      return `${serverURL()}/next/preview?${params.toString()}`
    },
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
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
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
            {
              name: 'slug',
              type: 'text',
              admin: {
                description: '用于 /events/:slug。为空时由活动名称生成。',
              },
              index: true,
              label: 'URL Slug',
              required: true,
              unique: true,
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: '首页重点展示',
            },
            {
              name: 'source',
              type: 'group',
              admin: {
                description: '只读迁移追踪信息；新内容可留空。',
              },
              fields: [
                { name: 'notionPageId', type: 'text', label: 'Notion Page ID', unique: true },
                { name: 'lastSyncedAt', type: 'date', label: '上次导入时间' },
              ],
              label: '迁移来源',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [ensureSlug],
    beforeChange: [enforceAIServiceDrafts],
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
