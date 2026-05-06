import type { Metadata } from "next";
import Link from "next/link";
import { CalendarRange, FileText, FolderKanban, ImageUp, Link2, QrCode, ShieldCheck } from "lucide-react";

import { adminNavItems } from "@/components/admin/adminConfig";
import { AdminShell } from "@/components/admin/AdminShell";
import { OpsAccessGate } from "@/components/admin/OpsAccessGate";
import { isOpsPasswordConfigured, isOpsRequestAuthorized } from "@/lib/opsAuth";

export const metadata: Metadata = {
  title: "Content Admin | IGNAI",
  description: "IGNAI 社区内容发布后台，统一承接活动与社区记录编辑。",
};

const quickActions = [
  {
    title: "发布活动",
    icon: CalendarRange,
    lines: ["活动标题与时间", "报名链接", "报名二维码", "封面图与正文"],
  },
  {
    title: "发布社区记录",
    icon: FileText,
    lines: ["复盘与分享", "项目记录", "成员故事", "相关链接"],
  },
];

const uploadRules = [
  { label: "活动封面", value: "近期活动 -> 封面图", icon: ImageUp },
  { label: "活动报名链接", value: "近期活动 -> registrationUrl", icon: Link2 },
  { label: "活动二维码", value: "近期活动 -> 报名二维码", icon: QrCode },
  { label: "记录封面", value: "现场记录 -> 封面图", icon: ImageUp },
];

export default async function ManageContentPage() {
  if (!isOpsPasswordConfigured) {
    return (
      <AdminShell
        eyebrow="Admin / Setup"
        title="内容发布台"
        description="要先配置管理员访问密码，才能进入统一内容发布后台。"
        navItems={adminNavItems}
        currentHref="/manage/content"
      >
        <OpsAccessGate mode="setup" surface="admin" />
      </AdminShell>
    );
  }

  if (!(await isOpsRequestAuthorized())) {
    return (
      <AdminShell
        eyebrow="Admin / Login"
        title="内容发布台"
        description="当前内容发布台只对管理员开放。验证密码后，即可在后台平台内部体验真实编辑器。"
        navItems={adminNavItems}
        currentHref="/manage/content"
      >
        <OpsAccessGate mode="login" surface="admin" />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      eyebrow="Admin / Content"
      title="内容发布台"
      description="这里是后台平台里的真实编辑区。底层编辑器仍然是 Sanity，但你现在可以在统一后台语境里完成活动发布、社区记录发布和上传动作。"
      navItems={adminNavItems}
      currentHref="/manage/content"
      actions={[
        { href: "/manage", label: "返回后台首页", secondary: true },
        { href: "/studio", label: "独立打开 Studio" },
      ]}
      rail={
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section>
            <p className="card-eyebrow">上传规则</p>
            <div className="mt-4 grid gap-3">
              {uploadRules.map((item) => (
                <div key={item.label} className="flex items-start gap-3 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                  <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#9aceff]" />
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-white/56">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="card-eyebrow">当前判断</p>
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-7 text-white/66">
                你之前觉得它分散，是对的。现在先通过平台化入口把编辑体验收拢。
              </p>
              <p className="text-sm leading-7 text-white/66">
                下一步继续做的是字段减负和录入流程压缩，让它更接近你说的 NotionNext 式后台体验。
              </p>
            </div>
          </section>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-5">
          <div className="surface-card-strong p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="card-eyebrow">编辑工作台</p>
                <h3 className="mt-3 text-[1.2rem] font-semibold text-white">统一内容工作流</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  左侧是后台平台导航，右侧是真实的 Sanity 编辑器。你可以把它理解为：社区后台外壳 + 内容编辑核心引擎。
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {quickActions.map((action) => (
              <div key={action.title} className="surface-card p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/78">
                    <action.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                    <div className="mt-4 space-y-2">
                      {action.lines.map((line) => (
                        <p key={line} className="text-sm text-white/62">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="surface-card p-5 sm:p-6">
            <p className="card-eyebrow">底层入口</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/74 transition hover:border-white/18 hover:text-white"
              >
                <FolderKanban className="h-4 w-4" />
                独立打开 Sanity Studio
              </Link>
            </div>
          </div>
        </section>

        <section className="surface-card-strong overflow-hidden p-2">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="card-eyebrow">Embedded Studio</p>
              <p className="mt-1 text-sm text-white/58">在后台平台内直接体验真实编辑器</p>
            </div>
            <Link href="/studio" className="text-sm text-[#ffd09a] transition hover:text-white">
              独立打开
            </Link>
          </div>

          <div className="h-[72vh] min-h-[760px] overflow-hidden rounded-b-lg bg-[#05080d]">
            <iframe
              src="/studio"
              title="IGNAI Sanity Studio"
              className="h-full w-full border-0"
            />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
