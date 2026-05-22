import {
  extractMemberPathSlug,
  getMemberJoinedAtText,
  getMemberQuote,
  getMemberSortOrder,
  getMemberVerificationStatus,
  getPublishedMembers,
  isFeaturedMember,
  isVerifiedMember,
  sortMembers
} from '@/lib/utils/member'

describe('member utils', () => {
  it('detects featured members from common truthy values', () => {
    expect(isFeaturedMember({ featured: true })).toBe(true)
    expect(isFeaturedMember({ featured: 'featured' })).toBe(true)
    expect(isFeaturedMember({ featured: '0' })).toBe(false)
  })

  it('resolves verification status from boolean or string fields', () => {
    expect(getMemberVerificationStatus({ verified: true })).toBe('verified')
    expect(getMemberVerificationStatus({ verified: ' yes ' })).toBe('verified')
    expect(getMemberVerificationStatus({ approved: 1 })).toBe('verified')
    expect(getMemberVerificationStatus({ ext: { approved: true } })).toBe(
      'verified'
    )
    expect(getMemberVerificationStatus({ verification_status: 'approved' })).toBe(
      'verified'
    )
    expect(getMemberVerificationStatus({ verificationStatus: 'core' })).toBe(
      'verified'
    )
    expect(getMemberVerificationStatus({ member_status: 'pending' })).toBe('pending')
    expect(getMemberVerificationStatus({ ext: { memberStatus: 'guest' } })).toBe(
      'guest'
    )
    expect(getMemberVerificationStatus({ verification_status: 'observer' })).toBe(
      'guest'
    )
    expect(getMemberVerificationStatus({ verification_status: '  ' })).toBe('')
  })

  it('reads quote and joined text from fallback fields', () => {
    expect(getMemberQuote({ quote: 'Keep shipping.' })).toBe('Keep shipping.')
    expect(getMemberQuote({ ext: { quote: 'Build in public.' } })).toBe(
      'Build in public.'
    )
    expect(getMemberJoinedAtText({ joinedAtText: '2024 / 09' })).toBe('2024 / 09')
    expect(getMemberJoinedAtText({ join_year: '2026 / 05' })).toBe('2026 / 05')
    expect(getMemberQuote({ headline: 'Ship the thing.' })).toBe('Ship the thing.')
    expect(getMemberJoinedAtText({ ext: { joinedAtText: '2025 / 11' } })).toBe(
      '2025 / 11'
    )
  })

  it('reads sort order from top-level and ext fallback fields', () => {
    expect(getMemberSortOrder({ sortOrder: 2 })).toBe(2)
    expect(getMemberSortOrder({ sort_order: '5' })).toBe(5)
    expect(getMemberSortOrder({ ext: { sortOrder: '6' } })).toBe(6)
    expect(getMemberSortOrder({ ext: { sort_order: '7' } })).toBe(7)
    expect(getMemberSortOrder({ sortOrder: 'not-a-number' })).toBeNull()
  })

  it('filters published members only', () => {
    const members = [
      { id: '1', status: 'Published' },
      { id: '2', status: 'Invisible' }
    ]

    expect(getPublishedMembers(members).map(member => member.id)).toEqual(['1'])
  })

  it('sorts featured and verified members ahead of others', () => {
    const members = [
      {
        id: 'later',
        title: 'Later',
        status: 'Published',
        publishDate: 2
      },
      {
        id: 'verified',
        title: 'Verified',
        status: 'Published',
        verification_status: 'verified',
        publishDate: 1
      },
      {
        id: 'featured',
        title: 'Featured',
        status: 'Published',
        featured: true,
        publishDate: 0
      }
    ]

    expect(sortMembers(members).map(member => member.id)).toEqual([
      'featured',
      'verified',
      'later'
    ])
    expect(isVerifiedMember(members[1])).toBe(true)
  })

  it('keeps featured priority ahead of verified and falls back to publishDate next', () => {
    const members = [
      {
        id: 'featured-older',
        title: 'Featured Older',
        status: 'Published',
        featured: true,
        publishDate: 1
      },
      {
        id: 'verified-newer',
        title: 'Verified Newer',
        status: 'Published',
        verified: true,
        publishDate: 999
      },
      {
        id: 'plain-newer',
        title: 'Plain Newer',
        status: 'Published',
        publishDate: 1000
      },
      {
        id: 'plain-older',
        title: 'Plain Older',
        status: 'Published',
        publishDate: 10
      }
    ]

    expect(sortMembers(members).map(member => member.id)).toEqual([
      'featured-older',
      'verified-newer',
      'plain-newer',
      'plain-older'
    ])
  })

  it('sorts by sortOrder before publish date when featured and verified are tied', () => {
    const members = [
      {
        id: 'later',
        title: 'Later',
        status: 'Published',
        publishDate: 20
      },
      {
        id: 'ordered',
        title: 'Ordered',
        status: 'Published',
        sortOrder: 1,
        publishDate: 1
      },
      {
        id: 'ordered-ext',
        title: 'Ordered Ext',
        status: 'Published',
        ext: { sort_order: '3' },
        publishDate: 99
      }
    ]

    expect(sortMembers(members).map(member => member.id)).toEqual([
      'ordered',
      'ordered-ext',
      'later'
    ])
  })

  it('uses title as the final fallback when publishDate is also tied', () => {
    const members = [
      { id: 'gamma', title: 'Gamma', status: 'Published', publishDate: 0 },
      { id: 'alpha', title: 'Alpha', status: 'Published', publishDate: 0 },
      { id: 'beta', title: 'Beta', status: 'Published', publishDate: 0 }
    ]

    expect(sortMembers(members).map(member => member.id)).toEqual([
      'alpha',
      'beta',
      'gamma'
    ])
  })

  it('falls back to title sorting when other member weights are equal', () => {
    const members = [
      { id: 'b', title: 'Beta', status: 'Published', publishDate: 0 },
      { id: 'a', title: 'Alpha', status: 'Published', publishDate: 0 }
    ]

    expect(sortMembers(members).map(member => member.id)).toEqual(['a', 'b'])
  })

  it('extracts member route slugs from normalized and irregular inputs', () => {
    expect(extractMemberPathSlug('members/qianzhu', 'member-1')).toBe('qianzhu')
    expect(extractMemberPathSlug('qianzhu', 'member-1')).toBe('qianzhu')
    expect(extractMemberPathSlug('/members/qianzhu/', 'member-1')).toBe(
      'qianzhu'
    )
    expect(extractMemberPathSlug('community/members/qianzhu', 'member-1')).toBe(
      'qianzhu'
    )
    expect(extractMemberPathSlug('', 'member-1')).toBe('member-1')
    expect(extractMemberPathSlug(undefined, 'member-1')).toBe('member-1')
  })
})
