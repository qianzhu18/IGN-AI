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
  IGNAI_ARTICLES_ENABLE: false,
  IGNAI_ARTICLES_HOME_COUNT: 4,
  IGNAI_FIELDNOTES_ENABLE: true,
  IGNAI_MEMBERS_ENABLE: false,
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
  // 2b. Rig 风格首页文案（适配 IGNAI 社区）
  // ========================================================================

  // -- Rig Hero --
  RIG_HERO_TITLE: '在长沙，和愿意把<br/>AI 做出来的人见面。',
  RIG_HERO_SUB: 'IGNAI 连接学生、开发者、产品人与创作者。我们一起参加活动、推动想法，把一次见面变成下一次行动。',
  RIG_HERO_CTA_1: '看看我们做过什么',
  RIG_HERO_CTA_1_URL: '/records',
  RIG_HERO_CTA_2: '加入社区',
  RIG_HERO_CTA_2_URL: '/join',
  RIG_HERO_PATHS: [
    { label: '我想参加活动', desc: '看看下一次线下见面，或者先认识社区。', href: '/events' },
    { label: '我有项目想聊', desc: '带着想法来，认识愿意一起推进的人。', href: '/join' },
    { label: '我想一起合作', desc: '从一场活动、一次共创或一个具体问题开始。', href: '/join' },
  ],
  RIG_TRUST_ITEMS: [
    '长沙的青年 AI 社区',
    '活动、项目与跨城见面',
    '每一条故事都来自真实现场',
  ],
  RIG_HERO_TICKER: [
    '连接创造者', '点燃可能性', 'Local roots · Global signal', '真实行动',
    'AI · Agent · Product', '长沙 AI 社区', 'Ignite before AGI', '做项目 · 分享观点',
  ],

  // -- Rig Problem Section --
  RIG_PROBLEM_BADGE: 'The Problem',
  RIG_PROBLEM_TITLE: '活动很热闹，<br/>但结束后人常常散掉。',
  RIG_PROBLEM_CARDS: [
    { label: '一次性见面', number: '001', title: '加了微信，活动结束后却没有下一次。', desc: 'IGNAI 想把一次见面的余温，变成还能继续联系的人。' },
    { label: '想法没人接', number: '002', title: '想做点什么，却不知道该和谁聊。', desc: '现场、群聊和小项目可以成为认识同伴的开始。' },
    { label: '城市里的陌生人', number: '003', title: '同一座城市里，很多愿意行动的人彼此不认识。', desc: '我们把高校、开发者、产品人和创作者带到同一张桌子旁。' },
  ],

  // -- Rig Capabilities --
  RIG_CAPS_BADGE: 'Capabilities',
  RIG_CAPS_TITLE: '我们一起做过什么。',
  RIG_CAPS_CARDS: [
    { label: '[ 01 ]', title: '把人带到现场。', desc: '从黑客松、校园活动到主题分享，让原本分散的人真的见上一面。' },
    { label: '[ 02 ]', title: '把想法推往下一步。', desc: '有人带着项目、Demo 或一个问题来，现场常常就是合作的起点。' },
    { label: '[ 03 ]', title: '把长沙带到别处。', desc: '在 2050 大会等跨城现场，介绍来自长沙的朋友与正在发生的事。' },
  ],

  // -- Rig Terminal --
  RIG_TERM_TITLE: 'Built for builders',
  RIG_TERM_LINES: [
    { type: 'prompt', text: 'ignai init' },
    { type: 'ascii', text: '  ██████╗  ██╗  ██████╗\n  ██╔══██╗ ██║ ██╔════╝\n  ██████╔╝ ██║ ██║ ███╗\n  ██╔══██╗ ██║ ██║  ██║\n  ██║  ██║ ██║ ╚██████║\n  ╚═╝  ╚═╝ ╚═╝  ╚═════╝' },
    { type: 'plain', text: '> 扫描社区...' },
    { type: 'plain', text: '> 发现 300+ 位行动者 · 长沙' },
    { type: 'plain', text: '> 累计触达 2000+ 学生与开发者' },
    { type: 'success', text: '> 加载 IGNAI 社区引擎 OK' },
    { type: 'plain', text: '> 已连接 20+ 场线下活动' },
    { type: 'success', text: '✓ 就绪。网络: ON · 社区: ACTIVE' },
    { type: 'typing', prompts: ['加入社区一起做项目', '分享你的 AI 实践', '认识志同道合的人'] },
  ],

  // -- Rig FAQ --
  RIG_FAQ_BADGE: 'FAQ',
  RIG_FAQ_TITLE: '常见问题。',
  RIG_FAQ_ITEMS: [
    { q: 'IGNAI 是什么？', a: 'IGNAI 是一个 base 长沙、连接本地、面向全球的 AI 社区。我们关注 AI、Agent、Product、Startup 与真实行动。' },
    { q: '谁可以加入？', a: '任何人。学生、开发者、设计师、创业者、产品经理——只要对 AI 有热情和好奇心，都欢迎。' },
    { q: '社区做什么活动？', a: '线下分享会、黑客松、学习小组、项目共创、社交聚会。主题围绕 AI 工具、Agent 开发、产品设计等。' },
    { q: '需要在长沙才能参加吗？', a: '线下活动主要在长沙，但线上内容和社区讨论对所有人开放。我们也鼓励远程成员参与。' },
    { q: '怎么加入？', a: '点击「加入社区」按钮，扫码添加社区管理者。先在微信里建立真实连接，再根据你的兴趣拉到合适的活动、项目或讨论里。' },
  ],

  // -- Rig CTA --
  RIG_CTA_TITLE: 'Ignite before AGI.',
  RIG_CTA_SUB: '加入一个鼓励表达、持续行动、彼此点燃的 AI 社区。',
  RIG_CTA_BTN: '加入社区',
  RIG_CTA_BTN_URL: '/join',

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
        { title: '活动', href: '/events' },
        { title: '社区现场', href: '/records' },
        { title: '关于社区', href: '/about' },
        { title: '加入我们', href: '/join' }
      ]
    },
    {
      name: '了解 IGNAI',
      menus: [
        { title: '社区现场', href: '/records' },
        { title: '关于社区', href: '/about' }
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
  // 当前 Notion 里仍有 NotionNext 模板默认 Menu，所以上线默认使用本地导航。
  // 后续清理 Notion Menu 后，可通过配置中心开启 IGNAI_NAV_USE_NOTION_MENU。
  IGNAI_NAV_USE_NOTION_MENU: false,
  IGNAI_NAV_ITEMS: [
    { label: '活动', href: '/events' },
    { label: '社区现场', href: '/records' },
    { label: '关于 IGNAI', href: '/about' }
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
