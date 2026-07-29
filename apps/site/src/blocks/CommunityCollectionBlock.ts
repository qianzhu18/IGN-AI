import type { Block } from 'payload'

export const CommunityCollectionBlock: Block = {
  slug: 'communityCollection',
  fields: [
    { name: 'heading', type: 'text', label: '标题', required: true },
    {
      name: 'collection',
      type: 'select',
      label: '内容集合',
      options: [
        { label: '成员', value: 'members' },
        { label: '活动', value: 'events' },
        { label: '社区记录', value: 'records' },
        { label: '文章', value: 'posts' },
      ],
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      label: '展示数量',
      max: 24,
      min: 1,
      required: true,
    },
    { name: 'featuredOnly', type: 'checkbox', defaultValue: false, label: '只展示精选内容' },
  ],
  labels: {
    plural: '社区集合区块',
    singular: '社区集合区块',
  },
}
