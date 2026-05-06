import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { CTAButton } from "@/components/ui/CTAButton";
import { DetailSection } from "@/components/ui/DetailSection";
import { getCommunityContentItemBySlug, getCommunityContentItems } from "@/lib/sanity";

type StoryDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const items = await getCommunityContentItems();
  return items
    .filter((item) => item.type === "story")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCommunityContentItemBySlug(slug);

  if (!item || item.type !== "story") {
    return {
      title: "Stories | IGNAI",
    };
  }

  return {
    title: `${item.title} | IGNAI Stories`,
    description: item.description,
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params;
  const item = await getCommunityContentItemBySlug(slug);

  if (!item || item.type !== "story") {
    notFound();
  }

  const sections =
    item.content && item.content.length > 0
      ? item.content
      : [{ heading: "故事摘要", body: item.description }];

  return (
    <PageShell>
      <article className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-[72px]">
            <aside>
              <p className="section-eyebrow">{item.eyebrow}</p>
              <h1 className="section-title mt-6 max-w-[12ch]">{item.title}</h1>
              <p className="section-body mt-6">{item.description}</p>

              <div className="mt-8 border-y border-white/10">
                <div className="flex items-center justify-between gap-6 py-3 text-sm">
                  <span className="text-white/42">发布时间</span>
                  <span className="font-medium text-white/82">{item.date}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:flex-col">
                <CTAButton href="/join">带着你的项目加入社区</CTAButton>
                <CTAButton href="/stories" variant="secondary">
                  返回故事列表
                </CTAButton>
              </div>
            </aside>

            <div className="surface-card-strong overflow-hidden">
              {item.coverImage ? (
                <img src={item.coverImage} alt="" className="aspect-[16/9] w-full object-cover" />
              ) : null}
              <div className="p-5 sm:p-8">
                {sections.map((section) => (
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
