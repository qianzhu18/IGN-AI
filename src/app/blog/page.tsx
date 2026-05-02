import type { Metadata } from "next";

import { ContentCollectionPage } from "@/components/content/ContentCollectionPage";
import { PageShell } from "@/components/layout/PageShell";
import { getCommunityContentItems } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Blog | IGNAI",
  description: "IGNAI 社区文章、资源和观点记录。",
};

export default async function BlogPage() {
  const items = await getCommunityContentItems();

  return (
    <PageShell>
      <ContentCollectionPage
        eyebrow="Blog / Resources"
        title="Articles and resources."
        description="沉淀社区观点、工具清单、工作流和 AI 实践记录。这里会是 IGNAI 长期表达的内容入口。"
        items={items}
        types={["article", "resource"]}
        emptyText="当 Sanity 内容模型接入后，这里会展示已发布文章和资源。"
      />
    </PageShell>
  );
}
