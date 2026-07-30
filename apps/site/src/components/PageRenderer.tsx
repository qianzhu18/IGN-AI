import Link from 'next/link'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { Page } from '@/payload-types'
import { getFeaturedDocuments, getPublishedDocuments } from '@/lib/content'

import { AboutStorySection, type AboutStoryData } from './AboutStory'
import { ContentCard } from './ContentCard'
import { EventCard } from './EventCard'
import { RichText } from './RichText'

export async function PageRenderer({ page }: { page: Page }) {
  return (
    <div className="page-layout">
      {await Promise.all(
        page.layout.map(async (block, index) => {
          if (block.blockType === 'aboutStory') {
            return <AboutStorySection key={block.id || index} story={block as AboutStoryData} />
          }

          if (block.blockType === 'richText') {
            return <RichText data={block.content as DefaultTypedEditorState} key={block.id || index} />
          }

          if (block.blockType === 'callToAction') {
            return (
              <section className="page-cta" key={block.id || index}>
                {block.eyebrow ? <p className="section-label">{block.eyebrow}</p> : null}
                <h2>{block.heading}</h2>
                {block.body ? <p>{block.body}</p> : null}
                <Link className="primary-action" href={block.action.href}>
                  {block.action.label} <span aria-hidden="true">↗</span>
                </Link>
              </section>
            )
          }

          const getDocuments = <T extends 'members' | 'events' | 'records' | 'posts'>(collection: T) =>
            block.featuredOnly ? getFeaturedDocuments(collection, block.limit) : getPublishedDocuments(collection, block.limit)

          if (block.collection === 'events') {
            const events = await getDocuments('events')
            return (
              <section className="page-collection" key={block.id || index}>
                <div className="page-collection__header"><p className="section-label">来自内容后台</p><h2>{block.heading}</h2></div>
                <div className="page-collection__list">{events.map((event, itemIndex) => <EventCard event={event} index={itemIndex} key={event.id} />)}</div>
              </section>
            )
          }

          const collection = block.collection
          const documents =
            collection === 'members'
              ? await getDocuments('members')
              : collection === 'records'
                ? await getDocuments('records')
                : await getDocuments('posts')

          return (
            <section className="page-collection" key={block.id || index}>
              <div className="page-collection__header">
                <p className="section-label">来自内容后台</p>
                <h2>{block.heading}</h2>
              </div>
              <div className="page-collection__list">
                {documents.map((document, itemIndex) => (
                  <ContentCard collection={collection} document={document} index={itemIndex} key={document.id} />
                ))}
              </div>
            </section>
          )
        }),
      )}
    </div>
  )
}
