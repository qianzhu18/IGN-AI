import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  RefreshCw,
  Save,
  Search,
  UploadCloud,
} from "lucide-react";

export type MemberProfileAdminMember = {
  id: string;
  title?: string;
  slug?: string;
  avatar?: string;
  role?: string;
  bio?: string;
  summary?: string;
  quote?: string;
  website?: string;
  social_github?: string;
  social_x?: string;
  social_linkedin?: string;
  featured?: boolean | string;
  verified?: boolean | string;
  status?: string;
  pageIcon?: string;
  pageCoverThumbnail?: string;
  pageCover?: string;
};

type MemberFormState = {
  avatar: string;
  role: string;
  bio: string;
  summary: string;
  quote: string;
  website: string;
  social_github: string;
  social_x: string;
  social_linkedin: string;
  featured: boolean;
  verified: boolean;
  status: string;
};

type MemberProfileAdminPanelProps = {
  members: MemberProfileAdminMember[];
};

type AvatarHistoryItem = {
  key: string;
  url: string;
  size?: number;
  lastModified?: string;
};

type JsonPayload = {
  message?: string;
  data?: {
    key?: string;
    url?: string;
    size?: number;
    lastModified?: string;
    items?: AvatarHistoryItem[];
  };
};

const defaultForm: MemberFormState = {
  avatar: "",
  role: "",
  bio: "",
  summary: "",
  quote: "",
  website: "",
  social_github: "",
  social_x: "",
  social_linkedin: "",
  featured: false,
  verified: false,
  status: "Published",
};

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on", "featured", "verified"].includes(
      value.trim().toLowerCase(),
    );
  }
  return false;
}

function buildForm(member?: MemberProfileAdminMember): MemberFormState {
  if (!member) return defaultForm;

  return {
    avatar: getAvatarUrl(member),
    role: member.role || "",
    bio: member.bio || "",
    summary: member.summary || "",
    quote: member.quote || "",
    website: member.website || "",
    social_github: member.social_github || "",
    social_x: member.social_x || "",
    social_linkedin: member.social_linkedin || "",
    featured: toBoolean(member.featured),
    verified: toBoolean(member.verified),
    status: member.status || "Published",
  };
}

function getAvatarUrl(member?: MemberProfileAdminMember) {
  return (
    member?.avatar ||
    member?.pageIcon ||
    member?.pageCoverThumbnail ||
    member?.pageCover ||
    "/avatar.svg"
  );
}

function readErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }
  return fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

async function readJsonPayload(response: Response): Promise<JsonPayload> {
  const raw: unknown = await response.json().catch(() => null);
  const record = asRecord(raw);
  if (!record) return {};

  const message =
    typeof record.message === "string" ? record.message : undefined;
  const data = asRecord(record.data);
  const url = data && typeof data.url === "string" ? data.url : undefined;
  const key = data && typeof data.key === "string" ? data.key : undefined;
  const size = data && typeof data.size === "number" ? data.size : undefined;
  const lastModified =
    data && typeof data.lastModified === "string"
      ? data.lastModified
      : undefined;
  const items =
    data && Array.isArray(data.items)
      ? data.items
          .map((item): AvatarHistoryItem | null => {
            const itemRecord = asRecord(item);
            if (!itemRecord) return null;
            const itemKey = typeof itemRecord.key === "string" ? itemRecord.key : "";
            const itemUrl = typeof itemRecord.url === "string" ? itemRecord.url : "";
            if (!itemKey || !itemUrl) return null;
            const itemSize = typeof itemRecord.size === "number" ? itemRecord.size : undefined;
            const itemLastModified =
              typeof itemRecord.lastModified === "string"
                ? itemRecord.lastModified
                : undefined;
            const parsed: AvatarHistoryItem = { key: itemKey, url: itemUrl };
            if (itemSize !== undefined) parsed.size = itemSize;
            if (itemLastModified) parsed.lastModified = itemLastModified;
            return parsed;
          })
          .filter((item): item is AvatarHistoryItem => Boolean(item))
      : undefined;

  const payload: JsonPayload = {};
  if (message) payload.message = message;
  const dataPayload: JsonPayload["data"] = {};
  if (key) dataPayload.key = key;
  if (url) dataPayload.url = url;
  if (size !== undefined) dataPayload.size = size;
  if (lastModified) dataPayload.lastModified = lastModified;
  if (items) dataPayload.items = items;
  if (Object.keys(dataPayload).length > 0) payload.data = dataPayload;
  return payload;
}

