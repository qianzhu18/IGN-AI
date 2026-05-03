import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { insertJoinApplication, isSupabaseServerConfigured, type JoinApplicationInput } from "@/lib/supabase";

export type JoinStorageMode = "supabase" | "local" | "unconfigured";
export type JoinExperienceMode = "database" | "local" | "external" | "email";

type JoinApplicationRecord = JoinApplicationInput & {
  id: string;
  createdAt: string;
};

const localJoinStoragePath =
  process.env.JOIN_LOCAL_STORAGE_PATH?.trim() ||
  path.join(process.cwd(), ".data", "join-applications.json");

export const isLocalJoinInboxEnabled =
  process.env.NODE_ENV !== "production" || Boolean(process.env.JOIN_LOCAL_STORAGE_PATH?.trim());

export const joinStorageMode: JoinStorageMode = isSupabaseServerConfigured
  ? "supabase"
  : isLocalJoinInboxEnabled
    ? "local"
    : "unconfigured";

export function getJoinExperienceMode(hasExternalForm: boolean): JoinExperienceMode {
  if (hasExternalForm) {
    return "external";
  }

  if (joinStorageMode === "supabase") {
    return "database";
  }

  if (joinStorageMode === "local") {
    return "local";
  }

  return "email";
}

async function readLocalJoinInbox() {
  try {
    const raw = await readFile(localJoinStoragePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as JoinApplicationRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalJoinApplication(input: JoinApplicationInput) {
  const records = await readLocalJoinInbox();

  const nextRecord: JoinApplicationRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(localJoinStoragePath), { recursive: true });
  await writeFile(
    localJoinStoragePath,
    JSON.stringify([nextRecord, ...records], null, 2),
    "utf8",
  );

  return nextRecord;
}

export async function createJoinApplication(input: JoinApplicationInput) {
  if (joinStorageMode === "supabase") {
    const result = await insertJoinApplication(input);

    return {
      ...result,
      storage: "supabase" as const,
      message: result.ok
        ? "已收到申请，我们会尽快联系你。"
        : result.message,
    };
  }

  if (joinStorageMode === "local") {
    await writeLocalJoinApplication(input);

    return {
      ok: true,
      status: 201,
      storage: "local" as const,
      message:
        "已收到申请。当前环境会先保存到本地收件箱，方便继续联调和验收。",
    };
  }

  return {
    ok: false,
    status: 503,
    storage: "unconfigured" as const,
    message:
      "加入入口还没有配置完成。请先补充 Supabase，或配置外部表单入口。",
  };
}
