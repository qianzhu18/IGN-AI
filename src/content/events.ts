export type EventStatus = "planning" | "ongoing" | "recap" | "open" | "closed" | "finished";
export type EventFormat = "offline" | "online" | "hybrid";
export type EventKind = "hosted" | "cohosted" | "promoted" | "participating";

export type EventMedia = {
  src: string;
  alt: string;
  caption: string;
  orientation?: "portrait";
};

export type EventItem = {
  slug: string;
  title: string;
  subtitle?: string;
  kind?: EventKind;
  status: EventStatus;
  dateText: string;
  location: string;
  format: EventFormat;
  cover: string;
  coverPosition?: string;
  externalUrl?: string;
  excerpt: string;
  tags: string[];
  registrationUrl?: string;
  registrationQrImage?: string;
  /** Allow an evidence-backed planning or ongoing local event without a direct registration URL. */
  publicListing?: boolean;
  audience: string[];
  agenda: string[];
  hosts: string[];
  notes: string[];
  content: Array<{
    heading: string;
    body: string;
    media?: EventMedia[];
  }>;
};

export const eventStatusLabel: Record<EventStatus, string> = {
  planning: "筹备中",
  ongoing: "进行中",
  recap: "已复盘",
  open: "开放报名",
  closed: "已满员",
  finished: "已结束",
};

export const eventFormatLabel: Record<EventFormat, string> = {
  offline: "线下",
  online: "线上",
  hybrid: "线上 + 线下",
};

export const eventKindLabel: Record<EventKind, string> = {
  hosted: "成员组织",
  cohosted: "联动活动",
  promoted: "协助宣发",
  participating: "成员参与",
};

// Evidence-backed local events supplement, rather than replace, Notion Event rows.
// A Notion row with the same slug always takes precedence at runtime.
export const events: EventItem[] = [
  {
    slug: "zhijisong-ai-skillathon-2026",
    title: "智极松 AI Skillathon（线上主赛）",
    subtitle: "线上持续进行中",
    kind: "promoted",
    status: "ongoing",
    dateText: "线上持续进行中",
    location: "线上",
    format: "online",
    cover: "/images/activity-records/zhijisong-minicamp-changsha-2026.webp",
    excerpt: "智极松 AI Skillathon 是持续推进的线上实践赛事。先到官方页面报名、查看赛程和规则；长沙 miniCamp 只是它在长沙的一次线下预热与现场共创入口。",
    tags: ["智极松", "AI Skillathon", "线上赛事", "长期进行"],
    registrationUrl: "https://www.ai-skillathon.com/register/heikesong",
    audience: ["AI 创作者", "开发者", "高校学生", "创业团队", "产品、设计与运营实践者"],
    agenda: ["线上报名与组队", "按官方赛事页查看赛程、赛道和规则", "持续完成作品并参与后续赛程"],
    hosts: ["智极松 AI Skillathon 赛事团队", "IGNAI 社区信息同步"],
    notes: [
      "线上赛事长期推进，具体赛程、赛道和提交要求以官方赛事页面为准。",
      "长沙 miniCamp 是一次单独的线下预热与共创活动，不替代线上主赛报名。"
    ],
    content: [
      {
        heading: "一条持续推进的线上主线",
        body: "智极松 AI Skillathon 的报名、组队、赛程和作品提交由官方赛事页面持续承接。IGNAI 在官网同步入口，是为了让想做 AI 项目的人能直接找到这场长期进行中的赛事。"
      },
      {
        heading: "长沙 miniCamp 不是主赛本身",
        body: "7 月 18 日的长沙 miniCamp 是这条线上主线的一次单独线下预热与现场共创：认识赛道、找到队友、确定题目、打磨原型，然后继续回到线上主赛推进作品。"
      }
    ]
  },
  {
    slug: "zhijisong-minicamp-changsha-2026",
    title: "智极松 miniCamp 一日黑客松（长沙站）",
    subtitle: "线下预热与共创 · 7 月 18 日 · 长沙",
    kind: "cohosted",
    status: "ongoing",
    dateText: "2026 年 7 月 18 日",
    location: "长沙岳麓一缦酒店",
    format: "offline",
    cover: "/images/activity-records/zhijisong-minicamp-execution.webp",
    excerpt: "这是线上智极松 AI Skillathon 在长沙的一次单次线下预热与共创活动。用一天完成认识赛道、现场组队、确定题目与 Demo 冲刺，再回到线上主赛继续推进。",
    tags: ["智极松", "miniCamp", "长沙", "线下预热"],
    registrationUrl: "https://lev0.cn/applyminicamp.html",
    audience: ["高校学生", "开发者", "创业团队", "产品经理与设计师", "对 AI 应用落地感兴趣的参与者"],
    agenda: [
      "09:30 - 10:00 签到、破冰、选择赛道",
      "10:00 - 10:40 开场介绍与赛道说明",
      "10:40 - 11:00 选题与现场组队",
      "11:00 - 18:00 极速开发、创作冲刺与导师巡场",
      "18:00 - 20:30 路演准备与 Demo Show"
    ],
    hosts: ["LEV0", "IGNAI", "新视界"],
    notes: [
      "活动海报标注免费参与，线下席位 100 个；席位不足时可线上参与。",
      "这是线上主赛的一次单次线下预热与共创活动，不是独立长期赛事。",
      "报名与场地变动请以活动主办方的最新公告为准。"
    ],
    content: [
      {
        heading: "长沙的一次线下预热，不是另一场主赛",
        body: "这场 miniCamp 发生在 7 月 18 日，是持续线上智极松 AI Skillathon 在长沙的一次单独线下预热与执行活动。它把原本分散在线上的准备工作，集中到一天里完成。",
        media: [
          {
            src: "/images/activity-records/stories/zhijisong-minicamp-intro.webp",
            alt: "智极松 miniCamp 活动介绍",
            caption: "智极松 miniCamp：从真实场景出发，完成可展示、可迭代、可参赛的作品。",
            orientation: "portrait"
          }
        ]
      },
      {
        heading: "先找到队友，再把想法推到 Demo",
        body: "当天从签到破冰、赛道说明与现场组队开始，下午进入创作冲刺，晚上以 Demo Show 收束。无论已经有项目，还是只有一个待验证的 AI 想法，都可以在这里找到把它往前推进的一步。",
        media: [
          {
            src: "/images/activity-records/stories/zhijisong-minicamp-info.webp",
            alt: "智极松 miniCamp 活动信息",
            caption: "活动信息：2026 年 7 月 18 日，长沙岳麓一缦酒店。",
            orientation: "portrait"
          },
          {
            src: "/images/activity-records/stories/zhijisong-minicamp-schedule.webp",
            alt: "智极松 miniCamp 一日流程",
            caption: "从现场组队到 Demo Show 的一日流程。",
            orientation: "portrait"
          }
        ]
      },
      {
        heading: "活动之后，继续回到线上主赛",
        body: "miniCamp 的价值在于帮参与者完成线下认识、组队和原型推进；后续报名、赛程与作品提交仍以线上智极松 AI Skillathon 官方页面为准。",
        media: [
          {
            src: "/images/activity-records/stories/zhijisong-minicamp-partners.webp",
            alt: "智极松 miniCamp 承办方与合作伙伴",
            caption: "海报中的承办方与合作伙伴信息。",
            orientation: "portrait"
          }
        ]
      }
    ]
  }
];
