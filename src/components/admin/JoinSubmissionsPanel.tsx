"use client";

import { useMemo, useState } from "react";

import {
  joinStatusLabel,
  joinStatusOptions,
  type JoinApplicationRecord,
  type JoinApplicationStatus,
} from "@/lib/supabase";

type JoinSubmissionsPanelProps = {
  initialItems: JoinApplicationRecord[];
};

type UpdateState = Record<string, "idle" | "saving" | "saved" | "error">;

export function JoinSubmissionsPanel({ initialItems }: JoinSubmissionsPanelProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<JoinApplicationStatus | "all">("all");
  const [updateState, setUpdateState] = useState<UpdateState>({});

  const visibleItems = useMemo(
    () => items.filter((item) => filter === "all" || item.status === filter),
    [filter, items],
  );

  const handleStatusChange = async (id: string, status: JoinApplicationStatus) => {
    setUpdateState((current) => ({ ...current, [id]: "saving" }));

    const response = await fetch(`/api/join/submissions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setUpdateState((current) => ({ ...current, [id]: "error" }));
      return;
    }

    const payload = (await response.json()) as { data?: JoinApplicationRecord };

    if (payload.data) {
      setItems((current) =>
        current.map((item) => (item.id === id ? payload.data! : item)),
      );
    }

    setUpdateState((current) => ({ ...current, [id]: "saved" }));
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="card-eyebrow">Ops view</p>
            <h2 className="mt-3 text-[1.45rem] font-semibold text-white">申请池</h2>
            <p className="mt-2 text-sm leading-7 text-white/58">
              先用这一版把提交、查看、状态流转跑顺，后面再接更完整的成员管理。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                filter === "all"
                  ? "border-[#ffb879]/36 bg-[#ff9a3c]/16 text-[#ffd09a]"
                  : "border-white/10 bg-white/[0.04] text-white/58 hover:text-white"
              }`}
            >
              全部
            </button>
            {joinStatusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === status
                    ? "border-[#ffb879]/36 bg-[#ff9a3c]/16 text-[#ffd09a]"
                    : "border-white/10 bg-white/[0.04] text-white/58 hover:text-white"
                }`}
              >
                {joinStatusLabel[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {visibleItems.map((item) => (
          <div key={item.id} className="surface-card-strong p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[1.15rem] font-semibold text-white">{item.name}</h3>
                  <span className="rounded-full border border-[#ffb879]/16 bg-[#0d1118]/88 px-3 py-1 text-xs text-[#ffd09a]">
                    {joinStatusLabel[item.status as JoinApplicationStatus]}
                  </span>
                  {item.metadata?.is_test ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/52">
                      Test
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 text-sm text-white/66 sm:grid-cols-2">
                  <p>联系方式：{item.contact}</p>
                  <p>身份：{item.role}</p>
                  <p>来源：{item.source}</p>
                  <p>提交时间：{new Date(item.created_at).toLocaleString("zh-CN")}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.interests.map((interest) => (
                    <span
                      key={`${item.id}-${interest}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/62"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/72">
                  {item.message || "暂无附加说明。"}
                </div>
              </div>

              <div className="w-full lg:max-w-[280px]">
                <label className="card-eyebrow">更新状态</label>
                <select
                  value={item.status}
                  onChange={(event) =>
                    handleStatusChange(item.id, event.target.value as JoinApplicationStatus)
                  }
                  className="mt-3 w-full rounded-[18px] border border-white/10 bg-[#0b1018] px-4 py-3 text-sm text-white outline-none transition focus:border-[#ffb879]/36"
                >
                  {joinStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {joinStatusLabel[status]}
                    </option>
                  ))}
                </select>

                <p className="mt-3 text-xs text-white/44">
                  {updateState[item.id] === "saving"
                    ? "正在保存..."
                    : updateState[item.id] === "saved"
                      ? "已更新"
                      : updateState[item.id] === "error"
                        ? "更新失败，请重试"
                        : "切换状态后会立即写回 Supabase。"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {visibleItems.length === 0 ? (
          <div className="surface-card p-6">
            <p className="card-eyebrow">Empty</p>
            <p className="mt-3 text-sm text-white/58">当前筛选条件下还没有申请记录。</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
