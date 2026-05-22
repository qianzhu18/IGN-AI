const loadGetAllPageIds = (notionIndex = 0) => {
  jest.resetModules()

  jest.doMock('@/blog.config', () => ({
    __esModule: true,
    default: {
      NOTION_INDEX: notionIndex
    }
  }))

  return require('@/lib/db/notion/getAllPageIds').default
}

describe('getAllPageIds', () => {
  afterEach(() => {
    jest.dontMock('@/blog.config')
  })

  it('keeps the selected view filter instead of merging all view queries', () => {
    const getAllPageIds = loadGetAllPageIds(0)

    const pageIds = getAllPageIds(
      {
        collection123: {
          viewA: {
            results: {
              blockIds: ['post-a', 'post-b']
            }
          },
          viewB: {
            results: {
              blockIds: ['post-c']
            }
          }
        }
      },
      'collection123',
      {
        viewA: {
          value: {
            value: {
              page_sort: ['post-a']
            }
          }
        }
      },
      ['viewA', 'viewB']
    )

    expect(pageIds).toEqual(['post-a', 'post-b'])
  })

  it('supports view ids stored without hyphens in collection query data', () => {
    const getAllPageIds = loadGetAllPageIds(0)

    const pageIds = getAllPageIds(
      {
        collection123: {
          viewabc123: {
            results: {
              blockIds: ['post-a', 'post-b']
            }
          }
        }
      },
      'collection123',
      {
        viewabc123: {
          value: {
            value: {
              page_sort: ['post-a']
            }
          }
        }
      },
      ['view-abc-123']
    )

    expect(pageIds).toEqual(['post-a', 'post-b'])
  })

  it('supports NOTION_INDEX = -1 for the last view', () => {
    const getAllPageIds = loadGetAllPageIds(-1)

    const pageIds = getAllPageIds(
      {
        collection123: {
          viewA: {
            results: {
              blockIds: ['first-view-post']
            }
          },
          viewB: {
            results: {
              blockIds: ['last-view-post']
            }
          }
        }
      },
      'collection123',
      {
        viewB: {
          value: {
            value: {
              page_sort: ['last-view-post']
            }
          }
        }
      },
      ['viewA', 'viewB']
    )

    expect(pageIds).toEqual(['last-view-post'])
  })

  it('falls back to the first query result when the target view query is missing', () => {
    const getAllPageIds = loadGetAllPageIds(0)

    const pageIds = getAllPageIds(
      {
        collection123: {
          fallbackView: {
            results: {
              blockIds: ['fallback-post']
            }
          }
        }
      },
      'collection123',
      {
        viewA: {
          value: {
            value: {
              page_sort: ['sorted-post']
            }
          }
        }
      },
      ['viewA']
    )

    expect(pageIds).toEqual(['sorted-post', 'fallback-post'])
  })
})
