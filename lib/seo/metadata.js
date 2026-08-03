const ABSOLUTE_HTTP_URL = /^https?:\/\//i

function readText(value) {
  const text = typeof value === 'string' ? value.trim() : ''
  return ['undefined', 'null'].includes(text.toLowerCase()) ? '' : text
}

function firstValue(...values) {
  for (const value of values) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (readText(value)) return value
  }
  return ''
}

function firstText(...values) {
  for (const value of values) {
    const text = readText(value)
    if (text) return text
  }
  return ''
}

function compactList(values = []) {
  return [...new Set(values.map(readText).filter(Boolean))]
}

function toSchemaDate(value) {
  let text = readText(value)
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return ''
    text = value.toISOString()
  } else if (typeof value === 'number') {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    text = date.toISOString()
  }
  if (!text) return ''

  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return ''
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : date.toISOString()
}

function toAbsoluteUrl(value, baseUrl) {
  const text = readText(value)
  if (!text) return ''
  if (ABSOLUTE_HTTP_URL.test(text)) return text

  const base = readText(baseUrl).replace(/\/+$/, '')
  if (!base) return ''
  return `${base}/${text.replace(/^\/+/, '')}`
}

export function buildAbsoluteUrl(base, ...parts) {
  const root = readText(base).replace(/\/+$/, '')
  if (!root) return ''

  const firstPart = parts.find(part => readText(part))
  if (ABSOLUTE_HTTP_URL.test(readText(firstPart))) return readText(firstPart)

  const pathname = parts
    .map(part => readText(part).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
  return pathname ? `${root}/${pathname.replace(/^\/+/, '')}` : root
}

export function resolveSeoImage(
  image,
  baseUrl,
  fallback = '/brand/ignai/og-default.jpg'
) {
  return toAbsoluteUrl(firstText(image, fallback), baseUrl)
}

export function getIndexingPolicy(route = '') {
  const normalizedRoute = readText(route)
  const noindex =
    normalizedRoute === '/404' ||
    normalizedRoute === '/500' ||
    normalizedRoute === '/search' ||
    normalizedRoute.startsWith('/search/') ||
    normalizedRoute === '/manage' ||
    normalizedRoute.startsWith('/manage/') ||
    normalizedRoute === '/dashboard' ||
    normalizedRoute.startsWith('/dashboard/') ||
    normalizedRoute === '/auth' ||
    normalizedRoute.startsWith('/auth/') ||
    normalizedRoute === '/sign-in' ||
    normalizedRoute.startsWith('/sign-in/') ||
    normalizedRoute === '/sign-up' ||
    normalizedRoute.startsWith('/sign-up/')

  return {
    index: !noindex,
    follow: true,
    content: noindex ? 'noindex, follow' : 'index, follow'
  }
}

function buildOrganization({
  siteUrl,
  siteTitle,
  siteDescription,
  logo,
  sameAs
}) {
  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: siteTitle,
    url: siteUrl,
    description: siteDescription
  }

  const logoUrl = toAbsoluteUrl(logo, siteUrl)
  if (logoUrl) {
    organization.logo = {
      '@type': 'ImageObject',
      url: logoUrl
    }
  }

  const socialProfiles = compactList(sameAs).filter(value =>
    ABSOLUTE_HTTP_URL.test(value)
  )
  if (socialProfiles.length > 0) organization.sameAs = socialProfiles

  return organization
}

function buildWebsite({ siteUrl, siteTitle, siteDescription, language, home }) {
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: siteTitle,
    description: siteDescription,
    url: siteUrl,
    inLanguage: language,
    publisher: { '@id': `${siteUrl}#organization` }
  }

  if (home) {
    website.potentialAction = {
      '@type': 'SearchAction',
      target: `${siteUrl}/search/{search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return website
}

function buildWebPage({
  url,
  title,
  description,
  siteUrl,
  language,
  pageType = 'WebPage'
}) {
  return {
    '@type': pageType,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: language,
    isPartOf: { '@id': `${siteUrl}#website` },
    about: { '@id': `${siteUrl}#organization` }
  }
}

