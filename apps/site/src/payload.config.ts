import { postgresAdapter } from '@payloadcms/db-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { zh } from '@payloadcms/translations/languages/zh'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Events } from '@/collections/Events'
import { JoinSubmissions } from '@/collections/JoinSubmissions'
import { Media } from '@/collections/Media'
import { Members } from '@/collections/Members'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { Records } from '@/collections/Records'
import { Redirects } from '@/collections/Redirects'
import { Users } from '@/collections/Users'
import { SiteSettings } from '@/globals/SiteSettings'
import { resolveEnvironment } from '@/lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const environment = resolveEnvironment()

export default buildConfig({
  admin: {
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 960 },
      ],
      collections: ['events', 'members', 'pages', 'posts', 'records'],
    },
    meta: {
      titleSuffix: ' — IGNAI 内容后台',
    },
    components: {
      beforeDashboard: ['@/components/admin/AdminDashboardOverview#AdminDashboardOverview'],
      graphics: {
        Icon: '@/components/admin/AdminBrand#AdminIcon',
        Logo: '@/components/admin/AdminBrand#AdminLogo',
      },
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Members,
    Events,
    Records,
    Posts,
    Pages,
    JoinSubmissions,
    Redirects,
  ],
  cors: [environment.serverURL],
  csrf: [environment.serverURL],
  db: postgresAdapter({
    pool: {
      connectionString: environment.databaseURL,
    },
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  editor: lexicalEditor(),
  globals: [SiteSettings],
  i18n: {
    fallbackLanguage: 'zh',
    supportedLanguages: { zh },
  },
  plugins: [
    s3Storage({
      bucket: environment.r2.bucket || 'disabled',
      clientUploads: true,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: uploadedFilename, prefix }) => {
            const key = prefix ? `${prefix}/${uploadedFilename}` : uploadedFilename
            return `${environment.r2.publicURL}/${key}`
          },
        },
      },
      config: {
        credentials: {
          accessKeyId: environment.r2.accessKeyID || 'disabled',
          secretAccessKey: environment.r2.secretAccessKey || 'disabled',
        },
        endpoint: environment.r2.endpoint,
        forcePathStyle: environment.r2.forcePathStyle,
        region: environment.r2.region,
      },
      enabled: environment.hasR2,
    }),
    mcpPlugin({
      collections: {
        events: {
          description: 'Read published and permitted IGNAI event content. First phase is read-only.',
          enabled: { find: true },
        },
        members: {
          description: 'Read published and permitted IGNAI member profiles.',
          enabled: { find: true },
        },
        pages: {
          description: 'Read published and permitted IGNAI pages.',
          enabled: { find: true },
        },
        posts: {
          description: 'Read published and permitted IGNAI posts.',
          enabled: { find: true },
        },
        records: {
          description: 'Read published and permitted IGNAI community records.',
          enabled: { find: true },
        },
      },
      globals: {
        'site-settings': {
          enabled: { find: true },
        },
      },
    }),
  ],
  secret: environment.payloadSecret,
  serverURL: environment.serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
