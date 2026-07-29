import type { GlobalConfig } from 'payload'

import { editors } from '@/access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: editors,
  },
  admin: {
    description: '品牌文字、导航和首页主行动。',
    group: '站点',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'IGN AI',
      label: '站点名称',
      required: true,
    },
    {
      name: 'heroStatement',
      type: 'text',
      defaultValue: '在真实世界，发生 AI',
      label: '首页宣言',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue: '长沙青年 AI 社区。我们把线上信号带回真实现场，把相遇变成长期行动。',
      label: '首页简介',
      required: true,
    },
    {
      name: 'primaryCTA',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: '加入社区', label: '文字', required: true },
        { name: 'href', type: 'text', defaultValue: '/join', label: '链接', required: true },
      ],
      label: '主行动',
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', label: '文字', required: true },
        { name: 'href', type: 'text', label: '链接', required: true },
      ],
      label: '导航',
      maxRows: 6,
    },
    {
      name: 'defaultSEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', label: '默认标题', required: true },
        { name: 'description', type: 'textarea', label: '默认描述', required: true },
        { name: 'image', type: 'upload', label: '默认分享图片', relationTo: 'media' },
      ],
      label: '默认 SEO',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', label: '平台', required: true },
        { name: 'href', type: 'text', label: '链接', required: true },
      ],
      label: '社交链接',
      maxRows: 8,
    },
  ],
  versions: {
    drafts: true,
    max: 20,
  },
}
