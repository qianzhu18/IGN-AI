"use client";

import { useState, type FormEvent } from "react";
import { ExternalLink, Mail } from "lucide-react";

const interestOptions = ["线下交流", "主题共创", "项目展示", "内容分享", "合作咨询"];

type JoinApplicationFormProps = {
  backendEnabled: boolean;
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
}: {
  contactEmailHref: string;
  externalFormUrl?: string;
}) {
  const primaryHref = externalFormUrl || joinEmailHref(contactEmailHref);
  const primaryLabel = externalFormUrl ? "填写加入表单" : "通过 Email 联系";
  const PrimaryIcon = externalFormUrl ? ExternalLink : Mail;

  return (
    <div className="surface-card-strong p-5 sm:p-6">
      <p className="card-eyebrow">Join entry</p>
      <h2 className="mt-4 text-[1.7rem] font-semibold leading-[1.22] text-white">
        先用一个稳定入口，
        <br />
        接住真实想加入的人。
      </h2>
      <p className="mt-4 text-sm leading-7 text-white/58">
        V1 不强依赖后台数据库。配置外部表单后，这里会直接跳转到报名 / 申请入口；
        没配置时，先用 Email 作为兜底联系方式。
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
  backendEnabled,
  contactEmailHref,
  externalFormUrl,
}: JoinApplicationFormProps) {
  const [interests, setInterests] = useState<string[]>(["线下交流"]);
  const [state, setState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });

  if (externalFormUrl || !backendEnabled) {
    return (
      <JoinFallbackPanel
        contactEmailHref={contactEmailHref}
        externalFormUrl={externalFormUrl}
      />
    );
  }

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

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
      setState({
        status: response.ok ? "success" : "error",
        message: payload.message || (response.ok ? "提交成功。" : "提交失败。"),
      });

      if (response.ok) {
        event.currentTarget.reset();
        setInterests(["线下交流"]);
      }
    } catch {
      setState({
        status: "error",
        message: "网络异常，请稍后再试或通过 Email 联系。",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card-strong p-5 sm:p-6">
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
            className={`text-sm ${
              state.status === "success" ? "text-[#bdf0c8]" : "text-[#ffd09a]"
            }`}
          >
            {state.message}
          </p>
        ) : (
          <p className="text-sm text-white/42">
            联系方式会写入社区后台，用于后续邀请和沟通。
          </p>
        )}
      </div>
    </form>
  );
}
