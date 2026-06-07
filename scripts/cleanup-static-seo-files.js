const fs = require('node:fs')
const path = require('node:path')

const files = [
  path.join(process.cwd(), 'public', 'sitemap.xml'),
  path.join(process.cwd(), 'sitemap.xml'),
  path.join(process.cwd(), 'public', 'robots.txt')
]

for (const file of files) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`[seo-cleanup] removed ${path.relative(process.cwd(), file)}`)
  }
}
