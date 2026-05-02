import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { CTAButton } from "@/components/ui/CTAButton";
import { DetailSection } from "@/components/ui/DetailSection";
import { eventFormatLabel, eventStatusLabel } from "@/content/events";
import { getAllEvents, getEventBySlug } from "@/lib/events";

type EventDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event | IGNAI",
    };
  }

  return {
    title: `${event.title} | IGNAI Events`,
    description: event.excerpt,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <PageShell>
      <article className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-[72px]">
            <aside>
              <p className="section-eyebrow">Event</p>
              <h1 className="section-title mt-6 max-w-[12ch]">{event.title}</h1>
              {event.subtitle ? (
                <p className="section-lead mt-5 max-w-[18ch]">{event.subtitle}</p>
              ) : null}
              <p className="section-body mt-6">{event.excerpt}</p>

              <div className="mt-8 grid gap-3">
                {[
                  ["状态", eventStatusLabel[event.status]],
                  ["时间", event.dateText],
                  ["地点", event.location],
                  ["形式", eventFormatLabel[event.format]],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
                  >
                    <span className="text-white/42">{label}</span>
                    <span className="font-medium text-white/82">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:flex-col">
                <CTAButton href={event.registrationUrl || "/join"}>立即报名</CTAButton>
                <CTAButton href="/join" variant="secondary">
                  加入社区了解更多
                </CTAButton>
              </div>
            </aside>

            <div className="surface-card-strong overflow-hidden">
              <img src={event.cover} alt="" className="aspect-[16/9] w-full object-cover" />
              <div className="p-5 sm:p-8">
                {event.content.map((section) => (
                  <DetailSection key={section.heading} title={section.heading}>
                    <p>{section.body}</p>
                  </DetailSection>
                ))}

                <DetailSection title="适合谁参加">
                  <ul className="grid gap-3 md:grid-cols-2">
                    {event.audience.map((item) => (
                      <li key={item} className="rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </DetailSection>

                <DetailSection title="活动流程">
                  <ol className="space-y-3">
                    {event.agenda.map((item) => (
                      <li key={item} className="rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
                        {item}
                      </li>
                    ))}
                  </ol>
                </DetailSection>

                <DetailSection title="主理人 / 说明">
                  <div className="space-y-3">
                    <p>主理人：{event.hosts.join("、")}</p>
                    {event.notes.map((note) => (
                      <p key={note}>{note}</p>
                    ))}
                  </div>
                </DetailSection>
              </div>
            </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
