export type RecordType = "recap" | "story" | "resource" | "project";

export type RecordItem = {
  slug: string;
  title: string;
  type: RecordType;
  dateText: string;
  location?: string;
  cover: string;
  excerpt: string;
  outcomes?: string[];
  tags: string[];
  content: Array<{
    heading: string;
    body: string;
  }>;
  links?: Array<{
    label: string;
    href: string;
  }>;
};

export const recordTypeLabel: Record<RecordType, string> = {
  recap: "活动复盘",
  story: "成员故事",
  resource: "工具清单",
  project: "项目记录",
};

export const records: RecordItem[] = [
  {
    slug: "first-ai-builder-night",
    title: "第一次 AI Builder 夜谈",
    type: "recap",
    dateText: "2026 / 04",
    location: "长沙",
    cover: "/images/generated/human-energy-scene.png",
    excerpt:
      "12 位本地行动者围绕 Agent、内容生产和项目启动进行了一次小规模圆桌。",
    outcomes: ["3 个项目想法", "1 份工具清单", "2 篇社区记录"],
    tags: ["活动复盘", "Agent", "长沙"],
    content: [
      {
        heading: "这次活动发生了什么",
        body:
          "这次夜谈把群聊里的讨论带到了线下。大家围绕自己正在做的项目、遇到的问题和最近看到的 AI 信号做了轮流分享。",
      },
      {
        heading: "我们讨论了什么",
        body:
          "讨论集中在 Agent 原型、内容生产流程、本地社区协作和年轻 Builder 如何更早进入真实项目。很多问题没有标准答案，但现场形成了下一步共创的线索。",
      },
      {
        heading: "下一步",
        body:
          "我们会把这次产生的工具清单和项目想法继续整理，并把其中适合公开的部分沉淀成社区记录。",
      },
    ],
  },
  {
    slug: "workflow-tool-list",
    title: "AI 工作流工具清单",
    type: "resource",
    dateText: "持续更新",
    cover: "/images/generated/collaboration-threads.png",
    excerpt:
      "社区里反复被验证过的提示词、自动化工具、内容生产流程和发布链路。",
    outcomes: ["提示词模板", "自动化工具", "内容发布链路"],
    tags: ["工具清单", "Workflow", "内容生产"],
    content: [
      {
        heading: "为什么整理工具清单",
        body:
          "工具很多，但真正经过真实场景验证的工具并不多。这份清单会优先记录社区成员已经用过、能复用、能解释使用场景的工具。",
      },
    ],
  },
  {
    slug: "from-chat-to-demo",
    title: "一个项目从群聊走到 Demo",
    type: "project",
    dateText: "Draft",
    cover: "/images/generated/ignite-core.png",
    excerpt:
      "记录成员如何从一次讨论开始，把想法变成可演示的产品雏形。",
    outcomes: ["1 个 Demo", "2 次反馈", "下一轮迭代计划"],
    tags: ["项目记录", "Demo", "共创"],
    content: [
      {
        heading: "从一句想法开始",
        body:
          "很多项目不是从完整商业计划开始，而是从一个具体问题、一句群聊里的表达和一次愿意上手的行动开始。",
      },
    ],
  },
];