export function MemberProfileAdminPanel({ members }: MemberProfileAdminPanelProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(members[0]?.id || "");
  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedId) || members[0],
    [members, selectedId],
  );
  const [form, setForm] = useState<MemberFormState>(() => buildForm(selectedMember));
  const [uploading, setUploading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [avatarHistory, setAvatarHistory] = useState<AvatarHistoryItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const filteredMembers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return members;
    return members.filter((member) =>
      [member.title, member.role, member.slug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [members, query]);

  function selectMember(member: MemberProfileAdminMember) {
    setSelectedId(member.id);
    setForm(buildForm(member));
    setNotice("");
    setError("");
  }

  function updateField<K extends keyof MemberFormState>(key: K, value: MemberFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const loadAvatarHistory = useCallback(async (member?: MemberProfileAdminMember) => {
    if (!member?.id && !member?.slug) {
      setAvatarHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const params = new URLSearchParams({ limit: "300" });
      if (member.id) params.set("memberId", member.id);
      if (member.slug) params.set("memberSlug", member.slug);
      const response = await fetch(`/api/admin/member-avatar-list?${params.toString()}`);
      const payload = await readJsonPayload(response);
      if (!response.ok) {
        throw new Error(readErrorMessage(payload, "读取头像历史失败。"));
      }
      setAvatarHistory(payload.data?.items || []);
    } catch (historyError) {
      setAvatarHistory([]);
      setError(historyError instanceof Error ? historyError.message : "读取头像历史失败。");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAvatarHistory(selectedMember);
  }, [loadAvatarHistory, selectedMember]);

  async function handleAvatarFile(file?: File) {
    if (!file) return;
    setUploading(true);
    setNotice("");
    setError("");

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("READ_FILE_FAILED"));
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/admin/member-avatar-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl,
          fileName: file.name,
          memberId: selectedMember?.id,
          memberSlug: selectedMember?.slug,
        }),
      });
      const payload = await readJsonPayload(response);
      if (!response.ok) {
        throw new Error(readErrorMessage(payload, "头像上传失败。"));
      }
      const url = payload.data?.url;
      if (!url || typeof url !== "string") {
        throw new Error("图床没有返回可用 URL。");
      }
      updateField("avatar", url);
      if (payload.data?.key) {
        const uploadedItem: AvatarHistoryItem = {
          key: payload.data.key,
          url,
          lastModified: new Date().toISOString(),
        };
        if (payload.data.size !== undefined) {
          uploadedItem.size = payload.data.size;
        }
        setAvatarHistory((current) => [
          uploadedItem,
          ...current.filter((item) => item.url !== url),
        ]);
      }
      setNotice("头像已上传，保存后会写回 Notion。");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "头像上传失败。");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!selectedMember?.id) return;
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const response = await fetch("/api/admin/member-profile-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedMember.id,
          memberSlug: selectedMember.slug,
          fields: form,
        }),
      });
      const payload = await readJsonPayload(response);
      if (!response.ok) {
        throw new Error(readErrorMessage(payload, "成员资料写回失败。"));
      }
      setNotice("成员资料已写回 Notion。刷新页面后会读取最新数据。");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "成员资料写回失败。");
    } finally {
      setSaving(false);
    }
  }

  if (!members.length) {
    return (
      <div className="surface-card-strong p-6">
        <p className="card-eyebrow">Empty state</p>
        <h3 className="mt-4 text-xl font-semibold text-white">还没有可维护的正式成员。</h3>
        <p className="mt-3 text-sm leading-7 text-white/60">
          先从申请池审核成员，或在 Notion 中把 Member 数据状态改为 Published。
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="surface-card-strong p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="card-eyebrow">Member source</p>
            <h3 className="mt-3 text-xl font-semibold text-white">成员列表</h3>
          </div>
          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
            {members.length} 人
          </span>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-white/70">
          <Search className="h-4 w-4 shrink-0 text-white/42" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/32"
            placeholder="搜索姓名、角色或 slug"
          />
        </label>

        <div className="mt-4 max-h-[620px] space-y-2 overflow-auto pr-1">
          {filteredMembers.map((member) => {
            const active = member.id === selectedMember?.id;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => selectMember(member)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                  active
                    ? "border-[#ffb879]/34 bg-[#ff9a3c]/12"
                    : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]"
                }`}
              >
                <img
                  src={getAvatarUrl(member)}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-lg border border-white/10 object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {member.title || "Untitled member"}
                  </span>
                  <span className="mt-1 block truncate text-xs text-white/46">
                    {member.role || member.slug || "待补充身份信息"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="surface-card-strong p-5 sm:p-6">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="card-eyebrow">Profile editor</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {selectedMember?.title || "成员资料"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/58">
              上传头像会先进入图床，保存资料时再把头像 URL 和文本字段写回 Notion Member 页面。
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={form.avatar || getAvatarUrl(selectedMember)}
              alt=""
              className="h-20 w-20 rounded-lg border border-white/10 object-cover"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#ffd8ae]/34 bg-[#ff9a3c]/12 px-4 py-3 text-sm font-medium text-[#ffd09a] transition hover:border-[#ffd8ae]/52">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? "上传中" : "上传头像"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                  void handleAvatarFile(event.target.files?.[0]);
                }}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/38">Avatar history</p>
              <p className="mt-2 text-sm text-white/58">
                最近 {avatarHistory.length} 张，点击即可切换当前头像。
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void loadAvatarHistory(selectedMember);
              }}
              disabled={historyLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/66 transition hover:border-white/18 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {historyLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              刷新
            </button>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
            {historyLoading && avatarHistory.length === 0 ? (
              <div className="col-span-full rounded-lg border border-white/10 bg-black/15 px-4 py-5 text-sm text-white/45">
                正在读取头像历史...
              </div>
            ) : null}
            {!historyLoading && avatarHistory.length === 0 ? (
              <div className="col-span-full rounded-lg border border-white/10 bg-black/15 px-4 py-5 text-sm text-white/45">
                还没有该成员的历史头像。上传第一张后会自动出现在这里。
              </div>
            ) : null}
            {avatarHistory.map((item) => {
              const active = item.url === form.avatar;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    updateField("avatar", item.url);
                    setNotice("已切换当前头像，保存后会写回 Notion。");
                    setError("");
                  }}
                  className={`aspect-square overflow-hidden rounded-lg border transition ${
                    active
                      ? "border-[#ffd8ae]/70 ring-2 ring-[#ff9a3c]/35"
                      : "border-white/10 hover:border-white/24"
                  }`}
                  title={item.lastModified || item.key}
                >
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Avatar URL</span>
            <input
              value={form.avatar}
              onChange={(event) => updateField("avatar", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#ffb879]/45"
              placeholder="https://..."
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Role</span>
            <input
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0f16] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            >
              <option value="Published">Published</option>
              <option value="Invisible">Invisible</option>
              <option value="Draft">Draft</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Summary</span>
            <input
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              className="mt-2 min-h-32 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm leading-7 text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Quote</span>
            <input
              value={form.quote}
              onChange={(event) => updateField("quote", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">Website</span>
            <input
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">GitHub</span>
            <input
              value={form.social_github}
              onChange={(event) => updateField("social_github", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">X</span>
            <input
              value={form.social_x}
              onChange={(event) => updateField("social_x", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-white/38">LinkedIn</span>
            <input
              value={form.social_linkedin}
              onChange={(event) => updateField("social_linkedin", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/45"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-5">
          <label className="inline-flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField("featured", event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/[0.06]"
            />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(event) => updateField("verified", event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/[0.06]"
            />
            Verified
          </label>
        </div>

        {notice ? (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </div>
        ) : null}
        {error ? (
          <div className="mt-5 rounded-lg border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void handleSave();
            }}
            disabled={saving}
            className="button-shine relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] px-5 py-3 text-sm font-medium text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.24)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            保存到 Notion
          </button>
          <span className="inline-flex items-center gap-2 text-xs leading-6 text-white/42">
            <UploadCloud className="h-4 w-4" />
            需要配置 OSS/S3 图床环境变量后才能上传文件
          </span>
        </div>
      </div>
    </section>
  );
}
