"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Database, ExternalLink, Inbox, Mail } from "lucide-react";

import type { JoinExperienceMode } from "@/lib/join";

const interestOptions = ["线下交流", "主题共创", "项目展示", "内容分享", "合作咨询"];

type JoinApplicationFormProps = {
  experienceMode: JoinExperienceMode;
  contactEmailHref: string;
  externalFormUrl?: string;
};

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const joinEmailHref = (contactEmailHref: string) => {
  const subject = encodeURIComponent("申请加入 IGNAI 社区");
  return contactEmailHref.includes("?")
    ? `${contactEmailHref}&subject=${subject}`
    : `${contactEmailHref}?subject=${subject}`;
};

function JoinFallbackPanel({
  contactEmailHref,
  externalFormUrl,
  experienceMode,
}: {
  contactEmailHref: string;
  externalFormUrl?: string;
  experienceMode: JoinExperienceMode;
}) {
  const primaryHref = externalFormUrl || joinEmailHref(contactEmailHref);
  const primaryLabel = externalFormUrl ? "填写加入表单" : "通过 Email 联系";
  const PrimaryIcon = externalFormUrl ? ExternalLink : Mail;
  const modeCopy =
    experienceMode === "external"
      ? "当前已经配置了外部表单，这里会直接把人送进稳定入口。"
      : "当前还没有可写入的申请后端，所以先保留 Email 作为最轻量的兜底入口。";

  return (
    <div className="surface-card-strong p-5 sm:p-6">
      <p className="card-eyebrow">Join entry</p>
      <h2 className="mt-4 text-[1.7rem] font-semibold leading-[1.22] text-white">
        先用一个稳定入口，
        <br />
        接住真实想加入的人。
      </h2>
      <p className="mt-4 text-sm leading-7 text-white/58">
        {modeCopy}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {interestOptions.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62"
          >
            {interest}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href={primaryHref}
          target={externalFormUrl ? "_blank" : undefined}
          rel={externalFormUrl ? "noreferrer" : undefined}
          className="button-shine inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-6 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5"
        >
          <span>{primaryLabel}</span>
          <PrimaryIcon className="h-4 w-4" />
        </a>
        {externalFormUrl ? (
          <a
            href={joinEmailHref(contactEmailHref)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/70 transition hover:border-white/18 hover:text-white"
          >
            <span>Email 备用联系</span>
            <Mail className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function JoinApplicationForm({
  experienceMode,
  contactEmailHref,
  externalFormUrl,
}: JoinApplicationFormProps) {
  const [interests, setInterests] = useState<string[]>(["线下交流"]);
  const [state, setState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });

  if (experienceMode === "external" || experienceMode === "email") {
    return (
      <JoinFallbackPanel
        contactEmailHref={contactEmailHref}
        externalFormUrl={externalFormUrl}
        experienceMode={experienceMode}
      />
    );
  }

  const modeNotice = {
    database: {
      title: "申请会直接进入社区后台",
      body: "适合真实收集加入意向，后续可以继续接状态流转和成员管理。",
      Icon: Database,
    },
    local: {
      title: "当前提交会先保存到本地收件箱",
      body: "这能让联调阶段也保留完整表单体验，数据会写入本地 inbox，方便你继续验证流程。",
      Icon: Inbox,
    },
  }[experienceMode];

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "submitting", message: "正在提交..." });

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          contact: formData.get("contact"),
          role: formData.get("role"),
          message: formData.get("message"),
          interests,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (response.ok) {
        form.reset();
        setInterests(["线下交流"]);
      }

      setState({
        status: response.ok ? "success" : "error",
        message: payload.message || (response.ok ? "提交成功。" : "提交失败。"),
      });
    } catch {
      setState({
        status: "error",
        message: "网络异常，请稍后再试或通过 Email 联系。",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card-strong p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-4 rounded-[22px] border border-[#ffb879]/16 bg-[#0d1219]/92 px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
          <modeNotice.Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{modeNotice.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/58">{modeNotice.body}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="card-eyebrow">Name</span>
          <input
            name="name"
            required
            placeholder="你的名字"
            className="mt-3 w-full rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-[#ffb879]/36"
          />
        </label>

        <label className="block">
          <span className="card-eyebrow">Contact</span>
          <input
            name="contact"
            required
            placeholder="微信 / Email / Telegram"
            className="mt-3 w-full rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-[#ffb879]/36"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="card-eyebrow">Role</span>
        <input
          name="role"
          required
          placeholder="开发者 / 产品 / 创作者 / 学生 / 创业者..."
          className="mt-3 w-full rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-[#ffb879]/36"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="card-eyebrow">Interests</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {interestOptions.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selected
                    ? "border-[#ffb879]/36 bg-[#ff9a3c]/16 text-[#ffd09a]"
                    : "border-white/10 bg-white/[0.04] text-white/58 hover:text-white"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="card-eyebrow">Signal</span>
        <textarea
          name="message"
          rows={5}
          placeholder="你希望在社区里交流、发起或共同完成什么？"
          className="mt-3 w-full resize-none rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/32 focus:border-[#ffb879]/36"
        />
      </label>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="button-shine relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-6 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.status === "submitting" ? "提交中" : "提交申请"}
        </button>
        {state.message ? (
          <p
            aria-live="polite"
            className={`text-sm ${
              state.status === "success" ? "text-[#bdf0c8]" : "text-[#ffd09a]"
            }`}
          >
            {state.message}
          </p>
        ) : (
          <div className="flex items-start gap-2 text-sm text-white/42">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {experienceMode === "database"
                ? "联系方式会写入社区后台，用于后续邀请和沟通。"
                : "当前处于本地收件箱模式，适合联调和流程验收；切到 Supabase 后会进入正式申请池。"}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
