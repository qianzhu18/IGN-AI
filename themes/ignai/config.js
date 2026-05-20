/**
 * IGNAI 主题配置
 * 基于 proxio 骨架，爆改为 IGNAI 品牌社区官网
 */
const CONFIG = {
  // ========== 首页区块开关 ==========
  IGNAI_HERO_ENABLE: true,
  IGNAI_BLOG_ENABLE: true,
  IGNAI_BLOG_COUNT: 4,
  IGNAI_ANNOUNCEMENT_ENABLE: false,
  IGNAI_ABOUT_ENABLE: true,
  IGNAI_BRANDS_ENABLE: true,
  IGNAI_CAREER_ENABLE: false,
  IGNAI_FEATURE_ENABLE: true,
  IGNAI_TESTIMONIALS_ENABLE: false,
  IGNAI_FAQ_ENABLE: false,
  IGNAI_CTA_ENABLE: true,
  IGNAI_WELCOME_COVER_ENABLE: false,

  // ========== Hero 区块 ==========
  IGNAI_HERO_EYEBROW: 'Living AI Community',
  IGNAI_HERO_NAME: 'IGNAI',
  IGNAI_HERO_SLOGAN: 'Ignite before AGI.',
  IGNAI_HERO_SUMMARY: 'IGNAI 是一个 base 长沙、连接本地、面向全球的 AI 社区。',
  IGNAI_HERO_DESCRIPTION: '关注 AI、Agent、Product、Startup 与真实行动。',
  IGNAI_HERO_CTA_1: '加入社区',
  IGNAI_HERO_CTA_1_URL: '/join',
  IGNAI_HERO_CTA_2: '查看近期活动',
  IGNAI_HERO_CTA_2_URL: '#blog',
  IGNAI_HERO_BANNER_IMAGE: '',
  IGNAI_HERO_BANNER_IFRAME_URL: '',
  // Hero 信号卡片
  IGNAI_HERO_SIGNALS: [
    { eyebrow: 'Local roots', title: '本地连接', description: '连接长沙、高校、开发者与行动者。' },
    { eyebrow: 'Global signal', title: '国际信号', description: '保持开放，吸收全球 AI 趋势。' },
    { eyebrow: 'Human warmth', title: '真实温度', description: '让连接发生在真实的人之间。' }
  ],

  // ========== Blog 区块 ==========
  IGNAI_BLOG_TITLE: '近期活动',
  IGNAI_BLOG_TEXT_1: '活动、分享与行动记录',

  // ========== Features 区块 (What is IGNAI) ==========
  IGNAI_FEATURE_TITLE: 'What is IGNAI',
  IGNAI_FEATURE_TEXT_1: '一个从长沙出发，连接真实行动者的 AI 社区。',
  IGNAI_FEATURE_TEXT_2: '我们关注 AI、Agent、Product、Startup 与内容表达。',
  IGNAI_FEATURE_CARDS: [
    { eyebrow: 'AI Learners', title: 'AI 学习者', description: '正在学习 AI、工具和未来工作方式的人。', icon: 'fa-solid fa-graduation-cap' },
    { eyebrow: 'Builders', title: '项目行动者', description: '做产品、Agent、工具和真实项目的人。', icon: 'fa-solid fa-hammer' },
    { eyebrow: 'Storytellers', title: '表达者', description: '愿意分享观点、记录实践、传播信号的人。', icon: 'fa-solid fa-pen-nib' },
    { eyebrow: 'Connectors', title: '连接者', description: '连接本地资源、全球趋势和更多行动机会的人。', icon: 'fa-solid fa-link' }
  ],
  IGNAI_FEATURE_BUTTON_TEXT: '了解更多',
  IGNAI_FEATURE_BUTTON_URL: '#about',

  // ========== About (Team) 区块 ==========
  IGNAI_ABOUT_TITLE: '关于社区',
  IGNAI_ABOUT_TEXT_1: '有技术密度，也有人的温度。',
  IGNAI_ABOUT_TEXT_2: 'IGNAI 是面向全球的 AI 社区表达，洋来社是我们更本地、更亲近的内部名字。我们希望它既能承载技术讨论，也能承载真实连接、长期行动和人的温度。',
  IGNAI_ABOUT_PHOTO_URL: '/brand/ignai-logo.svg',
  IGNAI_ABOUT_KEY_1: '成立年份',
  IGNAI_ABOUT_VAL_1: '2025',
  IGNAI_ABOUT_KEY_2: '核心成员',
  IGNAI_ABOUT_VAL_2: '20+',
  IGNAI_ABOUT_KEY_3: '线下活动',
  IGNAI_ABOUT_VAL_3: '10+',
  IGNAI_ABOUT_KEY_4: '覆盖城市',
  IGNAI_ABOUT_VAL_4: '长沙',
  IGNAI_ABOUT_BUTTON_URL: '/join',
  IGNAI_ABOUT_BUTTON_TEXT: '加入我们',

  // ========== 横向滚动品牌词 ==========
  IGNAI_BRANDS: [
    'AI Learners',
    'Builders',
    'Storytellers',
    'Connectors',
    'Agent',
    'Product',
    'Startup',
    'Content'
  ],

  // ========== CTA 区块 (Join) ==========
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

  // ========== Footer ==========
  IGNAI_FOOTER_SLOGAN: 'Ignite before AGI.',
  IGNAI_FOOTER_SUBTITLE: '俗名：洋来社',
  IGNAI_FOOTER_LOCATION: 'Based in Changsha, connected to the world.',
  IGNAI_FOOTER_LINKS: [
    {
      name: '导航',
      menus: [
        { title: 'What is IGNAI', href: '/#what-is-ignai' },
        { title: 'Culture', href: '/#culture' },
        { title: '近期活动', href: '/#upcoming-events' },
        { title: 'Members', href: '/members' },
        { title: '加入社区', href: '/join' }
      ]
    },
    {
      name: '更多',
      menus: [
        { title: 'Events', href: '/events' },
        { title: 'Members', href: '/members' },
        { title: 'Records', href: '/records' },
        { title: 'Journal', href: '/archive' }
      ]
    }
  ],
  IGNAI_FOOTER_PRIVACY_POLICY_TEXT: '',
  IGNAI_FOOTER_PRIVACY_POLICY_URL: '',
  IGNAI_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '',
  IGNAI_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '',
  IGNAI_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '',
  IGNAI_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '',

  // ========== 404 ==========
  IGNAI_404_TITLE: '页面走丢了',
  IGNAI_404_TEXT: '抱歉，您要查找的页面不存在。',
  IGNAI_404_BACK: '回到主页',

  // ========== 导航菜单 ==========
  IGNAI_NAV_ITEMS: [
    { label: 'What', href: '/#what-is-ignai' },
    { label: 'Culture', href: '/#culture' },
    { label: 'Members', href: '/members' },
    { label: 'Events', href: '/#upcoming-events' },
    { label: 'Records', href: '/#field-notes' },
    { label: 'Join', href: '/join' }
  ],

  PROXIO_POST_REDIRECT_ENABLE: false,
  PROXIO_POST_REDIRECT_URL: '',
  PROXIO_NEWSLETTER: false
}

export default CONFIG
