import Image from "next/image";
import Link from "next/link";

type BrandLockupProps = {
  compact?: boolean;
};

export function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <Link
      href="/"
      aria-label="返回首页"
      className="inline-flex items-center transition hover:-translate-y-0.5"
    >
      <Image
        src="/brand/ignai-logo-transparent.png"
        alt="IGNAI logo"
        width={compact ? 104 : 116}
        height={compact ? 32 : 36}
        priority
        className={
          compact
            ? "h-8 w-[104px] object-contain object-left"
            : "h-9 w-[116px] object-contain object-left"
        }
      />
    </Link>
  );
}
