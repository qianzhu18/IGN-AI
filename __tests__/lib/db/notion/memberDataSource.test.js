jest.mock('@/blog.config', () => ({
  __esModule: true,
  default: {
    NOTION_PROPERTY_NAME: {
      title: 'title',
      type: 'type',
      type_member: 'Member',
      status: 'status',
      status_publish: 'Published',
      slug: 'slug',
      summary: 'summary'
    }
  }
}))

import {
  findDataSourcePropertyKey,
  mapOfficialMemberPage,
  normalizeMemberSlug
} from '@/lib/db/notion/memberDataSource'

function titleValue(content) {
  return {
    type: 'title',
    title: [{ plain_text: content }]
  }
}

function textValue(content) {
  return {
    type: 'rich_text',
    rich_text: [{ plain_text: content }]
  }
}

describe('memberDataSource helpers', () => {
  afterEach(() => {
    delete process.env.NOTION_MEMBERS_PROP_SOCIAL_GITHUB
  })

  it('normalizes member slugs to the /members namespace', () => {
    expect(normalizeMemberSlug('alice-chen', 'Alice Chen', 'page-1')).toBe(
      'members/alice-chen'
    )
    expect(normalizeMemberSlug('/members/alice-chen/', 'Alice Chen', 'page-1')).toBe(
      'members/alice-chen'
    )
    expect(normalizeMemberSlug('', 'Alice Chen', 'page-1')).toBe(
      'members/alice-chen'
    )
    expect(normalizeMemberSlug('', '', '1234-5678')).toBe('members/member-12345678')
  })

  it('finds property keys by direct key, lowercase key, and schema name', () => {
    const dataSource = {
      properties: {
        FancyGithubKey: { name: 'social_github', type: 'url' }
      }
    }

    expect(findDataSourcePropertyKey(dataSource, ['social_github'])).toBe(
      'FancyGithubKey'
    )
  })

  it('maps official member pages using the current IGNAI schema fields', () => {
    const dataSource = {
      properties: {
        title: { name: 'title', type: 'title' },
        type: { name: 'type', type: 'select' },
        status: { name: 'status', type: 'select' },
        slug: { name: 'slug', type: 'rich_text' },
        summary: { name: 'summary', type: 'rich_text' },
        role: { name: 'role', type: 'rich_text' },
        bio: { name: 'bio', type: 'rich_text' },
        quote: { name: 'quote', type: 'rich_text' },
        avatar: { name: 'avatar', type: 'url' },
        featured: { name: 'featured', type: 'checkbox' },
        verified: { name: 'verified', type: 'checkbox' },
        joinedAtText: { name: 'joinedAtText', type: 'rich_text' },
        sortOrder: { name: 'sortOrder', type: 'number' },
        author_slug: { name: 'author_slug', type: 'rich_text' },
        social_github: { name: 'social_github', type: 'url' },
        social_x: { name: 'social_x', type: 'url' },
        social_linkedin: { name: 'social_linkedin', type: 'url' },
        website: { name: 'website', type: 'url' }
      }
    }
    const page = {
      id: 'member-page-id',
      properties: {
        title: titleValue('Alice Chen'),
        slug: textValue('alice-chen'),
        summary: textValue('Builder and connector'),
        role: textValue('Organizer'),
        bio: textValue('Building local AI momentum.'),
        quote: textValue('Ship with the community.'),
        avatar: { type: 'url', url: 'https://example.com/alice.png' },
        featured: { type: 'checkbox', checkbox: true },
        verified: { type: 'checkbox', checkbox: true },
        joinedAtText: textValue('2026 / 05'),
        sortOrder: { type: 'number', number: 2 },
        author_slug: textValue('alice'),
        social_github: { type: 'url', url: 'https://github.com/alice' },
        social_x: { type: 'url', url: 'https://x.com/alice' },
        social_linkedin: { type: 'url', url: 'https://linkedin.com/in/alice' },
        website: { type: 'url', url: 'https://alice.dev' }
      }
    }

    expect(mapOfficialMemberPage(page, dataSource)).toEqual({
      id: 'member-page-id',
      title: 'Alice Chen',
      slug: 'members/alice-chen',
      href: '/members/alice-chen',
      summary: 'Builder and connector',
      avatar: 'https://example.com/alice.png',
      role: 'Organizer',
      bio: 'Building local AI momentum.',
      quote: 'Ship with the community.',
      featured: true,
      verified: true,
      website: 'https://alice.dev',
      joinedAtText: '2026 / 05',
      sortOrder: 2,
      author_slug: 'alice',
      social_github: 'https://github.com/alice',
      social_x: 'https://x.com/alice',
      social_linkedin: 'https://linkedin.com/in/alice',
      github: 'https://github.com/alice',
      x: 'https://x.com/alice',
      twitter: 'https://x.com/alice',
      linkedin: 'https://linkedin.com/in/alice',
      type: 'Member',
      status: 'Published',
      pageIcon: 'https://example.com/alice.png',
      ext: {
        author_slug: 'alice',
        joinedAtText: '2026 / 05',
        sortOrder: 2,
        verified: true
      }
    })
  })
})
