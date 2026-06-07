import { cleanCache } from '@/lib/cache/local_file_cache'
import { isOpsAuthorized, isOpsPasswordConfigured } from '@/lib/join'

/**
 * 清理缓存
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  if (!isOpsPasswordConfigured()) {
    return res.status(503).json({ message: 'OPS_ACCESS_PASSWORD 未配置。' })
  }

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: '请先登录运营后台。' })
  }

  try {
    cleanCache()
    res.status(200).json({ status: 'success', message: 'Clean cache successful!' })
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Clean cache failed!', error })
  }
}
