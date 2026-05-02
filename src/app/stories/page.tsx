import type { Metadata } from "next";

import { ContentCollectionPage } from "@/components/content/ContentCollectionPage";
import { PageShell } from "@/components/layout/PageShell";
import { getCommunityContentItems } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Stories | IGNAI",
  description: "IGNAI 成员故事、项目记录和社区行动。",
};

export default async function StoriesPage() {
  const items = await getCommunityContentItems();

  return (
    <PageShell>
      <ContentCollectionPage
        eyebrow="Member Stories"
        title="People in motion."
        description="记录社区成员的项目、表达、协作和成长，让行动者被看见。"
        items={items}
        types={["story"]}
        emptyText="当 Sanity 成员故事模型接入后，这里会展示真实成员故事和项目记录。"
      />
    </PageShell>
  );
}
