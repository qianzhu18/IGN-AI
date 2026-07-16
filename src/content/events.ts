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
    slug: "zhijisong-minicamp-changsha-2026",
    title: "智极松 miniCamp 一日黑客松（长沙站）",
    subtitle: "正在执行 · 7 月 18 日 · 长沙",
    kind: "cohosted",
    status: "ongoing",
    dateText: "2026 年 7 月 18 日",
    location: "长沙岳麓一缦酒店",
    format: "offline",
    cover: "/images/activity-records/zhijisong-minicamp-changsha-2026.webp",
    excerpt: "IGNAI 正在参与智极松线下 miniCamp 的执行与社群连接。一天内，参与者会从找队友、定选题开始，把一个 AI 想法推进到可展示的 Demo。",
    tags: ["智极松", "AI Skillathon", "一日黑客松"],
    publicListing: true,
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
      "报名与场地变动请以活动主办方的最新公告为准。"
    ],
    content: [
      {
        heading: "把一个想法带到真实场景里",
        body: "智极松是一场面向 AI 创作者、开发者、学生团队和创业团队的实战型赛事。长沙 miniCamp 是它在长沙的第一站：在报名截止前，参与者可以了解赛道、找到队友、明确选题、打磨原型，并为后续参赛做好准备。",
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
        heading: "一天里，先把队伍和 Demo 做出来",
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
        heading: "IGNAI 正在参与执行",
        body: "活动海报将 IGNAI 列为承办方之一。我们正在协助这次线下 miniCamp 的执行与社群连接，让来到现场的人能更容易找到同伴、延续交流，并把下一步的项目实践带回社区。",
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
