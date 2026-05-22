import { fetchGlobalAllData, resolvePostProps } from '@/lib/db/SiteDataApi'
import {
  getMemberAuthoredPosts,
  resolveAuthorsForPost
} from '@/lib/utils/post'
import { siteConfig } from '@/lib/config'
import { getStaticPaths, getStaticProps } from '@/pages/members/[slug]'

jest.mock('@/blog.config', () => ({
  NEXT_REVALIDATE_SECOND: 60
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultValue) => defaultValue)
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn(),
  resolvePostProps: jest.fn()
}))

jest.mock('@/lib/utils/post', () => ({
  getMemberAuthoredPosts: jest.fn(),
  resolveAuthorsForPost: jest.fn()
}))

jest.mock('@/src/components/members/MemberProfilePage', () => ({
  __esModule: true,
  default: () => null
}))

describe('pages/members/[slug]', () => {
  beforeEach(() => {
    fetchGlobalAllData.mockReset()
    resolvePostProps.mockReset()
    getMemberAuthoredPosts.mockReset()
    resolveAuthorsForPost.mockReset()
    siteConfig.mockClear()
    delete process.env.EXPORT
  })

  it('builds static paths from allMembers using normalized member slugs', async () => {
    fetchGlobalAllData.mockResolvedValue({
      allMembers: [
        { id: 'member-1', slug: 'members/qianzhu' },
        { id: 'member-2', slug: '/members/alice-chen/' },
        { id: 'member-3' }
      ]
    })

    await expect(getStaticPaths()).resolves.toEqual({
      paths: [
        { params: { slug: 'qianzhu' } },
        { params: { slug: 'alice-chen' } },
        { params: { slug: 'member-3' } }
      ],
      fallback: 'blocking'
    })
    expect(fetchGlobalAllData).toHaveBeenCalledWith({
      from: 'member-profile-paths'
    })
  })

  it('uses resolvePostProps when the resolved post is a Member', async () => {
    const member = {
      id: 'member-1',
      type: 'Member',
      title: 'Qianzhu',
      slug: 'members/qianzhu'
    }
    const relatedPost = { id: 'post-1', type: 'Post', status: 'Published' }
    const resolvedAuthor = { id: 'member-1', title: 'Qianzhu' }
    const authoredPost = {
      ...relatedPost,
      authors: [resolvedAuthor],
      publishDate: 2
    }

    resolvePostProps.mockResolvedValue({
      post: member,
      siteInfo: { title: 'IGN AI' },
      NOTION_CONFIG: { from: 'resolve' },
      allPages: ['remove-me'],
      allMembers: ['remove-me']
    })
    fetchGlobalAllData.mockResolvedValue({
      allPages: [relatedPost],
      allMembers: [member]
    })
    resolveAuthorsForPost.mockReturnValue([resolvedAuthor])
    getMemberAuthoredPosts.mockReturnValue([authoredPost])

    const result = await getStaticProps({
      params: { slug: 'qianzhu' },
      locale: 'zh-CN'
    })

    expect(resolvePostProps).toHaveBeenCalledWith({
      prefix: 'members',
      slug: 'qianzhu',
      locale: 'zh-CN',
      from: 'member-profile'
    })
    expect(fetchGlobalAllData).toHaveBeenCalledWith({
      from: 'member-profile-related-posts',
      locale: 'zh-CN'
    })
    expect(resolveAuthorsForPost).toHaveBeenCalledWith(relatedPost, [member])
    expect(getMemberAuthoredPosts).toHaveBeenCalledWith(member, [
      {
        ...relatedPost,
        authors: [resolvedAuthor]
      }
    ])
    expect(result.props.member).toBe(member)
    expect(result.props.post).toBe(member)
    expect(result.props.authoredPosts).toEqual([authoredPost])
    expect(result.props.allPages).toBeUndefined()
    expect(result.props.allMembers).toBeUndefined()
    expect(result.revalidate).toBe(60)
  })

  it('falls back to fetchGlobalAllData allMembers when resolvePostProps misses', async () => {
    const member = {
      id: 'member-1',
      type: 'Member',
      title: 'Qianzhu',
      slug: 'members/qianzhu'
    }
    const unrelatedMember = {
      id: 'member-2',
      type: 'Member',
      title: 'Alice',
      slug: 'members/alice'
    }
    const authoredPosts = [
      { id: 'post-newer', type: 'Post', status: 'Published', publishDate: 20 },
      { id: 'post-older', type: 'Post', status: 'Published', publishDate: 10 }
    ]

    resolvePostProps.mockResolvedValue({ post: null })
    fetchGlobalAllData.mockResolvedValue({
      allMembers: [unrelatedMember, member],
      allPages: [{ id: 'post-1', type: 'Post', status: 'Published' }],
      latestPosts: ['remove-me'],
      allNavPages: ['remove-me'],
      siteInfo: { title: 'IGN AI' },
      NOTION_CONFIG: { from: 'fallback' }
    })
    resolveAuthorsForPost.mockReturnValue([{ id: member.id, title: member.title }])
    getMemberAuthoredPosts.mockReturnValue(authoredPosts)

    const result = await getStaticProps({
      params: { slug: 'qianzhu' },
      locale: 'zh-CN'
    })

    expect(fetchGlobalAllData).toHaveBeenCalledTimes(1)
    expect(fetchGlobalAllData).toHaveBeenCalledWith({
      from: 'member-profile-fallback',
      locale: 'zh-CN'
    })
    expect(result.props.member).toBe(member)
    expect(result.props.post).toBe(member)
    expect(result.props.authoredPosts.map(post => post.id)).toEqual([
      'post-newer',
      'post-older'
    ])
    expect(result.props.latestPosts).toBeUndefined()
    expect(result.props.allNavPages).toBeUndefined()
  })

  it('returns notFound when no Member can be resolved', async () => {
    resolvePostProps.mockResolvedValue({
      post: { id: 'post-1', type: 'Post', title: 'Not a member' }
    })
    fetchGlobalAllData.mockResolvedValue({
      allMembers: [
        {
          id: 'member-1',
          type: 'Member',
          title: 'Alice',
          slug: 'members/alice'
        }
      ]
    })

    await expect(
      getStaticProps({ params: { slug: 'qianzhu' }, locale: 'zh-CN' })
    ).resolves.toEqual({
      notFound: true,
      revalidate: 60
    })
    expect(getMemberAuthoredPosts).not.toHaveBeenCalled()
    expect(resolveAuthorsForPost).not.toHaveBeenCalled()
  })

  it('sorts and limits authoredPosts generated by route helpers', async () => {
    const member = {
      id: 'member-1',
      type: 'Member',
      title: 'Qianzhu',
      slug: 'members/qianzhu'
    }
    const pages = Array.from({ length: 8 }, (_, index) => ({
      id: `post-${index + 1}`,
      type: 'Post',
      status: 'Published'
    }))
    const authoredPosts = pages.map((post, index) => ({
      ...post,
      publishDate: index + 1
    }))

    resolvePostProps.mockResolvedValue({ post: member })
    fetchGlobalAllData.mockResolvedValue({
      allMembers: [member],
      allPages: pages
    })
    resolveAuthorsForPost.mockImplementation(post => [
      { id: member.id, title: `${member.title}-${post.id}` }
    ])
    getMemberAuthoredPosts.mockReturnValue(authoredPosts)

    const result = await getStaticProps({
      params: { slug: 'qianzhu' },
      locale: 'zh-CN'
    })

    expect(resolveAuthorsForPost).toHaveBeenCalledTimes(8)
    expect(getMemberAuthoredPosts).toHaveBeenCalledWith(
      member,
      pages.map(post => ({
        ...post,
        authors: [{ id: member.id, title: `${member.title}-${post.id}` }]
      }))
    )
    expect(result.props.authoredPosts.map(post => post.id)).toEqual([
      'post-8',
      'post-7',
      'post-6',
      'post-5',
      'post-4',
      'post-3'
    ])
  })
})