function buildListEntity({ items, baseUrl, path, label }) {
  if (!Array.isArray(items) || items.length === 0) return null

  const elements = items
    .map((item, index) => {
      const title = firstText(item?.title, item?.name)
      const slug = firstText(item?.slug)
      if (!title || !slug) return null
      const normalizedSlug = slug.replace(
        /^\/?(?:members|events|records)\//,
        ''
      )

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: title,
        url: buildAbsoluteUrl(baseUrl, path, normalizedSlug)
      }
    })
    .filter(Boolean)

  if (elements.length === 0) return null

  return {
    '@type': 'ItemList',
    name: label,
    numberOfItems: elements.length,
    itemListElement: elements
  }
}

function buildMemberProfile({
  member,
  url,
  description,
  image,
  siteUrl,
  language
}) {
  const sameAs = compactList([
    member?.website,
    member?.social_github,
    member?.social_x,
    member?.social_linkedin,
    member?.github,
    member?.x,
    member?.linkedin
  ]).filter(value => ABSOLUTE_HTTP_URL.test(value))

  const person = {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: firstText(member?.title, 'IGNAI Member'),
    url,
    description,
    image
  }
  if (member?.role) person.jobTitle = member.role
  if (sameAs.length > 0) person.sameAs = sameAs

  return {
    ...buildWebPage({
      url,
      title: person.name,
      description,
      siteUrl,
      language,
      pageType: 'ProfilePage'
    }),
    mainEntity: person
  }
}

function buildArticle({
  article,
  meta,
  url,
  description,
  image,
  siteUrl,
  author
}) {
  const authors =
    Array.isArray(article?.authors) && article.authors.length > 0
      ? article.authors
          .map(item => firstText(item?.title, item?.name))
          .filter(Boolean)
          .map(name => ({ '@type': 'Person', name }))
      : [{ '@type': 'Person', name: firstText(author, 'IGNAI') }]

  const data = {
    '@type': article?.type === 'Record' ? 'Article' : 'BlogPosting',
    '@id': `${url}#article`,
    headline: firstText(article?.title, meta?.title),
    description,
    image: image ? [image] : undefined,
    url,
    author: authors,
    publisher: { '@id': `${siteUrl}#organization` },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    articleSection: firstText(article?.category, meta?.category),
    keywords: compactList([
      ...(Array.isArray(article?.tags) ? article.tags : []),
      ...(Array.isArray(meta?.tags) ? meta.tags : [])
    ])
  }

  const published = toSchemaDate(
    firstValue(article?.timelineDate, article?.publishDay, meta?.publishDay)
  )
  const modified = toSchemaDate(
    firstValue(article?.lastEditedDate, meta?.lastEditedDay, published)
  )
  if (published) data.datePublished = published
  if (modified) data.dateModified = modified
  if (!data.articleSection) delete data.articleSection
  if (!data.keywords.length) delete data.keywords
  if (!data.image) delete data.image

  return data
}

function buildEvent({ event, url, description, image, siteUrl }) {
  const startDate = toSchemaDate(
    firstValue(
      event?.startDate,
      event?.event_start?.start,
      event?.date?.start,
      event?.publishDay
    )
  )
  if (!startDate) return null

  const data = {
    '@type': 'Event',
    '@id': `${url}#event`,
    name: firstText(event?.title, 'IGNAI Event'),
    description,
    url,
    image: image ? [image] : undefined,
    startDate,
    organizer: { '@id': `${siteUrl}#organization` }
  }

  const endDate = toSchemaDate(
    firstValue(event?.endDate, event?.event_end?.start, event?.date?.end)
  )
  if (endDate) data.endDate = endDate

  const location = firstText(event?.location)
  if (location && location !== '待定') {
    data.location = {
      '@type': event?.format === 'online' ? 'VirtualLocation' : 'Place',
      name: location
    }
  }

  if (event?.registrationUrl) {
    data.offers = {
      '@type': 'Offer',
      url: event.registrationUrl,
      availability: 'https://schema.org/InStock'
    }
  }

  if (!data.image) delete data.image
  return data
}

