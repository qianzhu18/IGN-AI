import Head from "next/head";
import Link from "next/link";
import type { GetServerSidePropsContext } from "next";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { adminNavItems } from "@/src/components/admin/adminConfig";
import { OpsAccessGate } from "@/src/components/admin/OpsAccessGate";
import { isOpsAuthorized, isOpsPasswordConfigured } from "@/lib/join";

type ManageContentPageProps = {
  gateMode?: "login" | "setup";
};

const contentCards = [
  {
    title: "活动发布",
    body: "活动以 Notion Event 为主源。把状态设为 Published 就会进入前台，Invisible / Draft 会隐藏。",
    bullets: [
      "发布新活动：在 Notion 新建 type=Event 的页面",
      "核心字段：slug、summary、date、tags、page cover、ext.status/location/format",
      "报名链接与二维码：维护 ext.registrationUrl / ext.registrationQrImage",
    ],
  },
  {
    title: "社区记录",
    body: "活动复盘、成员故事、项目记录和工具清单暂时仍可走现有内容流，后续再收束为 Records。",
    bullets: ["发布新记录：沿用当前内容后台", "首页与列表会按排序字段自动展示"],
  },
];

export default function ManageContentPage({ gateMode }: ManageContentPageProps) {
  if (gateMode) {
    return (
      <>
        <Head>
          <title>Content Admin Access</title>
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
        <title>内容发布后台</title>
        <meta name="description" content="活动与社区记录的内容发布入口。" />
      </Head>
      <AdminShell
        eyebrow="Content Ops"
        title="内容发布"
        description="这页收束内容运营入口。活动发布以 Notion Event 为主源，前台列表、详情和首页活动区块都会读取同一份数据。"
        navItems={adminNavItems}
        currentHref="/manage/content"
        actions={[
          { href: "/events", label: "查看活动前台" },
          { href: "/manage/join", label: "查看申请池", secondary: true },
        ]}
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {contentCards.map((item) => (
            <section key={item.title} className="surface-card p-5 sm:p-6">
              <p className="card-eyebrow">Content module</p>
              <h2 className="mt-4 text-[1.35rem] font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.body}</p>
              <div className="mt-5 grid gap-3">
                {item.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/68"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="surface-card-strong p-5 sm:p-6">
          <p className="card-eyebrow">Quick paths</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/events"
              className="button-shine inline-flex items-center justify-center rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-6 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5"
            >
              查看活动前台
            </Link>
            <Link
              href="/manage/join"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/72 transition hover:border-white/18 hover:text-white"
            >
              去申请池联动查看线索
            </Link>
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
