import Head from "next/head";
import type { GetServerSidePropsContext } from "next";

import { AdminShell } from "@/src/components/admin/AdminShell";
import {
  MemberProfileAdminPanel,
  type MemberProfileAdminMember,
} from "@/src/components/admin/MemberProfileAdminPanel";
import { adminNavItems } from "@/src/components/admin/adminConfig";
import { OpsAccessGate } from "@/src/components/admin/OpsAccessGate";
import { fetchGlobalAllData } from "@/lib/db/SiteDataApi";
import { isOpsAuthorized, isOpsPasswordConfigured } from "@/lib/join";
import { getPublishedMembers, sortMembers } from "@/lib/utils/member";

type ManageMembersPageProps = {
  gateMode?: "login" | "setup";
  members?: MemberProfileAdminMember[];
};

export default function ManageMembersPage({ gateMode, members = [] }: ManageMembersPageProps) {
  if (gateMode) {
    return (
      <>
        <Head>
          <title>Members Admin Access</title>
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
        <title>成员管理</title>
        <meta name="description" content="成员资料管理的后续入口。" />
      </Head>
      <AdminShell
        eyebrow="Member Ops"
        title="成员管理"
        description="维护正式成员资料、上传头像并回写 Notion。成员列表要完整，头像上传就是 P0 闭环的一部分。"
        navItems={adminNavItems}
        currentHref="/manage/members"
        actions={[
          { href: "/members", label: "查看 Members 页面" },
          { href: "/manage/join", label: "回到申请池", secondary: true },
        ]}
      >
        <MemberProfileAdminPanel members={members} />
      </AdminShell>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!isOpsPasswordConfigured()) {
    return { props: { gateMode: "setup" } };
  }

  if (!isOpsAuthorized(context.req)) {
    return { props: { gateMode: "login" } };
  }

  const props = (await fetchGlobalAllData({
    from: "manage-members",
    locale: context.locale,
  })) as { allMembers?: MemberProfileAdminMember[] };
  const rawMembers = Array.isArray(props.allMembers) ? props.allMembers : [];
  const publishedMembers = getPublishedMembers(rawMembers) as MemberProfileAdminMember[];
  const members = sortMembers(publishedMembers) as MemberProfileAdminMember[];

  return { props: { members } };
}
