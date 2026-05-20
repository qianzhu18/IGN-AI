import type { AdminNavItem } from "@/src/components/admin/AdminShell";

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/manage",
    label: "后台首页",
    note: "查看后台总览、当前模块状态与治理优先级。",
    state: "Live",
  },
  {
    href: "/manage/content",
    label: "内容发布",
    note: "活动、社区记录、封面、报名配置与正文编辑。",
    state: "Admin",
  },
  {
    href: "/manage/join",
    label: "申请池",
    note: "查看加入申请、筛选状态与持续跟进。",
    state: "Admin",
  },
  {
    href: "/manage/members",
    label: "成员管理",
    note: "成员头像、简介、自介与展示控制的后续核心模块。",
    state: "Todo",
  },
] as const;
