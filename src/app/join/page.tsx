import type { Metadata } from "next";

import { JoinApplicationForm } from "@/components/forms/JoinApplicationForm";
import { PageShell } from "@/components/layout/PageShell";
import { siteLinks } from "@/content/links";
import { isSupabaseServerConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Join | IGNAI",
  description: "申请加入 IGNAI 社区。",
};

export default function JoinPage() {
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
                配好后写入申请记录。上线优先保证加入入口真实可用。
              </p>
              <div className="mt-8 grid gap-4">
                {["线下交流", "主题共创", "项目展示", "内容分享"].map((item) => (
                  <div key={item} className="info-card min-h-0 p-5">
                    <p className="card-title mt-0 text-[1.1rem]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <JoinApplicationForm
              backendEnabled={isSupabaseServerConfigured}
              contactEmailHref={siteLinks.contactEmailHref}
              externalFormUrl={siteLinks.joinFormUrl}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
