import SmartLink from '@/components/SmartLink'
import Image from 'next/image'

function compactText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function getPostHref(post) {
  return post?.href || (post?.slug ? `/${String(post.slug).replace(/^\/+/, '')}` : '#')
}

function getPostCategory(post) {
  if (Array.isArray(post?.category)) return post.category.filter(Boolean).join(' / ')
  return compactText(post?.category, 'Article')
}

function getPostTags(post) {
  return Array.isArray(post?.tags) ? post.tags.filter(Boolean).slice(0, 3) : []
}

function getPostAuthors(post) {
  if (Array.isArray(post?.authors) && post.authors.length > 0) {
    return post.authors
      .map(author => compactText(author?.title || author?.name || author?.slug))
      .filter(Boolean)
      .slice(0, 2)
  }

  if (Array.isArray(post?.author)) {
    return post.author.map(author => compactText(author)).filter(Boolean).slice(0, 2)
  }

  const authorText = compactText(post?.author || post?.ext?.author)
  return authorText ? authorText.split(',').map(item => item.trim()).filter(Boolean).slice(0, 2) : []
}

function getPostCover(post) {
  return (
    compactText(post?.pageCoverThumbnail) ||
    compactText(post?.pageCover) ||
    '/brand/ignai/hero-gradient-brand.webp'
  )
}

export function PostArticleCard({ post, featured = false }) {
  const tags = getPostTags(post)
  const authors = getPostAuthors(post)

  return (
    <SmartLink
      href={getPostHref(post)}
      data-analytics-event='click_article_card'
      data-analytics-label={compactText(post?.title, 'Untitled article')}
      data-analytics-prop-featured={featured ? 'true' : 'false'}
      data-analytics-prop-category={getPostCategory(post)}
      className={`ignai-article-card ${featured ? 'ignai-article-card--featured' : ''}`}
    >
      <div className='ignai-article-cover'>
        <Image
          src={getPostCover(post)}
          alt={post?.title || ''}
          fill
          sizes={featured ? '(max-width: 768px) 100vw, 56vw' : '(max-width: 768px) 100vw, 33vw'}
        />
      </div>
      <div className='ignai-article-body'>
        <div className='ignai-article-meta'>
          <span>{getPostCategory(post)}</span>
          {post?.publishDay && <span>{post.publishDay}</span>}
        </div>
        {authors.length > 0 && (
          <div className='ignai-article-authorline'>
            <span>By</span>
            <strong>{authors.join(' / ')}</strong>
          </div>
        )}
        <h3>{compactText(post?.title, 'Untitled article')}</h3>
        {post?.summary && <p>{post.summary}</p>}
        {tags.length > 0 && (
          <div className='ignai-article-tags'>
            {tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </SmartLink>
  )
}

export function HomeArticlesSection({ posts = [] }) {
  const visiblePosts = posts.filter(Boolean).slice(0, 4)
  if (visiblePosts.length === 0) return null

  return (
    <section id='articles' className='ignai-home-section ignai-home-articles-section'>
      <div className='ignai-section-divider' />
      <div className='ignai-section-atmosphere' />
      <div className='ignai-home-container'>
        <div className='ignai-articles-section-head'>
          <div>
            <p className='section-eyebrow'>Articles</p>
            <h2 className='section-title mt-6 max-w-[13ch]'>
              内容文章，
              <br />
              组织成线索。
            </h2>
            <p className='section-body mt-6'>
              承接成员观点、活动复盘、工具实践和长期写作，让内容不只是发布，而是成为社区记忆。
            </p>
          </div>
          <SmartLink
            href='/archive'
            className='ignai-cta-secondary'
            data-analytics-event='click_view_articles'
            data-analytics-label='home_articles_all'
            data-analytics-prop-placement='home_articles'
          >
            查看全部文章
          </SmartLink>
        </div>

        <div className='ignai-home-articles-grid'>
          {visiblePosts.map((post, index) => (
            <PostArticleCard
              key={post.id || post.href || post.slug || index}
              post={post}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function PostCollectionPage({
  posts = [],
  eyebrow = 'Articles',
  title = '内容文章',
  description = '成员观点、活动复盘、工具实践和社区写作会在这里集中展示。',
  emptyText = '还没有可展示的文章。'
}) {
  const visiblePosts = posts.filter(Boolean)

  return (
    <section className='ignai-articles-page'>
      <div className='ignai-articles-page-inner'>
        <div className='ignai-articles-page-head'>
          <p className='section-eyebrow'>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {visiblePosts.length > 0 ? (
          <div id='posts-wrapper' className='ignai-articles-grid'>
            {visiblePosts.map((post, index) => (
              <PostArticleCard
                key={post.id || post.href || post.slug || index}
                post={post}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className='ignai-articles-empty'>{emptyText}</div>
        )}
      </div>
    </section>
  )
}
