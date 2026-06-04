import Head from "next/head";
import Link from "next/link";
import type { GetServerSidePropsContext } from "next";
import { useState } from "react";

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
      "活动封面：直接使用 Notion 页面顶部的添加封面 / 更换封面",
      "核心字段：slug、summary、date 或 event_start、location、tags",
      "活动状态：维护 ext.status=planning/ongoing/recap，兼容 open/closed/finished",
      "活动时间段：优先维护 ext.eventDateText，或填写 event_start / event_end",
      "活动关系：维护 ext.kind=hosted/cohosted/promoted/participating",
      "外部活动：slug 可直接填外部活动 URL，官网会作为外部入口打开",
      "封面裁剪：维护 ext.coverPosition，例如 center、top、50% 35%",
      "报名链接与二维码：维护 ext.registrationUrl / ext.registrationQrImage",
    ],
  },
  {
    title: "社区记录",
    body: "活动复盘、成员故事、项目记录和工具清单当前已在前台开放 Records 入口，后续再把编辑源从静态内容迁移到 Notion 或轻量后台。",
    bullets: [
      "查看记录前台：/records 与 /records/[slug]",
      "当前内容源：src/content/records.ts",
      "后续增强：将 Record 字段迁入 Notion 并接入刷新入口",
    ],
  },
];

function ContentRevalidatePanel() {
  const [eventSlug, setEventSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function readJsonPayload(response: Response): Promise<{
    message?: string;
    revalidated?: string[];
  }> {
    const payload: unknown = await response.json().catch(() => ({}));
    if (!payload || typeof payload !== "object") return {};
    const candidate = payload as { message?: unknown; revalidated?: unknown };
    const result: { message?: string; revalidated?: string[] } = {};
    if (typeof candidate.message === "string") {
      result.message = candidate.message;
    }
    if (Array.isArray(candidate.revalidated)) {
      result.revalidated = candidate.revalidated.filter(
        (item): item is string => typeof item === "string",
      );
    }
    return result;
  }

  async function refreshContent() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/content-revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug }),
      });
      const payload = await readJsonPayload(response);

      if (!response.ok) {
        throw new Error(payload.message || "刷新失败，请稍后再试。");
      }

      const paths = Array.isArray(payload.revalidated)
        ? payload.revalidated.join("、")
        : "首页、活动列表";
      setMessage(`已刷新：${paths}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "刷新失败，请稍后再试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="surface-card-strong p-5 sm:p-6">
      <p className="card-eyebrow">Publish sync</p>
      <h2 className="mt-4 text-[1.35rem] font-semibold text-white">Notion 发布后刷新前台</h2>
      <p className="mt-3 text-sm leading-7 text-white/60">
        在 Notion 新增或修改活动后，可以刷新首页和活动列表；如果改了某个详情页，再填活动 slug 一起刷新。
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={eventSlug}
          onChange={(event) => setEventSlug(event.target.value)}
          placeholder="可选：ai-builder-night-01"
          className="min-h-[48px] rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#ffd8ae]/45"
        />
        <button
          type="button"
          onClick={() => {
            void refreshContent();
          }}
          disabled={busy}
          className="button-shine inline-flex min-h-[48px] items-center justify-center rounded-lg border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-5 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.22)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "刷新中..." : "刷新前台"}
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-[#ffd09a]">{message}</p>}
    </section>
  );
}

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
          { href: "/records", label: "查看记录前台", secondary: true },
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
            <Link
              href="/records"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/72 transition hover:border-white/18 hover:text-white"
            >
              查看社区记录
            </Link>
          </div>
        </section>

        <ContentRevalidatePanel />
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
