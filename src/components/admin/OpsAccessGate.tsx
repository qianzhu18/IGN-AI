"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, LockKeyhole, ShieldAlert } from "lucide-react";

type OpsAccessGateProps = {
  mode: "login" | "setup";
  surface?: "ops" | "admin";
};

export function OpsAccessGate({ mode, surface = "ops" }: OpsAccessGateProps) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  const copy =
    surface === "admin"
      ? {
          eyebrow: "Admin access",
          setupTitle: "先配置社区后台访问密码。",
          loginTitle: "请输入社区后台访问密码。",
          setupBody:
            "当前后台必须只对管理员开放。请先在环境变量中设置 OPS_ACCESS_PASSWORD，再继续访问管理后台和内容编辑入口。",
          loginBody:
            "这层密码门用于保护社区后台、内容编辑入口和运营数据。普通成员默认只保留预览能力。",
          placeholder: "社区后台访问密码",
          button: "进入社区后台",
          setupHint: "本地联调也建议使用独立开发密码，避免后台入口在未授权状态下直接暴露。",
        }
      : {
          eyebrow: "Ops access",
          setupTitle: "先配置运营访问密码。",
          loginTitle: "请输入运营访问密码。",
          setupBody:
            "上线前请在环境变量中设置 OPS_ACCESS_PASSWORD。未配置前，运营后台和提交记录接口不应直接暴露。",
          loginBody:
            "这层保护先覆盖最小运营后台和申请状态接口，适合 MVP 阶段先把敏感数据挡住。",
          placeholder: "运营访问密码",
          button: "进入后台",
          setupHint: "本地联调时可以临时设置一个开发密码，线上环境必须使用独立安全密码。",
        };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setStatus("error");
      setMessage("请输入运营访问密码。");
      return;
    }

    setStatus("submitting");
    setMessage("正在验证...");

    const response = await fetch("/api/ops/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.message || "验证失败，请重试。");
      return;
    }

    window.location.reload();
  };

  return (
    <div className="surface-card-strong mx-auto w-full max-w-[520px] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
          {mode === "setup" ? (
            <ShieldAlert className="h-5 w-5" />
          ) : (
            <LockKeyhole className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="card-eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-3 text-[1.4rem] font-semibold leading-[1.3] text-white">
            {mode === "setup" ? copy.setupTitle : copy.loginTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/60">
            {mode === "setup" ? copy.setupBody : copy.loginBody}
          </p>
        </div>
      </div>

      {mode === "login" ? (
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="mt-7 space-y-4"
        >
          <label className="block">
            <span className="card-eyebrow">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.placeholder}
              className="mt-3 w-full rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-[#ffb879]/36"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="button-shine inline-flex items-center justify-center overflow-hidden rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-6 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "验证中" : copy.button}
            </button>

            {message ? (
              <p className={`text-sm ${status === "error" ? "text-[#ffd09a]" : "text-white/60"}`}>
                {message}
              </p>
            ) : null}
          </div>
        </form>
      ) : (
        <div className="mt-7 flex items-start gap-2 text-sm text-white/48">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{copy.setupHint}</p>
        </div>
      )}
    </div>
  );
}
