import type { CollectionConfig } from 'payload'

import { admins, editors } from '@/access/roles'

export const JoinSubmissions: CollectionConfig = {
  slug: 'join-submissions',
  access: {
    create: () => true,
    delete: admins,
    read: editors,
    update: editors,
  },
  admin: {
    defaultColumns: ['name', 'contact', 'status', 'source', 'createdAt'],
    description: '申请内容永不公开读取；公开提交入口仍需在 Route Handler 层增加限流与幂等保护。',
    group: '运营',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', label: '姓名', required: true },
    { name: 'contact', type: 'text', index: true, label: '联系方式', required: true },
    { name: 'role', type: 'text', label: '身份 / 职业', required: true },
    {
      name: 'interests',
      type: 'array',
      fields: [{ name: 'label', type: 'text', label: '方向', required: true }],
      label: '兴趣方向',
    },
    { name: 'message', type: 'textarea', label: '申请说明', required: true },
    { name: 'source', type: 'text', defaultValue: 'website', label: '来源', required: true },
    {
      name: 'status',
      type: 'select',
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) =>
          (req.user as { role?: string } | null)?.role === 'admin' ||
          (req.user as { role?: string } | null)?.role === 'editor',
      },
      defaultValue: 'submitted',
      index: true,
      label: '处理状态',
      options: [
        { label: '新提交', value: 'submitted' },
        { label: '查看中', value: 'reviewing' },
        { label: '已联系', value: 'contacted' },
        { label: '已接纳', value: 'accepted' },
        { label: '待定', value: 'waitlisted' },
        { label: '已撤回', value: 'withdrawn' },
        { label: '无效', value: 'spam' },
        { label: '已归档', value: 'archived' },
      ],
      required: true,
    },
    {
      name: 'profileDraft',
      type: 'group',
      fields: [
        { name: 'avatar', type: 'upload', label: '头像', relationTo: 'media' },
        { name: 'headline', type: 'text', label: '一句话介绍' },
        { name: 'website', type: 'text', label: '个人网站' },
        { name: 'github', type: 'text', label: 'GitHub' },
        { name: 'xiaohongshu', type: 'text', label: '小红书' },
      ],
      label: '成员资料草稿',
    },
    {
      name: 'review',
      type: 'group',
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) =>
          (req.user as { role?: string } | null)?.role === 'admin' ||
          (req.user as { role?: string } | null)?.role === 'editor',
      },
      fields: [
        { name: 'assignee', type: 'relationship', label: '处理人', relationTo: 'users' },
        { name: 'notes', type: 'textarea', label: '内部备注' },
        { name: 'contactedAt', type: 'date', label: '联系时间' },
      ],
      label: '运营处理',
    },
    {
      name: 'dedupeKey',
      type: 'text',
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
      index: true,
      label: '幂等键',
      unique: true,
    },
  ],
  timestamps: true,
}
