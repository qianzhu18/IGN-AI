import { EventListCard, PublicationFeedCard } from "@/components/ui/ContentCard";
import type { CommunityContentItem, ContentType } from "@/content/platform";

type ContentCollectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: CommunityContentItem[];
  types: ContentType[];
  emptyText: string;
};

export function ContentCollectionPage({
  eyebrow,
  title,
  description,
  items,
  types,
  emptyText,
}: ContentCollectionPageProps) {
  const filteredItems = items.filter((item) => types.includes(item.type));
  const isEventPage = types.length === 1 && types[0] === "event";

  return (
    <section className="relative z-10">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-[72px]">
          <div>
            <p className="section-eyebrow">{eyebrow}</p>
            <h1 className="display-title mt-6 max-w-[12ch]">{title}</h1>
            <p className="section-body mt-6">{description}</p>
          </div>

          <div className={isEventPage ? "surface-card-strong p-5 sm:p-6 lg:p-8" : "space-y-6"}>
            {filteredItems.length > 0 ? (
              isEventPage ? (
                <div>
                  {filteredItems.map((item) => (
                    <EventListCard key={`${item.type}-${item.title}`} item={item} />
                  ))}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <PublicationFeedCard key={`${item.type}-${item.title}`} item={item} />
                ))
              )
            ) : (
              <div className="info-card">
                <p className="card-eyebrow">Coming Soon</p>
                <h2 className="card-title">内容正在准备中</h2>
                <p className="card-body">{emptyText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
