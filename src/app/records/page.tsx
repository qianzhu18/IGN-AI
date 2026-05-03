import type { Metadata } from "next";

import { RecordCard } from "@/components/cards/RecordCard";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { getAllRecords } from "@/lib/records";

export const metadata: Metadata = {
  title: "Field Notes | IGNAI",
  description: "IGNAI 社区现场记录、活动复盘、项目记录和工具清单。",
};

export default async function RecordsPage() {
  const records = await getAllRecords();

  return (
    <PageShell>
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col gap-10">
            <PageHero
              eyebrow="Field Notes"
              title="Community records."
              description="这里记录 IGNAI 的线下活动、主题共创、成员项目和社区产出，让社区真实发生过的事情被继续阅读。"
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {records.map((record, index) => (
                <RecordCard key={record.slug} record={record} featured={index === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
