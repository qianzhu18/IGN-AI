export type ContentType = "article" | "event" | "story" | "resource";

export type CommunityContentItem = {
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
    type: "article",
    eyebrow: "Article",
    title: "AI 社区为什么要先点燃行动者",
    description:
      "从信息密度、表达欲和真实协作出发，解释 IGNAI 想做的社区飞轮。",
    date: "2026-05-02",
    coverImage: "/images/generated/local-global-embers.png",
    actionLabel: "阅读文章",
    href: "/blog",
    tags: ["观点", "社区"],
  },
  {
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
    type: "story",
    eyebrow: "Story",
    title: "一个项目从群聊走到 Demo",
    description:
      "记录成员如何从一次讨论开始，把想法变成可演示的产品雏形。",
    date: "Draft",
    coverImage: "/images/generated/ignite-core.png",
    actionLabel: "阅读故事",
    href: "/stories",
    tags: ["成员故事", "项目"],
  },
  {
    type: "resource",
    eyebrow: "Resource",
    title: "AI 工具与工作流清单",
    description:
      "沉淀社区里反复被验证过的工具、模板、提示词和搭建经验。",
    date: "Updating",
    coverImage: "/images/generated/collaboration-threads.png",
    actionLabel: "查看资源",
    href: "/blog",
    tags: ["资源", "工作流"],
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
