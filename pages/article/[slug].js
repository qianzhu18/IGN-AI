import Head from 'next/head'
import Link from 'next/link'
import {
  fetchOfficialPostBlocks,
  fetchPublishedPostsFromOfficialAPI
} from '@/lib/db/notion/postDataSource'

function RichText({ items = [] }) {
  return items.map((item, index) => {
    const value = item.plain_text || item.text?.content || ''
    const markdownLink = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(value)
    const href = item.href || item.text?.link?.url || markdownLink?.[2]
    const label = markdownLink ? markdownLink[1] : value
    const content = item.annotations?.bold ? <strong>{label}</strong> : label
    return href && /^https?:\/\//i.test(href) ? (
      <a
        key={index}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='underline underline-offset-4'
      >
        {content}
      </a>
    ) : (
      <span key={index}>{content}</span>
    )
  })
}

function ArticleBlocks({ blocks }) {
  return (
    <div className='mt-12 space-y-6 text-base leading-8 text-white/75'>
      {blocks.map(block => {
        const content = block[block.type] || {}
        const text = <RichText items={content.rich_text || []} />
        switch (block.type) {
          case 'paragraph':
            return <p key={block.id}>{text}</p>
          case 'heading_1':
            return (
              <h2
                key={block.id}
                className='pt-5 text-3xl font-semibold text-white'
              >
                {text}
              </h2>
            )
          case 'heading_2':
            return (
              <h2
                key={block.id}
                className='pt-4 text-2xl font-semibold text-white'
              >
                {text}
              </h2>
            )
          case 'heading_3':
            return (
              <h3
                key={block.id}
                className='pt-3 text-xl font-semibold text-white'
              >
                {text}
              </h3>
            )
          case 'bulleted_list_item':
            return (
              <p
                key={block.id}
                className='pl-5 before:-ml-5 before:mr-3 before:content-["•"]'
              >
                {text}
              </p>
            )
          case 'numbered_list_item':
            return (
              <p key={block.id} className='pl-5'>
                {text}
              </p>
            )
          case 'quote':
            return (
              <blockquote
                key={block.id}
                className='border-l-2 border-[#f0cb8a]/60 pl-5 text-white/60'
              >
                {text}
              </blockquote>
            )
          case 'divider':
            return <hr key={block.id} className='border-white/15' />
          default:
            return null
        }
      })}
    </div>
  )
}

export default function OfficialArticle({ post, blocks }) {
  return (
    <>
      <Head>
        <title>{`${post.title} | IGNAI`}</title>
        <meta name='description' content={post.summary} />
      </Head>
      <main className='ignai-themed-page min-h-screen bg-[var(--ignai-bg)] text-[var(--rig-paper)]'>
        <article className='mx-auto max-w-3xl px-6 py-20 lg:py-24'>
          <Link
            href='/archive'
            className='text-sm text-white/55 no-underline hover:text-white'
          >
            ← 返回内容文章
          </Link>
          <div className='mt-12 flex flex-wrap items-center gap-3 text-sm text-white/55'>
            {post.category && <span>{post.category}</span>}
            {post.publishDay && (
              <time dateTime={post.publishDay}>{post.publishDay}</time>
            )}
            {post.author && <span>{post.author}</span>}
          </div>
          <h1 className='mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl'>
            {post.title}
          </h1>
          {post.summary && (
            <p className='mt-6 text-lg leading-8 text-white/60'>
              {post.summary}
            </p>
          )}
          <ArticleBlocks blocks={blocks} />
          {post.tags?.length > 0 && (
            <div className='mt-14 flex flex-wrap gap-2 border-t border-white/10 pt-6'>
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className='rounded-full border border-white/15 px-3 py-1 text-xs text-white/55'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const posts = await fetchPublishedPostsFromOfficialAPI()
  const post = posts?.find(item => item.slug === `article/${params.slug}`)
  if (!post) return { notFound: true, revalidate: 60 }

  const blocks = await fetchOfficialPostBlocks(post.id)
  if (!blocks) return { notFound: true, revalidate: 60 }
  return {
    props: {
      NOTION_CONFIG: {},
      allPages: [],
      allMembers: [],
      allEvents: [],
      allRecords: [],
      customMenu: [],
      tagOptions: [],
      categoryOptions: [],
      post,
      blocks
    },
    revalidate: 60
  }
}
