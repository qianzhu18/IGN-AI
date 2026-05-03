import type { Metadata } from "next";
import { Database, ExternalLink, Inbox, Mail } from "lucide-react";

import { JoinApplicationForm } from "@/components/forms/JoinApplicationForm";
import { PageShell } from "@/components/layout/PageShell";
import { siteLinks } from "@/content/links";
import { getJoinExperienceMode } from "@/lib/join";

export const metadata: Metadata = {
  title: "Join | IGNAI",
  description: "申请加入 IGNAI 社区。",
};

export default function JoinPage() {
  const experienceMode = getJoinExperienceMode(siteLinks.joinFormConfigured);
  const modeCard = {
    database: {
      eyebrow: "Mode / Community inbox",
      title: "站内申请已接到社区后台。",
      description: "提交后会直接进入社区申请池，便于后续筛选、邀请和跟进。",
      Icon: Database,
    },
    local: {
      eyebrow: "Mode / Local inbox",
      title: "当前先用本地收件箱接住真实意向。",
      description:
        "提交后会保存到本地 inbox，适合现在这轮联调、验收和流程打磨，不会再只剩一个 Email 兜底。",
      Icon: Inbox,
    },
    external: {
      eyebrow: "Mode / External form",
      title: "当前入口会跳转到外部表单。",
      description: "适合先保证报名可用，后续再把数据回收和状态流转接回站内。",
      Icon: ExternalLink,
    },
    email: {
      eyebrow: "Mode / Email fallback",
      title: "当前还没有可写入的申请后端。",
      description: "页面仍保留联系入口，但下一步应优先接通可提交、可追踪的申请链路。",
      Icon: Mail,
    },
  }[experienceMode];

  return (
    <PageShell>
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-[72px] lg:items-start">
            <div>
              <p className="section-eyebrow">Join IGNAI</p>
              <h1 className="display-title mt-6 max-w-[12ch]">
                Bring your signal.
              </h1>
              <p className="section-body mt-6">
                V1 先保持轻量：可以接飞书 / 问卷星 / Notion 表单，也可以在 Supabase
                配好后写入申请记录。现在这页应该先做到两件事：入口真实可用，提交状态真实可感知。
              </p>
              <div className="surface-card mt-8 p-5 sm:p-6">
                <p className="card-eyebrow">{modeCard.eyebrow}</p>
                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/12 text-[#ffd09a]">
                    <modeCard.Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-[1.18rem] font-semibold leading-[1.35] text-white">
                      {modeCard.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-white/62">
                      {modeCard.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-y border-white/10">
                {["线下交流", "主题共创", "项目展示", "内容分享"].map((item) => (
                  <div key={item} className="border-t border-white/10 py-4 first:border-t-0">
                    <p className="card-title mt-0 text-[1.1rem]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <JoinApplicationForm
              experienceMode={experienceMode}
              contactEmailHref={siteLinks.contactEmailHref}
              externalFormUrl={siteLinks.joinFormUrl}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
