import Link from "next/link";

import { Reveal } from "@/src/components/motion/Reveal";
import { CompactContentRow, EventListCard } from "@/src/components/ui/ContentCard";
import { CTAButton } from "@/src/components/ui/CTAButton";
import { platformContent } from "@/src/content/platform";
import { getCommunityContentItems } from "@/lib/sanity";

export async function ShowcaseSection() {
  const items = await getCommunityContentItems();
  const events = items.filter((item) => item.type === "event").slice(0, 3);
  const publications = items.filter((item) => item.type !== "event").slice(0, 3);

  return (
    <section id="showcase" className="relative z-10 border-t border-white/8">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 lg:py-[120px]">
        <div className="section-grid-start">
          <div className="section-copy">
            <Reveal>
              <p className="section-eyebrow">{platformContent.showcase.eyebrow}</p>
              <h2 className="section-title mt-6 max-w-[13ch]">
                近期联动活动，
                <br />
                和社区记录。
              </h2>
              <p className="section-body mt-6">
                {platformContent.showcase.description}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <CTAButton href="/blog">浏览内容</CTAButton>
                <CTAButton href="/events" variant="secondary">
                  查看活动
                </CTAButton>
              </div>
            </Reveal>
          </div>

          <div className="space-y-5">
            <Reveal>
              <div className="surface-card-strong p-5 sm:p-6 lg:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="section-eyebrow">Upcoming Activities</p>
                    <h3 className="mt-4 text-[1.75rem] font-semibold leading-[1.22] text-white">
                      近期联动活动 / 活动聚会
                    </h3>
                  </div>
                  <Link href="/events" className="hidden text-sm text-white/56 transition hover:text-white sm:block">
                    查看全部
                  </Link>
                </div>

                <div className="mt-8">
                  {events.map((item) => (
                    <EventListCard key={`${item.type}-${item.title}`} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="surface-card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="section-eyebrow">Selected Writing</p>
                    <h3 className="mt-3 text-[1.35rem] font-semibold text-white">
                      最新实践记录与文章
                    </h3>
                  </div>
                  <Link href="/blog" className="text-sm text-white/56 transition hover:text-white">
                    阅读更多
                  </Link>
                </div>
                <div className="mt-6">
                  {publications.map((item) => (
                    <CompactContentRow key={`${item.type}-${item.title}`} item={item} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
