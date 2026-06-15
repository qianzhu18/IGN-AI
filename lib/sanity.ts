import {
  fallbackContentItems,
  fallbackProjects,
  type CommunityContentItem,
  type CommunityProject,
} from "@/src/content/platform";

export function getCommunityContentItems(): CommunityContentItem[] {
  return fallbackContentItems;
}

export function getCommunityProjects(): CommunityProject[] {
  return fallbackProjects;
}
