import { PageShell } from "@/components/layout/PageShell";
import { CTAButton } from "@/components/ui/CTAButton";

export default function NotFound() {
  return (
    <PageShell>
      <section className="relative z-10">
        <div className="mx-auto flex min-h-[68vh] w-full max-w-[900px] flex-col justify-center px-5 py-20 sm:px-8">
          <p className="section-eyebrow">404</p>
          <h1 className="section-title mt-6 max-w-[12ch]">Signal not found.</h1>
          <p className="section-body mt-6 max-w-[560px]">
            这个页面还没有被点亮。你可以回到近期活动，或者直接进入社区加入入口。
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <CTAButton href="/events">查看近期活动</CTAButton>
            <CTAButton href="/join" variant="secondary">
              加入社区
            </CTAButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
