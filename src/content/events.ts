export type EventStatus = "open" | "planning" | "closed" | "finished";
export type EventFormat = "offline" | "online" | "hybrid";

export type EventItem = {
  slug: string;
  title: string;
  subtitle?: string;
  status: EventStatus;
  dateText: string;
  location: string;
  format: EventFormat;
  cover: string;
  excerpt: string;
  tags: string[];
  registrationUrl?: string;
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
  open: "开放报名",
  planning: "筹备中",
  closed: "已满员",
  finished: "已结束",
};

export const eventFormatLabel: Record<EventFormat, string> = {
  offline: "线下",
  online: "线上",
  hybrid: "线上 + 线下",
};

export const events: EventItem[] = [
  {
    slug: "changsha-ai-builder-night",
    title: "长沙 AI Builder 夜谈",
    subtitle: "从群聊走向现场的小规模圆桌",
    status: "open",
    dateText: "2026 / 05 下旬",
    location: "长沙",
    format: "offline",
    cover: "/images/generated/human-energy-scene.png",
    excerpt:
      "围绕 Agent、产品原型和内容生产，邀请本地行动者做一次小规模圆桌交流。",
    tags: ["线下聚会", "长沙", "Builder"],
    registrationUrl: "/join",
    audience: [
      "正在做 AI 产品或原型的人",
      "正在学习 Agent、自动化和未来工作流的学生",
      "希望找到共创伙伴的 Builder",
      "想加入本地 AI 社区的人",
    ],
    agenda: [
      "19:00 签到与自由交流",
      "19:30 主题分享：最近大家在做什么",
      "20:10 圆桌讨论：Agent、内容生产与项目启动",
      "21:00 Demo / 项目自荐",
      "21:30 自由连接",
    ],
    hosts: ["IGNAI / 洋来社"],
    notes: [
      "第一版报名可以先通过加入社区入口完成。",
      "活动规模会保持小而密，优先保证讨论质量。",
    ],
    content: [
      {
        heading: "这是一场什么活动",
        body:
          "这是一场面向本地 AI 行动者的小型交流。我们会围绕 Agent、产品原型、内容生产和真实项目展开讨论，目标不是围观趋势，而是让具体的人和具体的项目真正连接起来。",
      },
      {
        heading: "为什么要做线下",
        body:
          "AI 信息已经足够多，但真实连接仍然稀缺。线下聚会可以让群聊里的名字变成真实的人，也让想法更容易进入下一步协作。",
      },
    ],
  },
  {
    slug: "ai-workflow-workshop",
    title: "AI Workflow 共创工作坊",
    subtitle: "把真实工作流拆成可复用模板",
    status: "planning",
    dateText: "筹备中",
    location: "长沙 / 线上",
    format: "hybrid",
    cover: "/images/generated/collaboration-threads.png",
    excerpt:
      "用一个晚上拆解真实工作流，把提示词、自动化和发布链路整理成可复用模板。",
    tags: ["工作流", "共创", "内容生产"],
    registrationUrl: "/join",
    audience: [
      "正在用 AI 提升个人工作流的人",
      "想把内容生产流程系统化的创作者",
      "希望搭建自动化链路的 Builder",
    ],
    agenda: [
      "流程拆解：从输入到输出",
      "工具共创：提示词、自动化和发布链路",
      "模板整理：形成可复用清单",
      "下一步：公开记录与社区分享",
    ],
    hosts: ["IGNAI Workflow Group"],
    notes: ["筹备期会先收集参与者的真实工作流案例。"],
    content: [
      {
        heading: "工作坊产出什么",
        body:
          "我们希望每一次工作坊都不只停留在聊天，而是能留下工具清单、流程模板、可复制的实践记录，以及下一次共创的入口。",
      },
    ],
  },
  {
    slug: "agent-demo-hour",
    title: "Agent Demo Hour",
    subtitle: "把正在做的东西拿出来看看",
    status: "planning",
    dateText: "规划中",
    location: "线上",
    format: "online",
    cover: "/images/generated/ignite-core.png",
    excerpt:
      "一次轻量的线上 Demo 时段，鼓励成员展示正在做的 Agent、工具或产品雏形。",
    tags: ["Demo", "Agent", "线上"],
    registrationUrl: "/join",
    audience: ["正在做 Agent 的开发者", "想获得真实反馈的产品行动者", "希望找到协作者的人"],
    agenda: ["Demo 展示", "问题反馈", "协作匹配", "下次迭代目标"],
    hosts: ["IGNAI Demo Circle"],
    notes: ["每次控制 3-5 个 Demo，保持节奏轻量。"],
    content: [
      {
        heading: "为什么要做 Demo Hour",
        body:
          "很多想法只有被展示出来，才会获得反馈和连接。Demo Hour 是一个低门槛的公开表达场，让项目在早期就进入真实讨论。",
      },
    ],
  },
];
