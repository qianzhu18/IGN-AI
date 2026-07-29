import type { CollectionConfig } from 'payload'

import { admins, editors } from '@/access/roles'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  access: {
    create: editors,
    delete: admins,
    read: () => true,
    update: editors,
  },
  admin: {
    defaultColumns: ['from', 'to', 'statusCode', 'active', 'updatedAt'],
    group: '站点',
    useAsTitle: 'from',
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      admin: { description: '必须是站内绝对路径，例如 /old-path。' },
      index: true,
      label: '旧路径',
      required: true,
      unique: true,
    },
    {
      name: 'to',
      type: 'text',
      admin: { description: '站内路径或完整外部 URL。' },
      label: '目标地址',
      required: true,
    },
    {
      name: 'statusCode',
      type: 'select',
      defaultValue: '301',
      label: '状态码',
      options: [
        { label: '301 永久重定向', value: '301' },
        { label: '302 临时重定向', value: '302' },
        { label: '307 临时重定向', value: '307' },
        { label: '308 永久重定向', value: '308' },
      ],
      required: true,
    },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true, label: '启用' },
  ],
  timestamps: true,
}
