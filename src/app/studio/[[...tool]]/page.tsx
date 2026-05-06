import type { Metadata } from "next";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";

import { AdminShell } from "@/components/admin/AdminShell";
import { OpsAccessGate } from "@/components/admin/OpsAccessGate";
import { isOpsPasswordConfigured, isOpsRequestAuthorized } from "@/lib/opsAuth";
import { StudioClient } from "./StudioClient";

export { viewport };
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "IGNAI Studio",
};

const navItems = [
  {
    href: "/manage",
    label: "后台工作台",
    note: "返回统一后台平台，查看后台模块与发布路径。",
    state: "Live",
  },
  {
    href: "/studio",
    label: "内容编辑",
    note: "活动、社区记录与后续成员资料都从这里进入。",
    state: "Admin",
  },
  {
    href: "/ops/join",
    label: "申请池",
    note: "查看加入申请、管理状态与后续跟进动作。",
    state: "Admin",
  },
];

export default async function StudioPage() {
  if (!isOpsPasswordConfigured) {
    return (
      <AdminShell
        eyebrow="Admin / Setup"
        title="内容编辑后台"
        description="Studio 已经接进社区后台平台，但要先配置管理员访问密码，才能继续使用内容编辑功能。"
        navItems={navItems}
      >
        <OpsAccessGate mode="setup" surface="admin" />
      </AdminShell>
    );
  }

  if (!(await isOpsRequestAuthorized())) {
    return (
      <AdminShell
        eyebrow="Admin / Login"
        title="内容编辑后台"
        description="当前内容后台只对管理员开放。验证密码后，才能发布活动、社区记录和后续成员资料。"
        navItems={navItems}
      >
        <OpsAccessGate mode="login" surface="admin" />
      </AdminShell>
    );
  }

  return <StudioClient />;
}
