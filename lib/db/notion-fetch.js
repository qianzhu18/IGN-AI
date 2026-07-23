import { Agent, fetch as undiciFetch } from 'undici'

const API_BASE = 'https://api.notion.com/v1'
const MAX_RETRIES = Number(process.env.NOTION_FETCH_RETRIES || 3)
const INITIAL_BACKOFF_MS = Number(process.env.NOTION_FETCH_BACKOFF_MS || 500)
const CONNECT_TIMEOUT_MS = Number(process.env.NOTION_FETCH_CONNECT_TIMEOUT_MS || 20000)
const HEADERS_TIMEOUT_MS = Number(process.env.NOTION_FETCH_HEADERS_TIMEOUT_MS || 30000)

const http1Agent = new Agent({
  allowH2: false,
  connectTimeout: CONNECT_TIMEOUT_MS,
  headersTimeout: HEADERS_TIMEOUT_MS,
  bodyTimeout: HEADERS_TIMEOUT_MS
})

const isRetryableError = err => {
  const code = err?.cause?.code || err?.code
  if (!code) return true
  return [
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_BODY_TIMEOUT',
    'UND_ERR_SOCKET',
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN'
  ].includes(code)
}

const isRetryableStatus = status => status === 429 || status >= 500

export async function notionFetch(path, init = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const headers = {
    'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
    'Notion-Version': process.env.NOTION_API_VERSION || '2026-03-11',
    'Content-Type': 'application/json',
    ...(init.headers || {})
  }

  let lastError = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1)
    if (attempt > 1) {
      await new Promise(resolve => setTimeout(resolve, backoff))
    }
    try {
      const response = await undiciFetch(url, {
        ...init,
        headers,
        method: init.method || 'GET',
        dispatcher: http1Agent
      })
      if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
        continue
      }
      return response
    } catch (err) {
      lastError = err
      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        continue
      }
      throw err
    }
  }
  throw lastError || new Error('notionFetch exhausted retries')
}
