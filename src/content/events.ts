export type EventStatus = "planning" | "ongoing" | "recap" | "open" | "closed" | "finished";
export type EventFormat = "offline" | "online" | "hybrid";
export type EventKind = "hosted" | "cohosted" | "promoted" | "participating";

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
  audience: string[];
  agenda: string[];
  hosts: string[];
  notes: string[];
  content: Array<{
    heading: string;
    body: string;
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

// Last-known seeds from the real Notion Event rows.
// Runtime pages prefer Notion `type=Event` data; this array is only an offline fallback.
export const events: EventItem[] = [
  {
    slug: "ignai-community-kickoff",
    title: "IGNAI 社区启动会",
    subtitle: "认识彼此，一起定义这个社区该是什么样子",
    status: "planning",
    dateText: "2026 / 06 / 14 周六下午",
    location: "长沙 · 天心区共享办公",
    format: "offline",
    cover: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    excerpt:
      "IGNAI 的第一次正式社区聚会。认识彼此，分享你正在关注的 AI 方向，一起定义这个社区该是什么样子。",
    tags: ["社区活动", "长沙", "启动会", "Networking"],
    registrationUrl: "",
    registrationQrImage: "",
    audience: [
      "正在关注 AI 产品、内容、自动化和真实项目的人",
      "希望参与 IGNAI 社区早期共建的人",
      "想找到本地交流和协作入口的人",
    ],
    agenda: [],
    hosts: ["IGNAI / 洋来社"],
    notes: [
      "社区愿景共识",
      "兴趣小组划分",
      "首批共创项目",
    ],
    content: [
      {
        heading: "活动目标",
        body:
          "这是一场 IGNAI 的正式社区启动聚会，用来让早期成员认识彼此、同步关注方向，并把社区后续的共创主题落到具体行动。",
      },
    ],
  },
  {
    slug: "ai-builder-night-01",
    title: "长沙 AI Builder 夜谈 #1",
    subtitle: "围绕 Agent 产品原型、自动化工作流和内容生产的小规模圆桌",
    status: "open",
    dateText: "2026 / 05 / 28 周四晚",
    location: "长沙 · 岳麓区创新空间",
    format: "offline",
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    excerpt:
      "围绕 Agent 产品原型、自动化工作流和内容生产，邀请本地行动者做一次小规模圆桌交流。",
    tags: ["线下聚会", "长沙", "Builder", "Agent"],
    registrationUrl: "",
    registrationQrImage: "",
    audience: [
      "正在做 AI 产品或原型的人",
      "正在学习 Agent、自动化和未来工作流的人",
      "希望找到共创伙伴的 Builder",
    ],
    agenda: [],
    hosts: ["IGNAI / 洋来社"],
    notes: ["3 个项目想法", "1 份工具清单", "2 篇社区记录"],
    content: [
      {
        heading: "活动目标",
        body:
          "这是一场面向本地 AI 行动者的小型交流。我们会围绕 Agent、产品原型、内容生产和真实项目展开讨论，让具体的人和具体的项目真正连接起来。",
      },
    ],
  },
];
