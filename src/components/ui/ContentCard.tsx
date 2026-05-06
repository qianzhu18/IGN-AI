import Link from "next/link";

import type { CommunityContentItem } from "@/content/platform";

type ContentCardProps = {
  item: CommunityContentItem;
};

export function EventListCard({ item }: ContentCardProps) {
  return (
    <Link
      href={item.href}
      className="group grid gap-5 border-t border-white/10 py-6 transition first:border-t-0 first:pt-0 hover:border-[#ffb879]/28 md:grid-cols-[9rem_1fr_auto] md:items-start"
    >
      <div>
        <p className="text-[0.72rem] font-medium uppercase text-[#F0CB8A]/78">
          {item.eyebrow}
        </p>
        <p className="mt-2 text-lg font-semibold leading-tight text-white">
          {item.date}
        </p>
        {item.location ? (
          <p className="mt-2 text-sm text-white/48">{item.location}</p>
        ) : null}
      </div>

      <div>
        <h3 className="text-[1.45rem] font-semibold leading-[1.26] text-white transition group-hover:text-[#ffd09a]">
          {item.title}
        </h3>
        <p className="mt-3 max-w-[36rem] text-sm leading-7 text-white/62">
          {item.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <span className="w-fit rounded-full border border-[#ffb879]/16 bg-[#0d1118]/88 px-4 py-2 text-sm text-white/68 transition group-hover:border-[#ffb879]/32 group-hover:text-white">
        {item.actionLabel || "查看详情"}
      </span>
    </Link>
  );
}

export function PublicationFeedCard({ item }: ContentCardProps) {
  return (
    <Link
      href={item.href}
      className="group block overflow-hidden rounded-lg border border-white/10 bg-[#080d14]/68 transition duration-300 hover:-translate-y-1 hover:border-[#ffb879]/24 hover:bg-[#0a1018]/78"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">IGNAI</p>
            <p className="mt-1 text-xs text-white/42">{item.date}</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58">
            {item.eyebrow}
          </span>
        </div>

        <h3 className="mt-6 text-[1.6rem] font-semibold leading-[1.28] text-white transition group-hover:text-[#ffd09a]">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/58">{item.description}</p>
      </div>

      {item.coverImage ? (
        <div className="px-5 sm:px-6">
          <img
            src={item.coverImage}
            alt=""
            className="aspect-[2.15] w-full rounded-lg border border-white/8 object-cover"
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/8 px-5 py-4 sm:px-6">
        <span className="rounded-full border border-[#7cc8ff]/12 bg-[#08131e]/80 px-3 py-1.5 text-xs text-[#c7e6ff]">
          {item.actionLabel || "阅读更多"}
        </span>
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function CompactContentRow({ item }: ContentCardProps) {
  return (
    <Link
      href={item.href}
      className="group grid gap-4 border-t border-white/10 py-5 first:border-t-0 first:pt-0 sm:grid-cols-[8.5rem_1fr] sm:items-center"
    >
      {item.coverImage ? (
        <img
          src={item.coverImage}
          alt=""
          className="aspect-[1.55] w-full rounded-[16px] border border-white/8 object-cover"
        />
      ) : (
        <div className="aspect-[1.55] rounded-lg border border-white/8 bg-white/[0.04]" />
      )}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.72rem] font-medium uppercase text-[#F0CB8A]/78">
            {item.eyebrow}
          </p>
          <p className="text-xs text-white/42">{item.date}</p>
        </div>
        <h3 className="mt-2 text-[1.15rem] font-semibold leading-[1.35] text-white transition group-hover:text-[#ffd09a]">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/56">
          {item.description}
        </p>
      </div>
    </Link>
  );
}
