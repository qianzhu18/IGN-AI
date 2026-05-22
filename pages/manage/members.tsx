import Head from "next/head";
import Link from "next/link";
import type { GetServerSidePropsContext } from "next";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { adminNavItems } from "@/src/components/admin/adminConfig";
import { OpsAccessGate } from "@/src/components/admin/OpsAccessGate";
import { isOpsAuthorized, isOpsPasswordConfigured } from "@/lib/join";

type ManageMembersPageProps = {
  gateMode?: "login" | "setup";
};

const nextSteps = [
  "从申请池里筛出值得推进的人。",
  "补齐头像、简介、自介、外链和展示状态。",
  "下一轮再把申请通过后一键转成员接起来。",
];

export default function ManageMembersPage({ gateMode }: ManageMembersPageProps) {
  if (gateMode) {
    return (
      <>
        <Head>
          <title>Members Admin Access</title>
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
        <title>成员管理</title>
        <meta name="description" content="成员资料管理的后续入口。" />
      </Head>
      <AdminShell
        eyebrow="Member Ops"
        title="成员管理"
        description="这块现在还是过渡态。Join 申请已经能收集成员资料草稿，下一步就是把通过审核的人整理成正式成员信息。"
        navItems={adminNavItems}
        currentHref="/manage/members"
        actions={[
          { href: "/members", label: "查看 Members 页面" },
          { href: "/manage/join", label: "回到申请池", secondary: true },
        ]}
      >
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="surface-card-strong p-5 sm:p-6">
            <p className="card-eyebrow">Next build</p>
            <h2 className="mt-4 text-[1.4rem] font-semibold text-white">
              这里先作为成员编排入口。
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              现在最实用的流程，是先在申请池里筛选，再把合适的人整理进 Members 展示页。等下一轮再把审核备注、展示开关和自动转成员接上。
            </p>

            <div className="mt-6 space-y-3">
              {nextSteps.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/68"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-5 sm:p-6">
            <p className="card-eyebrow">Current routes</p>
            <div className="mt-4 space-y-3">
              <Link
                href="/members"
                className="block rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72 transition hover:border-white/18 hover:text-white"
              >
                Members 列表页
              </Link>
              <Link
                href="/manage/join"
                className="block rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72 transition hover:border-white/18 hover:text-white"
              >
                申请池
              </Link>
            </div>
          </div>
        </section>
      </AdminShell>
    </>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  if (!isOpsPasswordConfigured()) {
    return { props: { gateMode: "setup" } };
  }

  if (!isOpsAuthorized(context.req)) {
    return { props: { gateMode: "login" } };
  }

  return { props: {} };
}