export function buildStructuredData({
  route,
  meta = {},
  siteInfo = {},
  pageData = {},
  url,
  siteUrl,
  siteTitle,
  siteDescription,
  language = 'zh-CN',
  author,
  logo,
  sameAs = []
} = {}) {
  const resolvedSiteUrl = firstText(siteUrl, siteInfo?.link, url)
  const resolvedTitle = firstText(siteTitle, siteInfo?.title, 'IGNAI')
  const resolvedDescription = firstText(siteDescription, siteInfo?.description)
  const resolvedUrl = firstText(url, resolvedSiteUrl)
  const resolvedImage = firstText(
    meta?.image,
    pageData?.event?.cover,
    pageData?.record?.cover,
    pageData?.member?.avatar,
    siteInfo?.pageCover
  )
  const absoluteImage = toAbsoluteUrl(resolvedImage, resolvedSiteUrl)
  const graph = [
    buildOrganization({
      siteUrl: resolvedSiteUrl,
      siteTitle: resolvedTitle,
      siteDescription: resolvedDescription,
      logo: firstText(logo, siteInfo?.icon),
      sameAs
    }),
    buildWebsite({
      siteUrl: resolvedSiteUrl,
      siteTitle: resolvedTitle,
      siteDescription: resolvedDescription,
      language,
      home: route === '/'
    })
  ]

  const member = pageData?.member
  const event = pageData?.event
  const record = pageData?.record
  const post = pageData?.post
  const pageType =
    route === '/members' || route === '/events' || route === '/records'
      ? 'CollectionPage'
      : 'WebPage'

  let page = buildWebPage({
    url: resolvedUrl,
    title: firstText(meta?.title, resolvedTitle),
    description: firstText(meta?.description, resolvedDescription),
    siteUrl: resolvedSiteUrl,
    language,
    pageType
  })

  if (member && route === '/members/[slug]') {
    page = buildMemberProfile({
      member,
      url: resolvedUrl,
      description: firstText(
        meta?.description,
        member?.summary,
        member?.bio,
        resolvedDescription
      ),
      image: absoluteImage,
      siteUrl: resolvedSiteUrl,
      language
    })
  } else if (event && route === '/events/[slug]') {
    const eventData = buildEvent({
      event,
      url: resolvedUrl,
      description: firstText(
        meta?.description,
        event?.excerpt,
        event?.subtitle,
        resolvedDescription
      ),
      image: absoluteImage,
      siteUrl: resolvedSiteUrl
    })
    if (eventData) {
      page = { ...page, mainEntity: eventData }
      graph.push(eventData)
    }
  } else if (record && route === '/records/[slug]') {
    const article = buildArticle({
      article: record,
      meta,
      url: resolvedUrl,
      description: firstText(
        meta?.description,
        record?.excerpt,
        resolvedDescription
      ),
      image: absoluteImage,
      siteUrl: resolvedSiteUrl,
      author
    })
    page = { ...page, mainEntity: article }
    graph.push(article)
  } else if (post && meta?.type === 'Post') {
    const article = buildArticle({
      article: post,
      meta,
      url: resolvedUrl,
      description: firstText(
        meta?.description,
        post?.summary,
        resolvedDescription
      ),
      image: absoluteImage,
      siteUrl: resolvedSiteUrl,
      author
    })
    page = { ...page, mainEntity: article }
    graph.push(article)
  }

  if (route === '/members') {
    const list = buildListEntity({
      items: pageData?.members,
      baseUrl: resolvedSiteUrl,
      path: 'members',
      label: 'IGNAI 成员目录'
    })
    if (list) {
      page.mainEntity = list
      graph.push(list)
    }
  }
  if (route === '/events') {
    const list = buildListEntity({
      items: pageData?.events,
      baseUrl: resolvedSiteUrl,
      path: 'events',
      label: 'IGNAI 活动'
    })
    if (list) {
      page.mainEntity = list
      graph.push(list)
    }
  }
  if (route === '/records') {
    const list = buildListEntity({
      items: pageData?.records,
      baseUrl: resolvedSiteUrl,
      path: 'records',
      label: 'IGNAI 社区记录'
    })
    if (list) {
      page.mainEntity = list
      graph.push(list)
    }
  }

  graph.push(page)
  return {
    '@context': 'https://schema.org',
    '@graph': graph
  }
}

export function serializeJsonLd(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
