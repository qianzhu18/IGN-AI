import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { PageShell } from "@/src/components/layout/PageShell";

export type AdminNavItem = {
  href: string;
  label: string;
  note: string;
  state: string;
};

type AdminShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  navItems: AdminNavItem[];
  currentHref?: string;
  actions?: Array<{ href: string; label: string; secondary?: boolean }>;
  children: ReactNode;
  rail?: ReactNode;
};

export function AdminShell({
  eyebrow,
  title,
  description,
  navItems,
  currentHref,
  actions = [],
  children,
  rail,
}: AdminShellProps) {
  return (
    <PageShell>
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-8 lg:h-fit">
              <div className="surface-card-strong p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="card-eyebrow">Admin platform</p>
                    <h1 className="mt-3 text-[1.35rem] font-semibold leading-[1.3] text-white">
                      {title}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-white/58">{description}</p>
                  </div>
                </div>

                {actions.length > 0 ? (
                  <div className="mt-6 flex flex-col gap-3">
                    {actions.map((action) => (
                      <Link
                        key={action.href}
                        href={action.href}
                        className={
                          action.secondary
                            ? "inline-flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/74 transition hover:border-white/18 hover:text-white"
                            : "button-shine relative inline-flex items-center justify-between overflow-hidden rounded-lg border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-4 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5"
                        }
                      >
                        <span>{action.label}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                ) : null}

                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="card-eyebrow">后台导航</p>
                  <nav className="mt-4 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-lg px-3 py-3 transition hover:bg-white/[0.04] ${
                          currentHref === item.href
                            ? "border border-[#ffb879]/22 bg-[#ff9a3c]/10"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-white">{item.label}</span>
                          <span className="text-[0.7rem] uppercase text-[#f0cb8a]">
                            {item.state}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-white/48">{item.note}</p>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            <div className="space-y-8">
              <div className="border-b border-white/10 pb-8">
                <p className="section-eyebrow">{eyebrow}</p>
                <h2 className="mt-4 text-[2.7rem] font-semibold leading-[1.02] text-white sm:text-[3.4rem]">
                  {title}
                </h2>
                <p className="mt-4 max-w-[760px] text-base leading-8 text-white/62 sm:text-lg">
                  {description}
                </p>
              </div>

              {children}

              {rail ? (
                <section className="border-t border-white/10 pt-8">{rail}</section>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
