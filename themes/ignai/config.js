/**
 * IGNAI 主题配置
 * 基于 proxio 骨架，爆改为 IGNAI 品牌社区官网
 *
 * 配置结构：
 *   1. 首页区块开关（与 LayoutIndex 中各 Section 一一对应）
 *   2. 首页区块内容（被各 Section 组件或 src/content/ 引用）
 *   3. Footer / 404 / 导航
 *   4. Blog 组件兼容（从 proxio 继承的 Blog.js 使用的键）
 */
const CONFIG = {
  // ========================================================================
  // 1. 首页区块开关（true=显示, false=隐藏）
  //    每个开关对应 themes/ignai/index.js LayoutIndex 中一个 Section
  // ========================================================================
  IGNAI_HERO_ENABLE: true,
  IGNAI_WHATIS_ENABLE: true,
  IGNAI_CULTURE_ENABLE: true,
  IGNAI_EVENTS_ENABLE: true,
  IGNAI_FIELDNOTES_ENABLE: true,
  IGNAI_MEMBERS_ENABLE: true,
  IGNAI_JOIN_ENABLE: true,

  // ========================================================================
  // 2. 首页区块内容
  //    注：Hero / WhatIs / Culture / Events / FieldNotes / Members / Join
  //    的文案实际来自 src/content/ 目录，以下仅为 siteConfig() 可查的后备值
  // ========================================================================

  // -- Hero --
  IGNAI_HERO_EYEBROW: 'Living AI Community',
  IGNAI_HERO_NAME: 'IGNAI',
  IGNAI_HERO_SLOGAN: 'Ignite before AGI.',
  IGNAI_HERO_SUMMARY: 'IGNAI 是一个 base 长沙、连接本地、面向全球的 AI 社区。',
  IGNAI_HERO_DESCRIPTION: '关注 AI、Agent、Product、Startup 与真实行动。',
  IGNAI_HERO_CTA_1: '加入社区',
  IGNAI_HERO_CTA_1_URL: '/join',
  IGNAI_HERO_CTA_2: '查看活动',
  IGNAI_HERO_CTA_2_URL: '/events',
  IGNAI_HERO_BANNER_IMAGE: '',
  IGNAI_HERO_BANNER_IFRAME_URL: '',
  IGNAI_HERO_SIGNALS: [
    { eyebrow: 'Local roots', title: '本地连接', description: '连接长沙、高校、开发者与行动者。' },
    { eyebrow: 'Global signal', title: '国际信号', description: '保持开放，吸收全球 AI 趋势。' },
    { eyebrow: 'Human warmth', title: '真实温度', description: '让连接发生在真实的人之间。' }
  ],

  // -- What is IGNAI (Feature cards) --
  IGNAI_FEATURE_CARDS: [
    { eyebrow: 'AI Learners', title: 'AI 学习者', description: '正在学习 AI、工具和未来工作方式的人。' },
    { eyebrow: 'Builders', title: '项目行动者', description: '做产品、Agent、工具和真实项目的人。' },
    { eyebrow: 'Storytellers', title: '表达者', description: '愿意分享观点、记录实践、传播信号的人。' },
    { eyebrow: 'Connectors', title: '连接者', description: '连接本地资源、全球趋势和更多行动机会的人。' }
  ],

  // -- Blog / Events（LayoutPostList 和 LayoutSearch 使用）--
  IGNAI_BLOG_TITLE: '近期活动',
  IGNAI_BLOG_TEXT_1: '活动、分享与行动记录',

  // -- CTA / Join --
  IGNAI_CTA_TITLE: 'Join the fire.',
  IGNAI_CTA_TITLE_2: 'Bring your signal.',
  IGNAI_CTA_DESCRIPTION: '加入一个鼓励表达、持续行动、彼此点燃的 AI 社区。',
  IGNAI_CTA_BUTTON: true,
  IGNAI_CTA_BUTTON_URL: '/join',
  IGNAI_CTA_BUTTON_TEXT: '加入社区',
  IGNAI_CTA_BENEFITS: [
    '参与线下交流',
    '加入主题共创',
    '分享项目与观点',
    '连接长沙与全球 AI 信号'
  ],

  // -- Brands（横向滚动品牌词，预留）--
  IGNAI_BRANDS: [
    'AI Learners', 'Builders', 'Storytellers', 'Connectors',
    'Agent', 'Product', 'Startup', 'Content'
  ],

  // ========================================================================
  // 3. Footer / 404 / 导航
  // ========================================================================

  // -- Footer --
  IGNAI_FOOTER_SLOGAN: 'Ignite before AGI.',
  IGNAI_FOOTER_SUBTITLE: '俗名：洋来社',
  IGNAI_FOOTER_LOCATION: 'Based in Changsha, connected to the world.',
  IGNAI_FOOTER_LINKS: [
    {
      name: '导航',
      menus: [
        { title: '首页', href: '/' },
        { title: '成员', href: '/members' },
        { title: '活动', href: '/events' },
        { title: '关于社区', href: '/about' },
        { title: '加入我们', href: '/join' }
      ]
    },
    {
      name: '内容',
      menus: [
        { title: '文章', href: '/archive' },
        { title: '社区记录', href: '/events' }
      ]
    }
  ],
  IGNAI_FOOTER_PRIVACY_POLICY_TEXT: '',
  IGNAI_FOOTER_PRIVACY_POLICY_URL: '',
  IGNAI_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '',
  IGNAI_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '',
  IGNAI_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '',
  IGNAI_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '',

  // -- 404 --
  IGNAI_404_TITLE: '页面走丢了',
  IGNAI_404_TEXT: '抱歉，您要查找的页面不存在。',
  IGNAI_404_BACK: '回到主页',

  // -- 导航菜单（Header.js 直接读取此数组）--
  IGNAI_NAV_ITEMS: [
    { label: '成员', href: '/members' },
    { label: '活动', href: '/events' },
    { label: '关于', href: '/about' }
  ],

  // ========================================================================
  // 4. proxio 兼容键
  //    Blog.js 组件（从 proxio 继承）通过 siteConfig() 读取以下键
  // ========================================================================
  PROXIO_BLOG_ENABLE: true,
  PROXIO_BLOG_TITLE: '近期活动',
  PROXIO_BLOG_TEXT_1: '活动、分享与行动记录',
  PROXIO_BLOG_COUNT: 4,
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_1: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_2: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_3: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_4: '',
  PROXIO_POST_REDIRECT_ENABLE: false,
  PROXIO_POST_REDIRECT_URL: '',
  PROXIO_NEWSLETTER: false
}

export default CONFIG
