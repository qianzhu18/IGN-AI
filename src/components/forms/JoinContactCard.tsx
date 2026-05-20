import Image from "next/image";
import { MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react";

import { siteLinks } from "@/src/content/links";

const quickSteps = [
  "扫码添加社区管理者",
  "简单介绍你是谁、在做什么",
  "拉你进后续合适的社区连接里",
];

export function JoinContactCard() {
  return (
    <section className="join-surface-card-strong overflow-hidden p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="join-card-eyebrow">Direct contact</p>
          <h2 className="mt-4 text-[1.6rem] font-semibold leading-[1.22] text-white">
            直接加社区管理者，
            <br />
            不用先填一堆表。
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            这版先把最短路径跑通。你只需要扫码，加上微信，简单说下自己是谁、想聊什么、最近在做什么就够了。
          </p>
        </div>
        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a] sm:flex">
          <MessageCircleMore className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.02)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-5">
          <div className="relative overflow-hidden rounded-[22px] border border-[#7cc8ff]/10 bg-[#f7f7f4] p-3 shadow-[0_22px_56px_rgba(0,0,0,0.24)] sm:p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,161,75,0.08),transparent_26%),radial-gradient(circle_at_82%_24%,rgba(98,180,255,0.08),transparent_24%)]" />
            <Image
              src="/contact/qianzhu-wechat-qr.jpg"
              alt="扫码添加千逐微信，联系 IGNAI 社区管理者"
              width={950}
              height={1295}
              priority
              className="relative z-10 h-auto w-full rounded-[18px]"
            />
          </div>
        </div>

        <div>
          <div className="rounded-[24px] border border-[#ffb879]/16 bg-[#0d1219]/90 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">当前最轻的加入方式</p>
                <p className="mt-1 text-sm leading-6 text-white/58">
                  先把真实连接接住，再决定是否要进群、参加线下活动、做项目协作或继续深聊。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 border-y border-white/10">
            {quickSteps.map((item) => (
              <div key={item} className="border-t border-white/10 py-4 first:border-t-0">
                <p className="text-[1.02rem] text-white/82">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#9aceff]" />
              <p className="text-sm leading-7 text-white/58">
                如果你当前正在手机上浏览本站，建议截图后用微信扫一扫识别；如果你在电脑上浏览，直接打开微信扫码即可。
              </p>
            </div>
            <a
              href={siteLinks.contactEmailHref}
              className="mt-4 inline-flex items-center text-sm text-[#ffd09a] transition hover:text-white"
            >
              备用联系邮箱：{siteLinks.contactEmail}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
