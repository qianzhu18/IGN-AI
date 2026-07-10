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
  IGNAI_ARTICLES_ENABLE: true,
  IGNAI_ARTICLES_HOME_COUNT: 4,
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
  // 2b. Rig 风格首页文案（适配 IGNAI 社区）
  // ========================================================================

  // -- Rig Hero --
  RIG_HERO_TITLE: '连接创造者，<br/>点燃可能性。',
  RIG_HERO_SUB: 'IGNAI — 长沙青年 AI 社区。300+ 核心社群成员 / 2000+ 累计触达 / 20+ 线下 AI 活动。',
  RIG_HERO_CTA_1: '加入社区',
  RIG_HERO_CTA_1_URL: '/join',
  RIG_HERO_CTA_2: '查看活动',
  RIG_HERO_CTA_2_URL: '/events',
  RIG_HERO_TICKER: [
    '连接创造者', '点燃可能性', 'Local roots · Global signal', '真实行动',
    'AI · Agent · Product', '长沙 AI 社区', 'Ignite before AGI', '做项目 · 分享观点',
  ],

  // -- Rig Problem Section --
  RIG_PROBLEM_BADGE: 'The Problem',
  RIG_PROBLEM_TITLE: 'AI 很热，<br/>但真正的连接很少。',
  RIG_PROBLEM_CARDS: [
    { label: '信息过载', number: '001', title: '刷不完的 AI 资讯，却不知道从哪开始。', desc: '每天海量信息涌来，缺少本地化的筛选和实践场景。' },
    { label: '孤独学习', number: '002', title: '一个人学 AI，进度缓慢、方向模糊。', desc: '没有同伴互相激励，遇到问题无处讨论，容易半途而废。' },
    { label: '纸上谈兵', number: '003', title: '看了一百篇教程，还是没有做出东西。', desc: '缺乏真实项目实践和反馈，知识停留在理论层面。' },
    { label: '资源分散', number: '004', title: '本地有人才，但没有聚合的场景。', desc: '开发者、设计者、创业者在同一个城市却不认识彼此。' },
  ],

  // -- Rig Capabilities --
  RIG_CAPS_BADGE: 'Capabilities',
  RIG_CAPS_TITLE: '我们怎么行动。',
  RIG_CAPS_CARDS: [
    { label: '[ 01 ]', title: '线下活动，真实碰撞。', desc: '分享会、黑客松、项目路演——面对面的交流，激发真实的想法和行动。' },
    { label: '[ 02 ]', title: '学习小组，一起往前走。', desc: 'AI 工具、Agent 开发、产品设计——有主题、有节奏、有同伴。' },
    { label: '[ 03 ]', title: '项目共创，从 0 到 1。', desc: '社区成员组队做真实项目，边做边学，成果公开展示。' },
    { label: '[ 04 ]', title: '内容输出，放大信号。', desc: '社区成员的观点、实践记录、教程——让好内容被更多人看到。' },
    { label: '[ 05 ]', title: '本地连接，全球视野。', desc: '扎根长沙，关注全球 AI 趋势——把外部信号带回来，把本地声音传出去。' },
    { label: '[ 06 ]', title: '开放文化，人人可参与。', desc: '无论你是学生、开发者、设计师还是创业者——只要对 AI 有热情，这里就有你的位置。' },
  ],

  // -- Rig Stats --
  RIG_STATS: [
    { label: '核心社群成员', value: '300+', note: '持续增长中' },
    { label: '累计触达', value: '2000+', note: '学生 × 开发者' },
    { label: '线下活动', value: '20+', note: '分享会 × 黑客松' },
    { label: '成立', value: '2025', note: 'Ignite before AGI' },
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
        { title: '记录', href: '/records' },
        { title: '关于社区', href: '/about' },
        { title: '加入我们', href: '/join' }
      ]
    },
    {
      name: '内容',
      menus: [
        { title: '文章', href: '/archive' },
        { title: '社区记录', href: '/records' }
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
    { label: '文章', href: '/archive' },
    { label: '记录', href: '/records' },
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
