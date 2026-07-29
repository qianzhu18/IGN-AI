import type { CollectionConfig } from 'payload'

import { admins, contentContributors, publishedOrAuthenticated } from '@/access/roles'
import { CallToActionBlock, CommunityCollectionBlock, RichTextBlock } from '@/blocks'
import { seoFields, slugField, sourceFields } from '@/fields/shared'
import { enforceAIServiceDrafts } from '@/hooks/enforceAIServiceDrafts'
import { ensureSEO } from '@/hooks/ensureSEO'
import { ensureSlug } from '@/hooks/ensureSlug'
import { reserveSlugs } from '@/hooks/reserveSlug'
import { previewAdmin } from '@/lib/contentCollections'
import { RESERVED_ROOT_SLUGS } from '@/lib/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: contentContributors,
    delete: admins,
    read: publishedOrAuthenticated,
    update: contentContributors,
  },
  admin: {
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: '站点',
    ...previewAdmin('pages'),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', label: '页面标题', required: true },
    { name: 'excerpt', type: 'textarea', label: '页面摘要', maxLength: 220 },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [RichTextBlock, CallToActionBlock, CommunityCollectionBlock],
      label: '页面区块',
      required: true,
    },
    slugField(),
    seoFields(),
    sourceFields(),
  ],
  hooks: {
    beforeChange: [enforceAIServiceDrafts],
    beforeValidate: [ensureSlug, reserveSlugs(RESERVED_ROOT_SLUGS), ensureSEO],
  },
  versions: {
    drafts: { autosave: true, schedulePublish: true },
    maxPerDoc: 30,
  },
}
