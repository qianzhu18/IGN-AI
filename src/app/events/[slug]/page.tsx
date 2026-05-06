import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

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

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

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
  const event = await getEventBySlug(slug);

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

              <div className="mt-8 border-y border-white/10">
                {[
                  ["状态", eventStatusLabel[event.status]],
                  ["时间", event.dateText],
                  ["地点", event.location],
                  ["形式", eventFormatLabel[event.format]],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-6 border-t border-white/10 py-3 text-sm first:border-t-0"
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

              {event.registrationQrImage ? (
                <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="card-eyebrow">报名二维码</p>
                  <div className="mt-4 overflow-hidden rounded-[18px] border border-white/10 bg-white p-3">
                    <Image
                      src={event.registrationQrImage}
                      alt={`${event.title} 报名二维码`}
                      width={720}
                      height={720}
                      className="h-auto w-full rounded-[14px]"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/56">
                    适合活动主办方直接挂飞书多维表格或外部报名二维码，桌面和移动端都可以直接扫码。
                  </p>
                </div>
              ) : null}
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
                  <ul className="grid border-y border-white/10 md:grid-cols-2">
                    {event.audience.map((item) => (
                      <li key={item} className="border-t border-white/10 py-3 text-sm first:border-t-0 md:px-4 md:[&:nth-child(-n+2)]:border-t-0 md:[&:nth-child(odd)]:pl-0 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:border-white/10">
                        {item}
                      </li>
                    ))}
                  </ul>
                </DetailSection>

                <DetailSection title="活动流程">
                  <ol className="border-y border-white/10">
                    {event.agenda.map((item) => (
                      <li key={item} className="border-t border-white/10 py-3 text-sm first:border-t-0">
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
