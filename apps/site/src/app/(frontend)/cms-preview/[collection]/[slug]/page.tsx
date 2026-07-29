import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PreviewDocument } from '@/components/PreviewDocument'
import { getDocumentBySlug } from '@/lib/content'
import { isContentCollection } from '@/lib/contentCollections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: '内容预览 · IGNAI',
}

type Args = {
  params: Promise<{ collection: string; slug: string }>
}

export default async function ContentPreviewPage({ params }: Args) {
  const [{ collection, slug }, { isEnabled }] = await Promise.all([params, draftMode()])
  if (!isEnabled || !isContentCollection(collection)) notFound()

  const document = await getDocumentBySlug(collection, decodeURIComponent(slug), true)
  if (!document) notFound()

  return (
    <main className="preview-workspace">
      <LivePreviewListener />
      <div className="preview-toolbar">
        <strong>IGNAI 内容预览</strong>
        <span>未发布内容 · 禁止索引</span>
      </div>
      <article className="preview-document">
        <PreviewDocument collection={collection} document={document} />
      </article>
    </main>
  )
}
