import { render, screen } from '@testing-library/react'
import MemberProfilePage from '@/src/components/members/MemberProfilePage'

jest.mock('@/lib/utils/post', () => ({
  getMemberPagePath: member => {
    const slug = member?.slug || member?.href || member?.id || ''
    const terminal = String(slug).split('/').filter(Boolean).pop()
    return terminal ? `/members/${terminal}` : '/members'
  }
}))

describe('MemberProfilePage', () => {
  it('renders base member info with avatar and bio fallbacks', () => {
    render(
      <MemberProfilePage
        siteInfo={{ description: 'Community member profile.' }}
        member={{
          id: 'member-1',
          title: 'Qianzhu',
          slug: 'members/qianzhu',
          role: 'Builder'
        }}
      />
    )

    expect(screen.getByRole('heading', { name: 'Qianzhu' })).toBeInTheDocument()
    expect(screen.getByText('Builder')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Qianzhu' })).toHaveAttribute(
      'src',
      '/avatar.svg'
    )
    expect(screen.getByText('Community member profile.')).toBeInTheDocument()
  })

  it('does not render empty social links when social fields are missing', () => {
    render(
      <MemberProfilePage
        member={{
          id: 'member-1',
          title: 'Qianzhu',
          slug: 'members/qianzhu'
        }}
      />
    )

    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'X' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Website' })).not.toBeInTheDocument()
  })

  it('renders an empty authored posts state when no posts are linked', () => {
    render(
      <MemberProfilePage
        member={{
          id: 'member-1',
          title: 'Qianzhu',
          slug: 'members/qianzhu'
        }}
        authoredPosts={[]}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Related posts' })
    ).toBeInTheDocument()
    expect(screen.getByText('No authored posts linked yet.')).toBeInTheDocument()
  })

  it('renders authored posts and author links when posts are present', () => {
    render(
      <MemberProfilePage
        member={{
          id: 'member-1',
          title: 'Qianzhu',
          slug: 'members/qianzhu'
        }}
        authoredPosts={[
          {
            id: 'post-1',
            title: 'Member Notes',
            href: '/member-notes',
            summary: 'A field note from the community.',
            publishDay: '2026-05-15',
            authors: [
              {
                id: 'member-1',
                title: 'Qianzhu',
                slug: 'members/qianzhu'
              }
            ]
          }
        ]}
      />
    )

    expect(screen.getByRole('link', { name: 'Member Notes' })).toHaveAttribute(
      'href',
      '/member-notes'
    )
    expect(screen.getByText('A field note from the community.')).toBeInTheDocument()
    expect(screen.getByText('2026-05-15')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Qianzhu' })).toHaveAttribute(
      'href',
      '/members/qianzhu'
    )
  })
})
