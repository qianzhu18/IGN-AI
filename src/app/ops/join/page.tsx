import type { Metadata } from "next";

import { JoinSubmissionsPanel } from "@/components/admin/JoinSubmissionsPanel";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { listJoinApplications } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Join Ops | IGNAI",
  description: "IGNAI 加入申请的内部查看与状态流转面板。",
};

export default async function JoinOpsPage() {
  const result = await listJoinApplications(50);

  return (
    <PageShell>
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col gap-10">
            <PageHero
              eyebrow="Join Ops"
              title="Community inbox."
              description="先把最小运营动作跑顺：查看申请、改状态、继续跟进。"
            />

            <JoinSubmissionsPanel initialItems={result.data} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
