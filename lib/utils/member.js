function readFirstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return ''
}

function readFirstNumber(...values) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }
  return null
}

export function isTruthyMemberField(value) {
  if (Array.isArray(value)) {
    return value.some(item => isTruthyMemberField(item))
  }
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value > 0
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'y', 'on', 'featured', 'verified'].includes(
      value.trim().toLowerCase()
    )
  }
  return false
}

export function isFeaturedMember(member) {
  return isTruthyMemberField(member?.featured)
}

export function getMemberVerificationStatus(member) {
  if (
    isTruthyMemberField(member?.verified) ||
    isTruthyMemberField(member?.ext?.verified) ||
    isTruthyMemberField(member?.approved) ||
    isTruthyMemberField(member?.ext?.approved)
  ) {
    return 'verified'
  }

  const rawStatus = readFirstString(
    member?.verification_status,
    member?.verificationStatus,
    member?.member_status,
    member?.memberStatus,
    member?.ext?.verification_status,
    member?.ext?.verificationStatus,
    member?.ext?.member_status,
    member?.ext?.memberStatus
  ).toLowerCase()

  if (!rawStatus) return ''
  if (
    ['verified', 'approved', 'active', 'member', 'core', 'certified'].includes(
      rawStatus
    )
  ) {
    return 'verified'
  }
  if (['pending', 'review', 'submitted', 'applying'].includes(rawStatus)) {
    return 'pending'
  }
  if (['guest', 'friend', 'observer', 'visitor'].includes(rawStatus)) {
    return 'guest'
  }

  return rawStatus
}

export function getMemberVerificationLabel(member) {
  const status = getMemberVerificationStatus(member)
  const labels = {
    verified: 'Verified',
    pending: 'Pending',
    guest: 'Guest'
  }

  return labels[status] || ''
}

export function isVerifiedMember(member) {
  return getMemberVerificationStatus(member) === 'verified'
}

export function getMemberJoinedAtText(member) {
  return readFirstString(
    member?.joinedAtText,
    member?.joined_at_text,
    member?.joinYear,
    member?.join_year,
    member?.ext?.joinedAtText,
    member?.ext?.joined_at_text,
    member?.ext?.joinYear,
    member?.ext?.join_year
  )
}

export function getMemberQuote(member) {
  return readFirstString(
    member?.quote,
    member?.motto,
    member?.headline,
    member?.ext?.quote,
    member?.ext?.motto,
    member?.ext?.headline
  )
}

export function getMemberSortOrder(member) {
  return readFirstNumber(
    member?.sortOrder,
    member?.sort_order,
    member?.ext?.sortOrder,
    member?.ext?.sort_order
  )
}

export function extractMemberPathSlug(slug, fallbackId) {
  if (typeof slug === 'string' && slug.trim()) {
    return slug.split('/').filter(Boolean).pop()
  }
  return fallbackId
}

export function getPublishedMembers(allMembers = []) {
  if (!Array.isArray(allMembers)) return []
  return allMembers.filter(member => member?.status === 'Published')
}

export function sortMembers(members = []) {
  return [...members].sort((left, right) => {
    const featuredDelta = Number(isFeaturedMember(right)) - Number(isFeaturedMember(left))
    if (featuredDelta !== 0) return featuredDelta

    const verifiedDelta = Number(isVerifiedMember(right)) - Number(isVerifiedMember(left))
    if (verifiedDelta !== 0) return verifiedDelta

    const leftOrder = getMemberSortOrder(left)
    const rightOrder = getMemberSortOrder(right)
    if (leftOrder !== null || rightOrder !== null) {
      if (leftOrder === null) return 1
      if (rightOrder === null) return -1
      if (leftOrder !== rightOrder) return leftOrder - rightOrder
    }

    const publishDelta = (right?.publishDate || 0) - (left?.publishDate || 0)
    if (publishDelta !== 0) return publishDelta

    return String(left?.title || '').localeCompare(String(right?.title || ''))
  })
}
