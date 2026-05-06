import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarRange,
  FileClock,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";

import { adminNavItems } from "@/components/admin/adminConfig";
import { AdminShell } from "@/components/admin/AdminShell";
import { OpsAccessGate } from "@/components/admin/OpsAccessGate";
import { isOpsPasswordConfigured, isOpsRequestAuthorized } from "@/lib/opsAuth";

export const metadata: Metadata = {
  title: "Manage | IGNAI",
  description: "IGNAI 社区后台工作台，统一管理内容发布、申请池与后续成员系统。",
};

const modules = [
  {
    title: "发布活动",
    body: "从活动建立、封面上传、报名链接到报名二维码，都应该是一条短路径工作流。",
    href: "/manage/content",
    cta: "进入内容发布台",
    icon: CalendarRange,
    status: "内容后台",
    points: ["新建活动", "上传封面", "填 registrationUrl", "上传报名二维码"],
  },
  {
    title: "发布社区记录",
    body: "活动复盘、社区分享、项目记录、成员故事都应该收敛到统一记录工作流。",
    href: "/manage/content",
    cta: "进入记录发布台",
    icon: FileClock,
    status: "内容后台",
    points: ["新建记录", "上传封面", "填写摘要正文", "补相关链接"],
  },
  {
    title: "处理申请池",
    body: "运营后台负责接住加入申请，完成初步判断、状态流转与后续跟进。",
    href: "/manage/join",
    cta: "打开申请池",
    icon: Sparkles,
    status: "已接入权限门",
    points: ["查看列表", "筛选状态", "改状态", "保留跟进节奏"],
  },
];

const workflows = [
  {
    title: "活动发布流",
    items: [
      "进入内容编辑后台",
      "打开「近期活动」",
      "新建或编辑活动",
      "上传封面图",
      "填写报名链接或报名二维码",
      "检查前台展示后 Publish",
    ],
  },
  {
    title: "社区记录流",
    items: [
      "进入内容编辑后台",
      "打开「现场记录」",
      "新建或编辑记录",
      "上传封面图与补充链接",
      "填写摘要与正文",
      "检查排序后 Publish",
    ],
  },
];

const priorities = [
  "后台入口只对管理员开放，必须先过密钥门。",
  "普通成员默认只保留预览，不直接暴露编辑态。",
  "活动发布和社区记录发布要继续压缩路径，减少重复字段。",
  "成员管理将作为下一阶段核心模块接入后台平台。",
];

const roadmap = [
  "成员头像上传",
  "成员简介 / 自介编辑",
  "成员身份标签",
  "成员项目 / 作品链接",
  "成员状态与展示控制",
];

export default async function ManagePage() {
  if (!isOpsPasswordConfigured) {
    return (
      <AdminShell
        eyebrow="Admin / Setup"
        title="社区后台平台"
        description="后台平台已经有结构，但要先配置管理员访问密码，才能真正作为封闭后台使用。"
        navItems={adminNavItems}
        currentHref="/manage"
      >
        <OpsAccessGate mode="setup" surface="admin" />
      </AdminShell>
    );
  }

  if (!(await isOpsRequestAuthorized())) {
    return (
      <AdminShell
        eyebrow="Admin / Login"
        title="社区后台平台"
        description="当前后台只对管理员开放。完成密码验证后，才能进入发布、上传和运营工作台。"
        navItems={adminNavItems}
        currentHref="/manage"
      >
        <OpsAccessGate mode="login" surface="admin" />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      eyebrow="Admin / Platform"
      title="社区后台平台"
      description="这里不再只是入口说明，而是统一承接内容发布、线索运营和后续成员治理的社区后台工作台。"
      navItems={adminNavItems}
      currentHref="/manage"
      actions={[
        { href: "/manage/content", label: "打开内容发布台" },
        { href: "/manage/join", label: "打开申请池", secondary: true },
      ]}
      rail={
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section>
            <p className="card-eyebrow">平台约束</p>
            <div className="mt-4 space-y-4">
              {priorities.map((item) => (
                <div key={item} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm leading-7 text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="card-eyebrow">成员管理预留</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {roadmap.map((item) => (
                <div key={item} className="border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/68">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {modules.map((module) => (
          <section key={module.title} className="surface-card-strong p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                <module.icon className="h-5 w-5" />
              </div>
              <span className="text-[0.68rem] uppercase text-[#f0cb8a]">{module.status}</span>
            </div>

            <h3 className="mt-5 text-[1.2rem] font-semibold text-white">{module.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{module.body}</p>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
              {module.points.map((point) => (
                <p key={point} className="text-sm text-white/68">
                  {point}
                </p>
              ))}
            </div>

            <Link
              href={module.href}
              className="mt-6 inline-flex items-center gap-2 text-sm text-[#ffd09a] transition hover:text-white"
            >
              <span>{module.cta}</span>
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          </section>
        ))}
      </div>

      <div className="grid gap-8 border-t border-white/10 pt-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section>
          <p className="card-eyebrow">高频工作流</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {workflows.map((workflow) => (
              <div key={workflow.title} className="surface-card p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-white">{workflow.title}</h3>
                <div className="mt-5 space-y-3">
                  {workflow.items.map((item, index) => (
                    <div key={item} className="flex items-start gap-3 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-white/64">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-white/68">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="card-eyebrow">后台治理</p>
          <div className="mt-5 space-y-5">
            <div className="surface-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">管理员密钥门</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    `/manage`、`/studio`、`/ops/join` 现在统一要求管理员密码。后台入口不再按“公开说明页”处理。
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/78 text-[#9aceff]">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">上传入口</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    当前上传能力仍走 Studio 文档字段，但现在已经被纳入同一后台平台语境。后续可继续升级成更轻的内容录入工作流。
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">成员平台预留</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    后续成员头像、简介、自介、身份和展示状态，会接到这套后台平台里，而不是另起一套散乱入口。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 pt-8">
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/78 text-[#9aceff]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="card-eyebrow">Access model</p>
                <h3 className="mt-3 text-[1.2rem] font-semibold text-white">成员预览，管理员编辑</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  这套后台从现在开始按明确角色划分来设计。普通成员看前台内容与后续成员展示页，管理员负责内容编辑、上传和运营状态管理。
                </p>
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <p className="card-eyebrow">当前判断</p>
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-7 text-white/68">
                这次先把后台平台骨架立起来，解决“没有后台布局”和“入口不成系统”的问题。
              </p>
              <p className="text-sm leading-7 text-white/68">
                下一步再继续压缩 Studio 字段组织和录入路径，才能真正把活动发布、社区记录和分享沉淀做顺手。
              </p>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
