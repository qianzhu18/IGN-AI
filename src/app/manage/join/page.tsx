import type { Metadata } from "next";

import { adminNavItems } from "@/components/admin/adminConfig";
import { AdminShell } from "@/components/admin/AdminShell";
import { OpsAccessGate } from "@/components/admin/OpsAccessGate";
import { JoinSubmissionsPanel } from "@/components/admin/JoinSubmissionsPanel";
import { isOpsPasswordConfigured, isOpsRequestAuthorized } from "@/lib/opsAuth";
import { listJoinApplications } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Join Admin | IGNAI",
  description: "IGNAI 社区申请池后台。",
};

export default async function ManageJoinPage() {
  if (!isOpsPasswordConfigured) {
    return (
      <AdminShell
        eyebrow="Admin / Setup"
        title="申请池"
        description="要先配置管理员访问密码，才能进入申请池后台。"
        navItems={adminNavItems}
        currentHref="/manage/join"
      >
        <OpsAccessGate mode="setup" surface="admin" />
      </AdminShell>
    );
  }

  if (!(await isOpsRequestAuthorized())) {
    return (
      <AdminShell
        eyebrow="Admin / Login"
        title="申请池"
        description="当前申请池只对管理员开放。验证密码后，才能查看申请列表和状态流转。"
        navItems={adminNavItems}
        currentHref="/manage/join"
      >
        <OpsAccessGate mode="login" surface="admin" />
      </AdminShell>
    );
  }

  const result = await listJoinApplications(50);

  return (
    <AdminShell
      eyebrow="Admin / Join"
      title="申请池"
      description="这里负责承接社区加入线索、筛选状态与后续跟进动作。它现在已经收敛到统一后台平台里了。"
      navItems={adminNavItems}
      currentHref="/manage/join"
      actions={[
        { href: "/manage", label: "返回后台首页", secondary: true },
        { href: "/manage/content", label: "去内容发布台" },
      ]}
    >
      <JoinSubmissionsPanel initialItems={result.data} />
    </AdminShell>
  );
}
