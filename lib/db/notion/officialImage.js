import BLOG from '@/blog.config'

function toNotionAttachmentReference(fileUrl) {
  try {
    const url = new URL(fileUrl)
    if (!url.hostname.startsWith('prod-files-secure')) return ''

    const segments = url.pathname.split('/').filter(Boolean)
    if (segments.length < 3) return ''

    const fileId = segments[segments.length - 2]
    const fileName = decodeURIComponent(segments[segments.length - 1])
    return `attachment:${fileId}:${fileName}`
  } catch {
    return ''
  }
}

/**
 * The official Notion API returns one-hour signed URLs for uploaded files.
 * Convert page files back to Notion's stable attachment endpoint so a static
 * build does not fall back to stale local artwork after the signature expires.
 */
export function readOfficialImage(image, pageId) {
  if (!image || typeof image !== 'object') return ''
  if (image.type === 'external') return image.external?.url || ''
  if (image.type === 'emoji') return image.emoji || ''
  if (image.type !== 'file') return ''

  const fileUrl = image.file?.url || ''
  const attachment = toNotionAttachmentReference(fileUrl)
  if (!attachment || !pageId) return fileUrl

  return `${BLOG.NOTION_HOST}/image/${encodeURIComponent(
    attachment
  )}?table=block&id=${pageId}`
}
