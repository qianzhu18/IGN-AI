import BLOG from '@/blog.config'

function compactCandidateNames(values = []) {
  return [...new Set(values.filter(value => typeof value === 'string' && value.trim()))]
}

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

function slugifyMemberTitle(title, pageId) {
  const asciiSlug = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (asciiSlug) {
    return asciiSlug
  }

  const stableId = String(pageId || '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
    .slice(-12)

  return `member-${stableId || Date.now()}`
}

export function normalizeMemberSlug(rawSlug, title, pageId) {
  const cleaned = readFirstString(rawSlug).replace(/^\/+|\/+$/g, '')

  if (cleaned && !/^https?:\/\//i.test(cleaned)) {
    const terminal = cleaned.split('/').filter(Boolean).pop()
    if (terminal) {
      return `members/${terminal}`
    }
  }

  return `members/${slugifyMemberTitle(title, pageId)}`
}

export function readDataSourcePropertyValue(property) {
  if (!property || typeof property !== 'object') return null

  switch (property.type) {
    case 'title':
      return (property.title || []).map(item => item.plain_text || '').join('')
    case 'rich_text':
      return (property.rich_text || []).map(item => item.plain_text || '').join('')
    case 'url':
      return property.url || ''
    case 'select':
      return property.select?.name || ''
    case 'status':
      return property.status?.name || ''
    case 'checkbox':
      return property.checkbox === true
    case 'number':
      return property.number
    case 'date':
      return property.date?.start || ''
    case 'multi_select':
      return (property.multi_select || []).map(item => item.name).filter(Boolean)
    default:
      return property[property.type] ?? null
  }
}

export function getMemberDataSourcePropertyCandidates() {
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}

  return {
    title: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_TITLE,
      fieldNames.title,
      'title',
      'Title'
    ]),
    type: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_TYPE,
      fieldNames.type,
      'type',
      'Type'
    ]),
    status: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_STATUS,
      fieldNames.status,
      'status',
      'Status'
    ]),
    slug: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_SLUG,
      fieldNames.slug,
      'slug',
      'Slug'
    ]),
    summary: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_SUMMARY,
      fieldNames.summary,
      'summary',
      'Summary'
    ]),
    avatar: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_AVATAR,
      'avatar',
      'Avatar'
    ]),
    role: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_ROLE,
      'role',
      'Role'
    ]),
    bio: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_BIO,
      'bio',
      'Bio'
    ]),
    quote: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_QUOTE,
      'quote',
      'Quote'
    ]),
    featured: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_FEATURED,
      'featured',
      'Featured'
    ]),
    verified: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_VERIFIED,
      'verified',
      'Verified'
    ]),
    website: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_WEBSITE,
      'website',
      'Website'
    ]),
    joinedAtText: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_JOINED_AT_TEXT,
      'joinedAtText',
      'joined_at_text',
      'joinedAt',
      'Joined At'
    ]),
    sortOrder: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_SORT_ORDER,
      'sortOrder',
      'sort_order',
      'Sort Order'
    ]),
    authorSlug: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_AUTHOR_SLUG,
      'author_slug',
      'authorSlug',
      'Author Slug'
    ]),
    socialGithub: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_SOCIAL_GITHUB,
      'social_github',
      'github',
      'GitHub'
    ]),
    socialX: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_SOCIAL_X,
      'social_x',
      'twitter',
      'x',
      'Twitter',
      'X'
    ]),
    socialLinkedin: compactCandidateNames([
      process.env.NOTION_MEMBERS_PROP_SOCIAL_LINKEDIN,
      'social_linkedin',
      'linkedin',
      'LinkedIn'
    ])
  }
}

export function findDataSourcePropertyKey(dataSource, candidateNames = []) {
  for (const candidateName of candidateNames) {
    if (dataSource?.properties?.[candidateName]) {
      return candidateName
    }

    const lowerCandidate = candidateName.toLowerCase()
    if (dataSource?.properties?.[lowerCandidate]) {
      return lowerCandidate
    }

    for (const [key, schema] of Object.entries(dataSource?.properties || {})) {
      if (schema?.name?.toLowerCase() === lowerCandidate) {
        return key
      }
    }
  }

  return null
}

export function mapOfficialMemberPage(page, dataSource) {
  const propertyCandidates = getMemberDataSourcePropertyCandidates()

  const getValue = logicalName => {
    const key = findDataSourcePropertyKey(
      dataSource,
      propertyCandidates[logicalName] || []
    )

    return key ? readDataSourcePropertyValue(page?.properties?.[key]) : null
  }

  const title = readFirstString(getValue('title'))
  const slug = normalizeMemberSlug(getValue('slug'), title, page?.id)
  const avatar = readFirstString(getValue('avatar'))
  const role = readFirstString(getValue('role'))
  const bio = readFirstString(getValue('bio'))
  const summary = readFirstString(getValue('summary'))
  const quote = readFirstString(getValue('quote'))
  const website = readFirstString(getValue('website'))
  const joinedAtText = readFirstString(getValue('joinedAtText'))
  const authorSlug = readFirstString(getValue('authorSlug'))
  const socialGithub = readFirstString(getValue('socialGithub'))
  const socialX = readFirstString(getValue('socialX'))
  const socialLinkedin = readFirstString(getValue('socialLinkedin'))
  const sortOrder = readFirstNumber(getValue('sortOrder'))
  const verified = getValue('verified') === true

  const ext = {}
  if (authorSlug) ext.author_slug = authorSlug
  if (joinedAtText) ext.joinedAtText = joinedAtText
  if (sortOrder !== null) ext.sortOrder = sortOrder
  if (verified) ext.verified = true

  return {
    id: page.id,
    title,
    slug,
    href: `/${slug}`,
    summary,
    avatar,
    role,
    bio,
    quote,
    featured: getValue('featured') === true,
    verified,
    website,
    joinedAtText,
    sortOrder,
    author_slug: authorSlug,
    social_github: socialGithub,
    social_x: socialX,
    social_linkedin: socialLinkedin,
    github: socialGithub,
    x: socialX,
    twitter: socialX,
    linkedin: socialLinkedin,
    type: 'Member',
    status: 'Published',
    pageIcon: avatar || '/avatar.svg',
    ext
  }
}
