"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, CircleAlert, Database, ExternalLink, Inbox, Loader2, Upload } from "lucide-react";

import type { JoinExperienceMode } from "@/lib/join";

const interestOptions = ["线下交流", "主题共创", "项目展示", "内容分享", "合作咨询"];

type JoinApplicationFormProps = {
  experienceMode: JoinExperienceMode;
  externalFormUrl: string;
};

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

type AvatarUploadState = {
  status: "idle" | "selected" | "uploading" | "success" | "error";
  message: string;
  previewUrl: string;
  uploadedUrl: string;
  fileName: string;
};

const initialAvatarState: AvatarUploadState = {
  status: "idle",
  message: "",
  previewUrl: "",
  uploadedUrl: "",
  fileName: "",
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });

function captureJoinEvent(eventName: string, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const capture = (window as unknown as {
    ignaiAnalyticsCapture?: (eventName: string, properties?: Record<string, unknown>) => void;
  }).ignaiAnalyticsCapture;
  capture?.(eventName, properties);
}

function JoinFallbackPanel({
  externalFormUrl,
  experienceMode,
}: {
  externalFormUrl: string;
  experienceMode: JoinExperienceMode;
}) {
  const primaryHref = externalFormUrl || "/join";
  const primaryLabel = externalFormUrl ? "填写加入表单" : "扫码加入社区";
  const modeCopy =
    experienceMode === "external"
      ? "当前已经配置了外部表单，这里会直接把人送进稳定入口。"
      : "当前还没有可写入的申请后端，所以先使用微信二维码承接真实连接。";

  return (
    <div className="join-surface-card-strong mx-auto p-6 sm:p-8">
      <p className="join-card-eyebrow">Join entry</p>
      <h2 className="join-card-title mt-4 text-[1.7rem] font-semibold leading-[1.22] text-white">
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
            className="join-interest-pill rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62"
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
          data-analytics-event="click_join_community"
          data-analytics-label={externalFormUrl ? "join_external_form" : "join_wechat_primary"}
          data-analytics-prop-placement="join_fallback"
          data-analytics-prop-mode={experienceMode}
          className="inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-6 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5"
        >
          <span>{primaryLabel}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export function JoinApplicationForm({
  experienceMode,
  externalFormUrl,
}: JoinApplicationFormProps) {
  const [interests, setInterests] = useState<string[]>(["线下交流"]);
  const [state, setState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });
  const [avatar, setAvatar] = useState<AvatarUploadState>(initialAvatarState);

  if (experienceMode === "external" || experienceMode === "email") {
    return (
      <JoinFallbackPanel
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

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatar({
        ...initialAvatarState,
        status: "error",
        message: "请选择图片文件。",
      });
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setAvatar({
        ...initialAvatarState,
        status: "error",
        message: "图片太大了，请选择 4MB 以内的图片。",
      });
      return;
    }

    setAvatar({
      status: "selected",
      message: "已选择图片，上传后会自动保存到成员页草稿。",
      previewUrl: URL.createObjectURL(file),
      uploadedUrl: "",
      fileName: file.name,
    });
  };

  const uploadAvatarFile = async (form: HTMLFormElement | null) => {
    const input = form?.elements.namedItem("avatarFile") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file || !form) {
      throw new Error("请先选择一张图片。");
    }

    setAvatar((current) => ({
      ...current,
      status: "uploading",
      message: "正在上传图片...",
    }));

    try {
      const response = await fetch("/api/join/avatar-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataUrl: await fileToDataUrl(file),
          fileName: file.name,
          name: new FormData(form).get("name"),
        }),
      });
      const payload = (await response.json()) as {
        message?: string;
        data?: { url?: string };
      };

      if (!response.ok || !payload.data?.url) {
        throw new Error(payload.message || "头像上传失败。");
      }

      setAvatar((current) => ({
        ...current,
        status: "success",
        message: "图片已上传，会随申请一起保存。",
        uploadedUrl: payload.data?.url || "",
      }));

      return payload.data?.url || "";
    } catch (error) {
      setAvatar((current) => ({
        ...current,
        status: "error",
        message: error instanceof Error ? error.message : "头像上传失败，请稍后再试。",
      }));
      throw error;
    }
  };

  const handleAvatarUpload = async (form: HTMLFormElement | null) => {
    try {
      await uploadAvatarFile(form);
    } catch {
      // The avatar state already contains the user-facing error message.
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const avatarInput = form.elements.namedItem("avatarFile") as HTMLInputElement | null;
    const selectedAvatarFile = avatarInput?.files?.[0];
    let avatarUrl = avatar.uploadedUrl || String(formData.get("avatarUrl") || "");

    setState({ status: "submitting", message: "正在提交..." });
    captureJoinEvent("submit_join_application", {
      mode: experienceMode,
      interestsCount: interests.length,
      hasAvatar: Boolean(selectedAvatarFile || avatarUrl),
    });

    try {
      if (selectedAvatarFile && !avatarUrl) {
        setState({ status: "submitting", message: "正在上传头像..." });
        avatarUrl = await uploadAvatarFile(form);
      }

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
          memberProfile: {
            avatarUrl,
            headline: formData.get("headline"),
            website: formData.get("website"),
            github: formData.get("github"),
            xiaohongshu: formData.get("xiaohongshu"),
          },
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (response.ok) {
        form.reset();
        setInterests(["线下交流"]);
        setAvatar(initialAvatarState);
      }

      captureJoinEvent("join_application_result", {
        mode: experienceMode,
        status: response.ok ? "success" : "error",
        interestsCount: interests.length,
        hasAvatar: Boolean(avatarUrl),
      });

      setState({
        status: response.ok ? "success" : "error",
        message: payload.message || (response.ok ? "提交成功。" : "提交失败。"),
      });
    } catch (error) {
      captureJoinEvent("join_application_result", {
        mode: experienceMode,
        status: "error",
        errorType: error instanceof Error ? error.name : "unknown",
        interestsCount: interests.length,
        hasAvatar: Boolean(avatarUrl),
      });
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "网络异常，请稍后再试或通过微信二维码联系。",
      });
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="join-surface-card-strong mx-auto p-5 sm:p-7"
    >
      <div className="join-info-panel mb-7 flex items-start gap-4 rounded-2xl border border-[#ffb879]/16 bg-[#0d1219]/92 px-4 py-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/22 bg-[#ff9a3c]/10 text-[#ffd09a]">
          <modeNotice.Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{modeNotice.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/58">{modeNotice.body}</p>
        </div>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="join-card-eyebrow">Name</span>
          <input
            name="name"
            required
            placeholder="你的名字"
            className="join-field"
          />
        </label>

        <label className="block">
          <span className="join-card-eyebrow">Contact</span>
          <input
            name="contact"
            required
            placeholder="微信 / Email / Telegram"
            className="join-field"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="join-card-eyebrow">Role</span>
        <input
          name="role"
          required
          placeholder="开发者 / 产品 / 创作者 / 学生 / 创业者..."
          className="join-field"
        />
      </label>

      <div className="my-8 h-px bg-white/10" />

      <div className="join-member-draft rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div>
          <p className="join-card-eyebrow">Member draft</p>
          <h3 className="join-card-title mt-3 text-lg font-medium text-white">顺手留下成员页草稿</h3>
          <p className="mt-2 text-sm leading-7 text-white/58">
            这些都不是必填。你可以先上传一张头像或个人形象照，再留一句话和想展示的外部链接。
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div className="join-avatar-panel rounded-2xl border border-[#ffb879]/14 bg-[#0f1219]/88 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-white/36">
                {avatar.previewUrl || avatar.uploadedUrl ? (
                  <img
                    src={avatar.previewUrl || avatar.uploadedUrl}
                    alt="头像预览"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-7 w-7" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="join-card-eyebrow">头像 / 个人形象照</span>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  上传一张你希望出现在成员页上的图片，JPG、PNG、WebP 均可。
                </p>
                {avatar.fileName ? (
                  <p className="mt-2 truncate text-xs text-white/42">{avatar.fileName}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="join-secondary-button inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-white/72 transition hover:border-white/22 hover:text-white">
                <Upload className="h-4 w-4" />
                <span>选择图片</span>
                <input
                  name="avatarFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="sr-only"
                />
              </label>
              <button
                type="button"
                onClick={(event) => void handleAvatarUpload(event.currentTarget.form)}
                disabled={!avatar.previewUrl || avatar.status === "uploading"}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffd8ae]/34 bg-[#ff9a3c]/14 px-5 py-3 text-sm text-[#ffd09a] transition hover:bg-[#ff9a3c]/20 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {avatar.status === "uploading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{avatar.status === "uploading" ? "上传中" : "上传图片"}</span>
              </button>
            </div>

            <input type="hidden" name="avatarUrl" value={avatar.uploadedUrl} readOnly />

            {avatar.message ? (
              <p
                className={`mt-3 text-sm leading-6 ${
                  avatar.status === "success"
                    ? "text-[#bdf0c8]"
                    : avatar.status === "error"
                      ? "text-[#ffd09a]"
                      : "text-white/48"
                }`}
              >
                {avatar.message}
              </p>
            ) : null}

            <details className="mt-4 text-sm text-white/42">
              <summary className="cursor-pointer text-white/52 transition hover:text-white/72">
                已经有图片链接？
              </summary>
              <input
                name="avatarUrlFallback"
                placeholder="https://..."
                className="join-field mt-3"
                onChange={(event) =>
                  setAvatar((current) => ({
                    ...current,
                    uploadedUrl: event.target.value,
                    status: event.target.value ? "success" : current.status,
                    message: event.target.value ? "已使用你填写的图片链接。" : current.message,
                  }))
                }
              />
            </details>
          </div>

          {avatar.uploadedUrl ? (
            <div className="join-generated-link rounded-2xl border border-[#9aceff]/14 bg-[#0f1720]/88 px-4 py-3 text-xs leading-6 text-white/46 break-all">
              图片链接已生成：{avatar.uploadedUrl}
            </div>
          ) : null}

          <label className="block">
            <span className="join-card-eyebrow">Headline</span>
            <input
              name="headline"
              placeholder="一句你想让成员页先看到的话"
              className="join-field"
            />
          </label>

          <label className="block">
            <span className="join-card-eyebrow">Website</span>
            <input
              name="website"
              placeholder="个人网站 / 项目主页"
              className="join-field"
            />
          </label>

          <label className="block">
            <span className="join-card-eyebrow">GitHub</span>
            <input
              name="github"
              placeholder="github.com/your-name"
              className="join-field"
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="join-card-eyebrow">Xiaohongshu</span>
          <input
            name="xiaohongshu"
            placeholder="小红书主页链接"
            className="join-field"
          />
        </label>
      </div>

      <fieldset className="mt-7">
        <legend className="join-card-eyebrow">Interests</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {interestOptions.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`join-interest-pill rounded-full border px-4 py-2 text-sm transition ${
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

      <label className="mt-7 block">
        <span className="join-card-eyebrow">Signal</span>
        <textarea
          name="message"
          rows={5}
          placeholder="你希望在社区里交流、发起或共同完成什么？"
          className="join-textarea"
        />
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          data-analytics-event="click_join_submit"
          data-analytics-label="join_form_submit"
          data-analytics-prop-mode={experienceMode}
          className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-7 py-3.5 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[132px]"
        >
          {state.status === "submitting"
            ? "提交中"
            : avatar.previewUrl && !avatar.uploadedUrl
              ? "上传头像并提交"
              : "提交申请"}
        </button>
        {state.message ? (
          <p
            aria-live="polite"
            className={`text-sm sm:text-right ${
              state.status === "success" ? "text-[#bdf0c8]" : "text-[#ffd09a]"
            }`}
          >
            {state.message}
          </p>
        ) : (
          <div className="flex max-w-[360px] items-start gap-2 text-sm text-white/42 sm:text-right">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {experienceMode === "database"
                ? "联系方式会写入社区后台，用于后续邀请和沟通。"
                : "当前处于本地收件箱模式，适合联调和流程验收。"}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
