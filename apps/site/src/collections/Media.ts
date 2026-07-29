import type { CollectionConfig } from 'payload'

import { admins, editors } from '@/access/roles'
import { sourceFields } from '@/fields/shared'
import { mediaReferences, protectReferencedDocument } from '@/hooks/protectReferencedDocument'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: editors,
    delete: admins,
    read: () => true,
    update: editors,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    group: '内容',
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '替代文本',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: '说明',
    },
    sourceFields(),
  ],
  hooks: {
    beforeDelete: [protectReferencedDocument(mediaReferences)],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
        position: 'centre',
      },
      {
        name: 'card',
        width: 960,
        height: 640,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
  },
}
