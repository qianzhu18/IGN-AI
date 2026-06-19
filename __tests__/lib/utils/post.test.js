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
  isPasswordProtectedPost,
  processPostData,
  redactPasswordProtectedSummary,
  resolveRelatedEventsForPost,
  resolveRelatedMembersForPost,
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
      author_slug: 'alice-direct',
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

  it('supports top-level member author_slug aliases from normalized Notion members', () => {
    const authors = resolveAuthorsForPost(
      {
        title: 'Post D2',
        author_slug: 'alice-direct'
      },
      members
    )

    expect(authors.map(author => author.id)).toEqual(['member-2'])
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

describe('password protected posts', () => {
  it('detects non-empty password hashes', () => {
    expect(isPasswordProtectedPost({ password: 'hash' })).toBe(true)
    expect(isPasswordProtectedPost({ password: '   ' })).toBe(false)
    expect(isPasswordProtectedPost({})).toBe(false)
  })

  it('redacts summaries from protected list items', () => {
    expect(
      redactPasswordProtectedSummary({
        title: 'Locked',
        password: 'hash',
        summary: 'secret preview'
      })
    ).toMatchObject({
      title: 'Locked',
      password: 'hash',
      summary: ''
    })

    expect(
      redactPasswordProtectedSummary({
        title: 'Public',
        summary: 'public preview'
      })
    ).toMatchObject({
      title: 'Public',
      summary: 'public preview'
    })
  })

  it('does not precompute content metadata for locked post details', async () => {
    const props = {
      post: {
        id: 'post-1',
        type: 'Post',
        status: 'Published',
        password: 'hash',
        content: ['heading-1'],
        toc: [{ id: 'heading-1', text: 'Private heading' }],
        wordCount: 10,
        readTime: 1,
        blockMap: {
          block: {
            'post-1': { value: { id: 'post-1', type: 'page' } },
            'heading-1': {
              value: {
                id: 'heading-1',
                parent_id: 'post-1',
                type: 'header',
                properties: { title: [['Private heading']] }
              }
            }
          }
        }
      },
      allPages: []
    }

    await processPostData(props, 'test')

    expect(props.post.blockMap).toBeTruthy()
    expect(props.post.content).toBeUndefined()
    expect(props.post.toc).toBeUndefined()
    expect(props.post.wordCount).toBeUndefined()
    expect(props.post.readTime).toBeUndefined()
  })
})

describe('resolveRelatedMembersForPost', () => {
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
      role: 'Connector'
    }
  ]

  it('keeps resolved authors and adds explicit related member fields', () => {
    const authors = resolveAuthorsForPost(
      { author_slug: 'qianzhu' },
      members
    )
    const relatedMembers = resolveRelatedMembersForPost(
      {
        member_slugs: 'alice-chen',
        ext: {
          members: 'Qianzhu'
        }
      },
      members,
      authors
    )

    expect(relatedMembers.map(member => member.id)).toEqual([
      'member-1',
      'member-2'
    ])
  })

  it('supports object candidates from ext relatedMembers', () => {
    const relatedMembers = resolveRelatedMembersForPost(
      {
        ext: {
          relatedMembers: [{ slug: 'members/alice-chen' }]
        }
      },
      members
    )

    expect(relatedMembers.map(member => member.title)).toEqual(['Alice Chen'])
  })
})

describe('resolveRelatedEventsForPost', () => {
  const events = [
    {
      id: 'event-1',
      type: 'Event',
      status: 'Published',
      title: 'OPC 投票夜',
      slug: 'events/opc-vote-night',
      summary: '一起参与 OPC。',
      ext: {
        status: 'ongoing',
        eventDateText: '2026 / 06 / 04',
        location: 'Changsha'
      }
    },
    {
      id: 'event-2',
      type: 'Event',
      status: 'Published',
      title: 'Agent Workshop',
      slug: 'agent-workshop',
      ext: {
        status: 'planning'
      }
    }
  ]

  it('resolves related events from slug fields and ext arrays', () => {
    const relatedEvents = resolveRelatedEventsForPost(
      {
        event_slug: 'opc-vote-night',
        ext: {
          event_slugs: ['events/agent-workshop']
        }
      },
      events
    )

    expect(relatedEvents.map(event => event.title)).toEqual([
      'OPC 投票夜',
      'Agent Workshop'
    ])
    expect(relatedEvents[0]).toMatchObject({
      href: '/events/opc-vote-night',
      status: 'ongoing',
      dateText: '2026 / 06 / 04',
      location: 'Changsha'
    })
  })

  it('resolves related events by title fallback', () => {
    const relatedEvents = resolveRelatedEventsForPost(
      {
        related_events: 'Agent Workshop'
      },
      events
    )

    expect(relatedEvents.map(event => event.id)).toEqual(['event-2'])
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
