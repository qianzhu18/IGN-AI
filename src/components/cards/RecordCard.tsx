import Link from "next/link";

import { recordTypeLabel, type RecordItem } from "@/content/records";

type RecordCardProps = {
  record: RecordItem;
  featured?: boolean;
};

export function RecordCard({ record, featured = false }: RecordCardProps) {
  return (
    <Link
      href={`/records/${record.slug}`}
      className={`group block overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0f16]/86 shadow-[0_24px_70px_rgba(0,0,0,0.34)] transition duration-300 hover:-translate-y-1 hover:border-[#7cc8ff]/24 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">IGNAI Field Notes</p>
            <p className="mt-1 text-xs text-white/42">
              {record.dateText}
              {record.location ? ` · ${record.location}` : ""}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/58">
            {recordTypeLabel[record.type]}
          </span>
        </div>

        <h3 className="mt-6 text-[1.55rem] font-semibold leading-[1.28] text-white transition group-hover:text-[#d4ecff]">
          {record.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-white/58">
          {record.excerpt}
        </p>
      </div>

      <div className="px-5 sm:px-6">
        <img
          src={record.cover}
          alt=""
          className="aspect-[2.05] w-full rounded-[18px] border border-white/8 object-cover"
        />
      </div>

      <div className="mt-5 border-t border-white/8 px-5 py-4 sm:px-6">
        {record.outcomes && record.outcomes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {record.outcomes.map((outcome) => (
              <span
                key={outcome}
                className="rounded-full border border-[#7cc8ff]/12 bg-[#08131e]/80 px-3 py-1.5 text-xs text-[#c7e6ff]"
              >
                {outcome}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {record.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/58"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
