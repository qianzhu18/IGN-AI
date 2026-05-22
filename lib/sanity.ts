import {
  fallbackContentItems,
  fallbackProjects,
  type CommunityContentItem,
  type CommunityProject,
} from "@/src/content/platform";

export async function getCommunityContentItems(): Promise<CommunityContentItem[]> {
  return fallbackContentItems;
}

export async function getCommunityProjects(): Promise<CommunityProject[]> {
  return fallbackProjects;
}
