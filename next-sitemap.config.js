const BLOG = require('./blog.config')
const siteUrl = BLOG.LINK || process.env.NEXT_PUBLIC_LINK || 'https://ignai.community'

/**
 * Sitemap 由 /pages/sitemap.xml.js 从 Notion 数据动态生成
 * 此配置仅用于生成 robots.txt
 */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ['/*'], // 排除所有页面，不生成静态 sitemap
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [`${siteUrl.replace(/\/+$/, '')}/sitemap.xml`]
  }
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
