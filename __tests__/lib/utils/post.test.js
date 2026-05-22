jest.mock('@/lib/plugins/algolia', () => ({
  uploadDataToAlgolia: jest.fn()
}))

jest.mock('@/lib/db/notion/getPageContentText', () => ({
  getPageContentText: jest.fn(() => '')
}))

jest.mock('@/lib/db/notion/getPageTableOfContents', () => ({
  getPageTableOfContents: jest.fn(() => [])
}))

jest.mock('@/lib/plugins/wordCount', () => ({
  countWords: jest.fn(() => ({ wordCount: 0, readTime: 0 }))
}))

import {
  getMemberAuthoredPosts,
  getMemberPagePath,
  resolveAuthorsForPost
} from '@/lib/utils/post'

describe('resolveAuthorsForPost', () => {
  const members = [
    {
      id: 'member-1',
      title: 'Qianzhu',
      slug: 'members/qianzhu',
      role: 'Builder'
    },
    {
      id: 'member-2',
      title: 'Alice Chen',
      slug: 'members/alice-chen',
      role: 'Connector',
      ext: {
        author_slug: 'alice'
      }
    }
  ]

  it('prefers explicit author slugs from ext', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post A',
        ext: {
          author_slugs: ['qianzhu', 'alice']
        }
      },
      members
    )

    expect(authors.map(author => author.title)).toEqual([
      'Qianzhu',
      'Alice Chen'
    ])
    expect(authors.map(author => author.href)).toEqual([
      '/members/qianzhu',
      '/members/alice-chen'
    ])
  })

  it('falls back to author title matching', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post B',
        author: 'Qianzhu'
      },
      members
    )

    expect(authors).toHaveLength(1)
    expect(authors[0].id).toBe('member-1')
  })

  it('resolves authors and ext.authors name fields with dedupe', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post B2',
        authors: ['Alice Chen', 'Qianzhu'],
        ext: {
          authors: 'Qianzhu, Alice Chen'
        }
      },
      members
    )

    expect(authors.map(author => author.id)).toEqual(['member-2', 'member-1'])
  })

  it('resolves direct author_slug and ext.author values with dedupe', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post C',
        author_slug: 'qianzhu',
        ext: {
          author: 'Qianzhu, Alice Chen'
        }
      },
      members
    )

    expect(authors.map(author => author.id)).toEqual(['member-1', 'member-2'])
  })

  it('supports comma-separated authorSlugs and member href fallback keys', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post D',
        authorSlugs: 'members/qianzhu, alice'
      },
      members
    )

    expect(authors.map(author => author.title)).toEqual([
      'Qianzhu',
      'Alice Chen'
    ])
  })

  it('prefers explicit slug candidates before name matches in mixed inputs', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post E',
        author_slugs: ['alice'],
        author: 'Qianzhu',
        ext: {
          author_slug: 'members/qianzhu',
          author: 'Alice Chen'
        }
      },
      members
    )

    expect(authors.map(author => author.id)).toEqual(['member-2', 'member-1'])
  })
})

describe('getMemberAuthoredPosts', () => {
  it('returns only published posts linked to the member', () => {
    const member = { id: 'member-1', slug: 'members/qianzhu' }
    const posts = [
      {
        id: 'post-1',
        type: 'Post',
        status: 'Published',
        authors: [{ id: 'member-1', title: 'Qianzhu' }]
      },
      {
        id: 'post-2',
        type: 'Post',
        status: 'Invisible',
        authors: [{ id: 'member-1', title: 'Qianzhu' }]
      },
      {
        id: 'post-3',
        type: 'Page',
        status: 'Published',
        authors: [{ id: 'member-1', title: 'Qianzhu' }]
      }
    ]

    expect(getMemberAuthoredPosts(member, posts).map(post => post.id)).toEqual([
      'post-1'
    ])
  })
})

describe('getMemberPagePath', () => {
  it('normalizes member routes to /members/[slug]', () => {
    expect(getMemberPagePath({ slug: 'members/qianzhu' })).toBe(
      '/members/qianzhu'
    )
    expect(getMemberPagePath({ slug: 'qianzhu' })).toBe('/members/qianzhu')
    expect(getMemberPagePath({ href: '/members/qianzhu' })).toBe(
      '/members/qianzhu'
    )
    expect(getMemberPagePath({ href: '/community/qianzhu' })).toBe(
      '/members/qianzhu'
    )
    expect(getMemberPagePath({ id: 'member-1' })).toBe('/members/member-1')
    expect(getMemberPagePath({})).toBe('/members')
  })
})
