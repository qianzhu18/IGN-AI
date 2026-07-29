import type { NotionBlock, NotionDataSource, NotionPage } from './types'

type ListResponse<T> = {
  has_more?: boolean
  next_cursor?: string | null
  results?: T[]
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export class NotionMigrationClient {
  constructor(
    private readonly token: string,
    private readonly version = '2026-03-11',
  ) {
    if (!token) throw new Error('NOTION_API_TOKEN is required for Notion extraction')
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await fetch(`https://api.notion.com/v1${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.version,
          ...init.headers,
        },
      })

      if (response.ok) return (await response.json()) as T
      if ((response.status === 429 || response.status >= 500) && attempt < 4) {
        const retryAfter = Number(response.headers.get('retry-after'))
        await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt)
        continue
      }

      const message = await response.text()
      throw new Error(`Notion API ${response.status} for ${path}: ${message.slice(0, 500)}`)
    }
    throw new Error(`Notion API retry budget exhausted for ${path}`)
  }

  getDataSource(dataSourceId: string) {
    return this.request<NotionDataSource>(`/data_sources/${dataSourceId}`)
  }

  async queryDataSource(dataSourceId: string): Promise<NotionPage[]> {
    const pages: NotionPage[] = []
    let cursor: string | undefined
    do {
      const response = await this.request<ListResponse<NotionPage>>(
        `/data_sources/${dataSourceId}/query`,
        {
          body: JSON.stringify({ page_size: 100, start_cursor: cursor }),
          method: 'POST',
        },
      )
      pages.push(...(response.results || []))
      cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined
    } while (cursor)
    return pages
  }

  private async listBlockChildren(blockId: string): Promise<NotionBlock[]> {
    const blocks: NotionBlock[] = []
    let cursor: string | undefined
    do {
      const params = new URLSearchParams({ page_size: '100' })
      if (cursor) params.set('start_cursor', cursor)
      const response = await this.request<ListResponse<NotionBlock>>(
        `/blocks/${blockId}/children?${params.toString()}`,
      )
      blocks.push(...(response.results || []))
      cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined
    } while (cursor)
    return blocks
  }

  async getBlockTree(blockId: string, depth = 0): Promise<NotionBlock[]> {
    const blocks = await this.listBlockChildren(blockId)
    if (depth >= 4) return blocks
    for (const block of blocks) {
      if (block.has_children) block.children = await this.getBlockTree(block.id, depth + 1)
    }
    return blocks
  }
}
