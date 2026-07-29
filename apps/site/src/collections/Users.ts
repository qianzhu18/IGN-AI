import type { CollectionConfig } from 'payload'

import { adminFieldAccess, admins } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    group: '系统',
    useAsTitle: 'name',
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: async ({ req }) => {
      if (req.user) return admins({ req } as Parameters<typeof admins>[0])

      const result = await req.payload.count({
        collection: 'users',
        overrideAccess: true,
      })
      return result.totalDocs === 0
    },
    delete: admins,
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as { role?: string }).role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as { role?: string }).role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '姓名',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      access: {
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
      defaultValue: 'admin',
      label: '后台角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑者', value: 'editor' },
        { label: 'AI 服务账号', value: 'ai-service' },
      ],
      required: true,
      saveToJWT: true,
    },
  ],
  timestamps: true,
}
