import type { Metadata } from "next";
import { BadgeCheck, ImageUp, Link2, MapPinHouse, ShieldCheck, UserRound } from "lucide-react";

import { adminNavItems } from "@/components/admin/adminConfig";
import { AdminShell } from "@/components/admin/AdminShell";
import { OpsAccessGate } from "@/components/admin/OpsAccessGate";
import { isOpsPasswordConfigured, isOpsRequestAuthorized } from "@/lib/opsAuth";

export const metadata: Metadata = {
  title: "Members Admin | IGNAI",
  description: "IGNAI 社区成员管理后台规划页。",
};

const publicFields = [
  { label: "成员头像", note: "公开展示前需要成员授权", icon: ImageUp },
  { label: "昵称 / 名称", note: "用于成员卡片和详情页", icon: UserRound },
  { label: "城市 / 地点", note: "保持轻量信息密度", icon: MapPinHouse },
  { label: "身份标签", note: "Builder / Creator / Connector 等", icon: BadgeCheck },
  { label: "简介 / 自介", note: "一句话简介 + 详情页长自介", icon: ShieldCheck },
  { label: "项目 / 作品链接", note: "连接成员与真实产出", icon: Link2 },
];

const phases = [
  {
    title: "P1 公开成员资料",
    items: ["Sanity member schema", "头像上传", "简介 / 自介", "发布 / draft 状态"],
  },
  {
    title: "P2 成员展示页",
    items: ["首页成员预览", "/members 列表页", "/members/[slug] 详情页", "精选排序"],
  },
  {
    title: "P3 成员业务化",
    items: ["成员身份", "权限治理", "私密字段", "与申请池联动"],
  },
];

export default async function ManageMembersPage() {
  if (!isOpsPasswordConfigured) {
    return (
      <AdminShell
        eyebrow="Admin / Setup"
        title="成员管理"
        description="成员管理已经挂进后台平台，但要先配置管理员访问密码，才能继续查看和建设。"
        navItems={adminNavItems}
        currentHref="/manage/members"
      >
        <OpsAccessGate mode="setup" surface="admin" />
      </AdminShell>
    );
  }

  if (!(await isOpsRequestAuthorized())) {
    return (
      <AdminShell
        eyebrow="Admin / Login"
        title="成员管理"
        description="当前成员管理只对管理员开放。验证密码后，才能继续规划资料结构与展示控制。"
        navItems={adminNavItems}
        currentHref="/manage/members"
      >
        <OpsAccessGate mode="login" surface="admin" />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      eyebrow="Admin / Members"
      title="成员管理"
      description="这块还没有完全落地，但已经作为后台平台里的正式模块挂上来了。它会成为后续社区画像、连接和展示的核心能力。"
      navItems={adminNavItems}
      currentHref="/manage/members"
      actions={[{ href: "/manage", label: "返回后台首页", secondary: true }]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-card-strong p-5 sm:p-6">
          <p className="card-eyebrow">公开字段</p>
          <div className="mt-5 grid gap-4">
            {publicFields.map((field) => (
              <div key={field.label} className="flex items-start gap-4 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/78">
                  <field.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{field.label}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{field.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          {phases.map((phase) => (
            <div key={phase.title} className="surface-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
              <div className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <p key={item} className="text-sm text-white/64">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="border-t border-white/10 pt-8">
        <div className="surface-card p-5 sm:p-6">
          <p className="card-eyebrow">当前判断</p>
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-7 text-white/66">
              你前面强调的“头像、简介、自介”已经不只是待办文字了，现在它被挂成后台平台里的正式模块。
            </p>
            <p className="text-sm leading-7 text-white/66">
              下一步只要把 `member schema` 接进 Sanity，再把前台 `/members` 页面做出来，这个模块就会从规划态走到真实可用态。
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
