import { render, screen } from '@testing-library/react'
import MemberDirectoryPage from '@/src/components/members/MemberDirectoryPage'

describe('MemberDirectoryPage', () => {
  it('renders fallback avatar and bio when optional member fields are missing', () => {
    render(
      <MemberDirectoryPage
        pageTitle='Members'
        pageDescription='People building with IGN AI.'
        members={[
          {
            id: 'member-1',
            title: 'Qianzhu',
            slug: 'members/qianzhu',
            status: 'Published'
          }
        ]}
      />
    )

    expect(screen.getByRole('heading', { name: 'Members' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Qianzhu/i })).toHaveAttribute(
      'href',
      '/members/qianzhu'
    )
    expect(screen.getByRole('img', { name: 'Qianzhu' })).toHaveAttribute(
      'src',
      '/avatar.svg'
    )
    expect(screen.getByText('No bio yet.')).toBeInTheDocument()
  })

  it('does not render quote copy when quote fallback fields are missing', () => {
    render(
      <MemberDirectoryPage
        pageTitle='Members'
        pageDescription='People building with IGN AI.'
        members={[
          {
            id: 'member-1',
            title: 'Qianzhu',
            slug: 'members/qianzhu',
            bio: 'Builder'
          }
        ]}
      />
    )

    expect(screen.getByText('Builder')).toBeInTheDocument()
    expect(screen.queryByText(/Build in public/i)).not.toBeInTheDocument()
  })

  it('renders the empty directory state when no members are published', () => {
    render(
      <MemberDirectoryPage
        pageTitle='Members'
        pageDescription='People building with IGN AI.'
        members={[]}
      />
    )

    expect(screen.getByText(/No published members yet/i)).toBeInTheDocument()
  })
})
