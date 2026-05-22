import Head from "next/head";
import Link from "next/link";
import type { GetServerSidePropsContext } from "next";
import { ArrowUpRight, FilePenLine, Inbox, Users } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { adminNavItems } from "@/src/components/admin/adminConfig";
import { OpsAccessGate } from "@/src/components/admin/OpsAccessGate";
import {
  isOpsAuthorized,
  isOpsPasswordConfigured,
  listJoinApplications,
} from "@/lib/join";
import type { JoinApplicationRecord } from "@/lib/supabase";

type ManageHomePageProps = {
  gateMode?: "login" | "setup";
  joinCount: number;
  latestSubmission: Pick<JoinApplicationRecord, "name" | "created_at" | "status"> | null;
};

const quickLinks = [
  {
    href: "/manage/join",
    label: "查看申请池",
    note: "处理新线索、切状态、查看成员资料草稿。",
    icon: Inbox,
  },
  {
    href: "/manage/content",
    label: "内容发布",
    note: "进入内容治理页，衔接 Studio 与活动报名配置。",
    icon: FilePenLine,
  },
  {
    href: "/manage/members",
    label: "成员管理",
    note: "后续用于正式成员卡片、头像和对外展示维护。",
    icon: Users,
  },
];

export default function ManageHomePage({
  gateMode,
  joinCount,
  latestSubmission,
}: ManageHomePageProps) {
  if (gateMode) {
    return (
      <>
        <Head>
          <title>Admin Access</title>
        </Head>
        <main className="min-h-screen bg-[#05070b] px-5 py-16">
          <OpsAccessGate mode={gateMode} surface="admin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>社区后台</title>
        <meta name="description" content="社区后台总览与运营入口。" />
      </Head>
      <AdminShell
        eyebrow="Admin platform"
        title="后台首页"
        description="这里先把加入申请、内容发布和后续成员整理放进同一个后台入口，方便运营每天快速巡检。"
        navItems={adminNavItems}
        currentHref="/manage"
        actions={[
          { href: "/join", label: "打开 Join 页面" },
          { href: "/studio", label: "打开内容后台", secondary: true },
        ]}
      >
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="surface-card-strong p-5 sm:p-6">
            <p className="card-eyebrow">今日入口</p>
            <div className="mt-4 grid gap-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start justify-between gap-4 rounded-[18px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/18 hover:bg-white/[0.05]"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-white">{item.label}</h2>
                        <p className="mt-2 text-sm leading-7 text-white/56">{item.note}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/42" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="surface-card p-5 sm:p-6">
            <p className="card-eyebrow">Join 信号</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[2rem] font-semibold leading-none text-white">{joinCount}</p>
                <p className="mt-2 text-sm text-white/56">当前已收录的申请总数</p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">Latest</p>
                {latestSubmission ? (
                  <>
                    <p className="mt-3 text-sm font-medium text-white">{latestSubmission.name}</p>
                    <p className="mt-2 text-sm text-white/56">
                      状态：{latestSubmission.status}
                    </p>
                    <p className="mt-1 text-sm text-white/48">
                      提交时间：{new Date(latestSubmission.created_at).toLocaleString("zh-CN")}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    还没有申请记录。现在可以从 Join 页面开始走通首条提交。
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </AdminShell>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!isOpsPasswordConfigured()) {
    return { props: { gateMode: "setup", joinCount: 0, latestSubmission: null } };
  }

  if (!isOpsAuthorized(context.req)) {
    return { props: { gateMode: "login", joinCount: 0, latestSubmission: null } };
  }

  const items = await listJoinApplications();

  return {
    props: {
      joinCount: items.length,
      latestSubmission: items[0]
        ? {
            name: items[0].name,
            created_at: items[0].created_at,
            status: items[0].status,
          }
        : null,
    },
  };
}
