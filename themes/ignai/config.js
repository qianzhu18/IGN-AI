/**
 * IGNAI 主题配置
 * 基于 heo 主题，适配 IGNAI 社区品牌
 * 颜色系统：Heat #FF7A18, Signal #5DA9FF, 背景 #07080C
 */
const CONFIG = {
  IGNAI_LOADING_COVER: true, // 页面加载遮罩动画

  // 建站日期
  IGNAI_SITE_CREATE_TIME: '2025-01-01',

  // 首页通知条
  IGNAI_NOTICE_BAR: [
    { title: 'IGNAI — 长沙 AI 社区，连接创造者，点燃可能性', url: '/' },
  ],

  // 英雄区
  IGNAI_HERO_EYEBROW: 'Living AI Community',
  IGNAI_HERO_NAME: 'IGNAI',
  IGNAI_HERO_SLOGAN: 'Ignite before AGI.',
  IGNAI_HERO_SUMMARY: 'IGNAI 是一个 base 长沙、连接本地、面向全球的 AI 社区。',
  IGNAI_HERO_DESCRIPTION: '关注 AI、Agent、Product、Startup 与真实行动。',
  IGNAI_HERO_LEAD: '在 AGI 到来之前，先点燃一群真实行动的人。',
  IGNAI_HERO_CTA_JOIN: '加入社区',
  IGNAI_HERO_CTA_EVENTS: '查看近期活动',
  IGNAI_HERO_JOIN_URL: '/join',
  IGNAI_HERO_EVENTS_URL: '#upcoming-events',
  IGNAI_HERO_COVER_IMAGE: '/images/generated/local-global-embers.png',
  IGNAI_HERO_COVER_BADGE: 'Local roots / Global signal',
  IGNAI_HERO_COVER_TEXT: '让本地土壤和全球信号，同时亮起来。',

  // Hero Signals
  IGNAI_HERO_SIGNALS: [
    { eyebrow: 'Local roots', title: '本地连接', description: '连接长沙、高校、开发者与行动者。' },
    { eyebrow: 'Global signal', title: '国际信号', description: '保持开放，吸收全球 AI 趋势。' },
    { eyebrow: 'Human warmth', title: '真实温度', description: '让连接发生在真实的人之间。' },
  ],

  // 导航菜单
  IGNAI_NAV_ITEMS: [
    { label: 'What', href: '#what-is-ignai' },
    { label: 'Culture', href: '#culture' },
    { label: 'Events', href: '#upcoming-events' },
    { label: 'Records', href: '#field-notes' },
    { label: 'Join', href: '/join' },
  ],

  // 页脚
  IGNAI_FOOTER_LINES: ['Ignite before AGI.', '俗名：洋来社'],
  IGNAI_FOOTER_LOCATION: 'Based in Changsha, connected to the world.',
  IGNAI_FOOTER_NAV: [
    { label: 'What is IGNAI', href: '/#what-is-ignai' },
    { label: 'Culture', href: '/#culture' },
    { label: 'Events', href: '/events' },
    { label: 'Records', href: '/records' },
    { label: 'Journal', href: '/blog' },
    { label: 'Join', href: '/join' },
  ],
  IGNAI_FOOTER_EMAIL: 'hello@ignai.community',

  // 博客列表
  IGNAI_HOME_POST_TWO_COLS: true,
  IGNAI_POST_LIST_COVER: true,
  IGNAI_POST_LIST_SUMMARY: true,
  IGNAI_POST_LIST_IMG_CROSSOVER: true,

  // 文章详情
  IGNAI_ARTICLE_ADJACENT: true,
  IGNAI_ARTICLE_COPYRIGHT: true,
  IGNAI_ARTICLE_RECOMMEND: true,

  // 保留 heo 兼容的配置键名（部分 heo 组件内部引用这些键）
  HEO_HOME_POST_TWO_COLS: true,
  HEO_LOADING_COVER: true,
  HEO_HOME_BANNER_ENABLE: true,
  HEO_HERO_REVERSE: false,
  HEO_HERO_BODY_REVERSE: false,
  HEO_POST_LIST_COVER: true,
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false,
  HEO_POST_LIST_COVER_DEFAULT: true,
  HEO_POST_LIST_SUMMARY: true,
  HEO_POST_LIST_PREVIEW: false,
  HEO_POST_LIST_IMG_CROSSOVER: true,
  HEO_ARTICLE_ADJACENT: true,
  HEO_ARTICLE_COPYRIGHT: true,
  HEO_ARTICLE_NOT_BY_AI: false,
  HEO_ARTICLE_RECOMMEND: true,
  HEO_WIDGET_LATEST_POSTS: true,
  HEO_WIDGET_ANALYTICS: false,
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true,
  HEO_WIDGET_DARK_MODE: true,
  HEO_WIDGET_TOC: true,
  HEO_MENU_INDEX: true,
  HEO_MENU_CATEGORY: true,
  HEO_MENU_TAG: true,
  HEO_MENU_ARCHIVE: true,
  HEO_MENU_SEARCH: true,
  HEO_SOCIAL_CARD: true,
  HEO_SOCIAL_CARD_TITLE_1: '加入社区',
  HEO_SOCIAL_CARD_TITLE_2: '加入 IGNAI 社区讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入',
  HEO_SOCIAL_CARD_URL: '/join',
  HEO_HERO_RECOMMEND_POST_TAG: '',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false,
  HEO_HERO_RECOMMEND_COVER_ENABLE: false,
  HEO_NOTICE_BAR: [],
  HEO_INFOCARD_GREETINGS: [
    '你好！IGNAI',
    '长沙 AI 社区',
    '连接创造者',
    '点燃可能性',
  ],
  HEO_INFO_CARD_URL1: '/join',
  HEO_INFO_CARD_ICON1: 'fas fa-users',
  HEO_INFO_CARD_URL2: 'https://github.com/qianzhu18',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_URL3: '/join',
  HEO_INFO_CARD_TEXT3: '加入社区',
  HEO_GROUP_ICONS: [],
  HEO_POST_COUNT_TITLE: '文章数:',
  HEO_SITE_TIME_TITLE: '建站天数:',
  HEO_SITE_VISIT_TITLE: '访问量:',
  HEO_SITE_VISITOR_TITLE: '访客数:',
  HEO_SITE_CREATE_TIME: '2025-01-01',
}
export default CONFIG
