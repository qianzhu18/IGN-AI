import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { CTAButton } from "@/components/ui/CTAButton";
import { DetailSection } from "@/components/ui/DetailSection";
import { recordTypeLabel } from "@/content/records";
import { getAllRecords, getRecordBySlug } from "@/lib/records";

type RecordDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const records = await getAllRecords();
  return records.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({
  params,
}: RecordDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await getRecordBySlug(slug);

  if (!record) {
    return {
      title: "Field Note | IGNAI",
    };
  }

  return {
    title: `${record.title} | IGNAI Field Notes`,
    description: record.excerpt,
  };
}

export default async function RecordDetailPage({ params }: RecordDetailPageProps) {
  const { slug } = await params;
  const record = await getRecordBySlug(slug);

  if (!record) {
    notFound();
  }

  return (
    <PageShell>
      <article className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-[72px]">
            <aside>
              <p className="section-eyebrow">{recordTypeLabel[record.type]}</p>
              <h1 className="section-title mt-6 max-w-[12ch]">{record.title}</h1>
              <p className="section-body mt-6">{record.excerpt}</p>

              <div className="mt-8 border-y border-white/10">
                <div className="flex items-center justify-between gap-6 py-3 text-sm">
                  <span className="text-white/42">时间</span>
                  <span className="font-medium text-white/82">{record.dateText}</span>
                </div>
                {record.location ? (
                  <div className="flex items-center justify-between gap-6 border-t border-white/10 py-3 text-sm">
                    <span className="text-white/42">地点</span>
                    <span className="font-medium text-white/82">{record.location}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {record.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <CTAButton href="/events" variant="secondary">
                  查看下一步活动
                </CTAButton>
              </div>
            </aside>

            <div className="surface-card-strong overflow-hidden">
              <img src={record.cover} alt="" className="aspect-[16/9] w-full object-cover" />
              <div className="p-5 sm:p-8">
                {record.outcomes && record.outcomes.length > 0 ? (
                  <DetailSection title="产出">
                    <div className="flex flex-wrap gap-2">
                      {record.outcomes.map((outcome) => (
                        <span
                          key={outcome}
                          className="rounded-full border border-[#7cc8ff]/12 bg-[#08131e]/80 px-3 py-1.5 text-sm text-[#c7e6ff]"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </DetailSection>
                ) : null}

                {record.content.map((section) => (
                  <DetailSection key={section.heading} title={section.heading}>
                    <p>{section.body}</p>
                  </DetailSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
