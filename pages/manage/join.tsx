import Head from "next/head";
import type { GetServerSidePropsContext } from "next";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { adminNavItems } from "@/src/components/admin/adminConfig";
import { JoinSubmissionsPanel } from "@/src/components/admin/JoinSubmissionsPanel";
import { OpsAccessGate } from "@/src/components/admin/OpsAccessGate";
import {
  isOpsAuthorized,
  isOpsPasswordConfigured,
  listJoinApplications,
} from "@/lib/join";
import type { JoinApplicationRecord } from "@/lib/supabase";

type ManageJoinPageProps = {
  gateMode?: "login" | "setup";
  initialItems: JoinApplicationRecord[];
};

export default function ManageJoinPage({
  gateMode,
  initialItems,
}: ManageJoinPageProps) {
  if (gateMode) {
    return (
      <>
        <Head>
          <title>Join Ops Access</title>
        </Head>
        <main className="min-h-screen bg-[#05070b] px-5 py-16">
          <OpsAccessGate mode={gateMode} surface="admin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>成员申请池</title>
        <meta name="description" content="查看 Join 提交记录并推进状态流转。" />
      </Head>
      <AdminShell
        eyebrow="Join Ops"
        title="申请池"
        description="这里先处理加入申请和成员资料草稿。运营可以快速查看线索、切状态，并决定谁进入后续成员整理。"
        navItems={adminNavItems}
        currentHref="/manage/join"
        actions={[
          { href: "/join", label: "打开 Join 页面" },
          { href: "/manage", label: "返回后台首页", secondary: true },
        ]}
      >
        <JoinSubmissionsPanel initialItems={initialItems} />
      </AdminShell>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!isOpsPasswordConfigured()) {
    return { props: { gateMode: "setup", initialItems: [] } };
  }

  if (!isOpsAuthorized(context.req)) {
    return { props: { gateMode: "login", initialItems: [] } };
  }

  return {
    props: {
      initialItems: await listJoinApplications(),
    },
  };
}
