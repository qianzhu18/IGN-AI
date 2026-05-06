export type ContentType = "article" | "event" | "story" | "resource";

export type CommunityContentItem = {
  slug: string;
  type: ContentType;
  eyebrow: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  coverImage?: string;
  actionLabel?: string;
  href: string;
  tags: string[];
  content?: Array<{
    heading: string;
    body: string;
  }>;
};

export type CommunityProject = {
  title: string;
  description: string;
  status: string;
  href: string;
  tags: string[];
};

export const platformContent = {
  architecture: [
    {
      title: "Sanity 编辑后台",
      description: "文章、活动、成员故事、资源库与项目展示都从 Sanity 管理。",
    },
    {
      title: "Supabase 业务数据",
      description: "加入申请、报名记录、成员状态、合作线索进入 Supabase。",
    },
    {
      title: "Vercel 自动部署",
      description: "Next.js 前台部署在 Vercel，Git 推送和内容发布都能触发上线。",
    },
  ],
  showcase: {
    eyebrow: "Community Feed",
    title: "近期联动活动与社区记录。",
    description:
      "把线下聚会、主题共创、成员故事和实践文章整理成可持续更新的社区信息流。",
  },
};

export const fallbackContentItems: CommunityContentItem[] = [
  {
    slug: "why-ignite-builders-first",
    type: "article",
    eyebrow: "Article",
    title: "AI 社区为什么要先点燃行动者",
    description:
      "从信息密度、表达欲和真实协作出发，解释 IGNAI 想做的社区飞轮。",
    date: "2026-05-02",
    coverImage: "/images/generated/local-global-embers.png",
    actionLabel: "阅读文章",
    href: "/blog/why-ignite-builders-first",
    tags: ["观点", "社区"],
    content: [
      {
        heading: "为什么不是先做一个热闹的群",
        body:
          "一个社区最稀缺的不是人数，而是愿意真的表达、试错和协作的人。IGNAI 想先接住的是这批行动者，而不是先把表面上的热闹堆起来。",
      },
      {
        heading: "为什么是现在",
        body:
          "AI 工具已经足够普及，但真实的本地连接、长期内容沉淀和协作关系仍然稀缺。越是这种时候，越需要一个能把人与项目重新组织起来的社区容器。",
      },
      {
        heading: "我们想要形成什么飞轮",
        body:
          "表达带来连接，连接带来共创，共创产出新的内容与项目，新的内容再把更多行动者吸引进来。这比单纯做活动清单更接近一个活的社区。",
      },
    ],
  },
  {
    slug: "changsha-ai-builder-night-feed",
    type: "event",
    eyebrow: "Event",
    title: "长沙 AI Builder 夜谈",
    description:
      "围绕 Agent、产品原型和内容生产，邀请本地行动者做一次小规模圆桌交流。",
    date: "2026/05 下旬",
    location: "长沙 / 线下",
    coverImage: "/images/generated/human-energy-scene.png",
    actionLabel: "查看活动",
    href: "/events",
    tags: ["线下聚会", "长沙"],
  },
  {
    slug: "ai-workflow-workshop-feed",
    type: "event",
    eyebrow: "Co-build",
    title: "AI Workflow 共创工作坊",
    description:
      "用一个晚上拆解真实工作流，把提示词、自动化和发布链路整理成可复用模板。",
    date: "筹备中",
    location: "线上 + 线下",
    coverImage: "/images/generated/collaboration-threads.png",
    actionLabel: "加入共创",
    href: "/events",
    tags: ["工作流", "共创"],
  },
  {
    slug: "from-chat-to-demo-story",
    type: "story",
    eyebrow: "Story",
    title: "一个项目从群聊走到 Demo",
    description:
      "记录成员如何从一次讨论开始，把想法变成可演示的产品雏形。",
    date: "Draft",
    coverImage: "/images/generated/ignite-core.png",
    actionLabel: "阅读故事",
    href: "/stories/from-chat-to-demo-story",
    tags: ["成员故事", "项目"],
    content: [
      {
        heading: "起点不是商业计划，而是一句真实表达",
        body:
          "很多项目都不是从完整 roadmap 开始，而是从一次群聊里具体的问题、一次想展示点什么的冲动开始。关键不是准备得多完整，而是有人先把它拿出来。",
      },
      {
        heading: "社区提供的不是替你做，而是让你更容易迈出下一步",
        body:
          "当有人愿意给出第一轮反馈、介绍合适的人、一起梳理表达方式，想法就更容易从聊天走向 demo。这个过程本身就是社区价值的一部分。",
      },
      {
        heading: "被看见之后，项目才真正进入增长循环",
        body:
          "一个 demo 被看见，才会有反馈、协作和新的迭代目标。故事页的意义，也是把这种成长路径留成下一位行动者可以参考的记录。",
      },
    ],
  },
  {
    slug: "ai-tools-and-workflow-stack",
    type: "resource",
    eyebrow: "Resource",
    title: "AI 工具与工作流清单",
    description:
      "沉淀社区里反复被验证过的工具、模板、提示词和搭建经验。",
    date: "Updating",
    coverImage: "/images/generated/collaboration-threads.png",
    actionLabel: "查看资源",
    href: "/blog/ai-tools-and-workflow-stack",
    tags: ["资源", "工作流"],
    content: [
      {
        heading: "为什么资源页重要",
        body:
          "资源页不是为了堆工具名，而是为了留下那些在真实工作里反复被验证、能解释适用场景、并且能被后来者直接复用的方法和模板。",
      },
      {
        heading: "这类内容应该如何维护",
        body:
          "最适合的做法是先从社区里已经有人在用的工作流开始，每次只增加少量、但有明确上下文的工具和模板，而不是维护一张越来越泛的万能清单。",
      },
    ],
  },
];

export const fallbackProjects: CommunityProject[] = [
  {
    title: "Prompt to Product",
    description: "围绕 AI 产品从想法到 Demo 的共创小组。",
    status: "Recruiting",
    href: "/events",
    tags: ["Product", "Agent"],
  },
  {
    title: "Changsha AI Map",
    description: "整理长沙本地 AI 开发者、活动、空间和资源。",
    status: "Planning",
    href: "/stories",
    tags: ["Local", "Network"],
  },
  {
    title: "Creator Stack",
    description: "把内容生产、自动化和发布流程做成可复用方法。",
    status: "Running",
    href: "/blog",
    tags: ["Content", "Workflow"],
  },
];
