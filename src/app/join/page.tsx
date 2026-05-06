import type { Metadata } from "next";

import { JoinContactCard } from "@/components/forms/JoinContactCard";
import { PageShell } from "@/components/layout/PageShell";

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
                加入社区先别做复杂。现在这页优先保证一件事：你能立刻联系到真实的人，而不是先被一大堆字段拦住。
              </p>
              <div className="mt-8 border-y border-white/10">
                {["直接扫码", "先聊再进群", "线下交流", "主题共创"].map((item) => (
                  <div key={item} className="border-t border-white/10 py-4 first:border-t-0">
                    <p className="card-title mt-0 text-[1.1rem]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <JoinContactCard />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
