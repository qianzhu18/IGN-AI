const loadGetPageProperties = (propertyNameOverrides = {}) => {
  jest.resetModules()

  jest.doMock('@/blog.config', () => ({
    __esModule: true,
    default: {
      LANG: 'zh-CN',
      HOME_BANNER_IMAGE: '',
      NOTION_PAGE_ID: 'test-page-id',
      NOTION_PROPERTY_NAME: {
        password: 'password',
        type: 'type',
        type_post: 'Post',
        type_page: 'Page',
        type_member: 'Member',
        type_notice: 'Notice',
        type_menu: 'Menu',
        type_sub_menu: 'SubMenu',
        status: 'status',
        status_publish: 'Published',
        status_invisible: 'Invisible',
        title: 'title',
        summary: 'summary',
        slug: 'slug',
        category: 'category',
        date: 'date',
        tags: 'tags',
        icon: 'icon',
        ext: 'ext',
        ...propertyNameOverrides
      }
    }
  }))

  jest.doMock('notion-utils', () => ({
    getDateValue: jest.fn(value => value?.date || { start_date: '2026-05-15' }),
    getTextContent: jest.fn(value => {
      if (typeof value === 'string') return value
      if (!Array.isArray(value)) return ''

      return value
        .flat(Infinity)
        .filter(item => typeof item === 'string')
        .join('')
    })
  }))

  jest.doMock('@/lib/db/notion/mapImage', () => ({
    mapImgUrl: jest.fn(value => value || '')
  }))

  jest.doMock('@/lib/db/notion/getNotionAPI', () => ({}))

  return require('@/lib/db/notion/getPageProperties')
}

const memberSchema = {
  title: { name: 'title', type: 'title' },
  type: { name: 'type', type: 'select' },
  status: { name: 'status', type: 'select' },
  slug: { name: 'slug', type: 'text' },
  bio: { name: 'bio', type: 'text' },
  featured: { name: 'featured', type: 'checkbox' },
  ext: { name: 'ext', type: 'text' }
}

const createPageValue = properties => ({
  properties,
  created_time: '2026-05-15T00:00:00.000Z',
  last_edited_time: '2026-05-15T01:00:00.000Z',
  format: {
    page_icon: '/avatar.svg',
    page_cover: '/cover.png'
  }
})

describe('getPageProperties member mapping', () => {
  afterEach(() => {
    jest.dontMock('@/blog.config')
    jest.dontMock('notion-utils')
    jest.dontMock('@/lib/db/notion/mapImage')
    jest.dontMock('@/lib/db/notion/getNotionAPI')
  })

  it('maps type = Member to a first-class Member page', async () => {
    const {
      default: getPageProperties,
      adjustPageProperties
    } = loadGetPageProperties()

    const properties = await getPageProperties(
      'member-page-id',
      createPageValue({
        title: [['Qianzhu']],
        type: [['Member']],
        status: [['Published']],
        slug: [['members/qianzhu']],
        bio: [['Builder in community']],
        featured: [['true']],
        ext: [['{"verified":true,"sortOrder":1}']]
      }),
      memberSchema,
      null,
      []
    )
    adjustPageProperties(properties, {})

    expect(properties).toMatchObject({
      id: 'member-page-id',
      title: 'Qianzhu',
      type: 'Member',
      status: 'Published',
      slug: 'members/qianzhu',
      href: '/members/qianzhu',
      bio: 'Builder in community',
      featured: 'true',
      ext: {
        verified: true,
        sortOrder: 1
      }
    })
  })

  it('supports customized Notion select labels for Member and Published', async () => {
    const {
      default: getPageProperties,
      adjustPageProperties
    } = loadGetPageProperties({
      type_member: '成员',
      status_publish: '发布'
    })

    const properties = await getPageProperties(
      'member-page-id',
      createPageValue({
        title: [['Alice Chen']],
        type: [['成员']],
        status: [['发布']],
        slug: [['alice-chen']]
      }),
      memberSchema,
      null,
      []
    )
    adjustPageProperties(properties, {})

    expect(properties.type).toBe('Member')
    expect(properties.status).toBe('Published')
    expect(properties.href).toBe('/alice-chen')
  })
})
