import { describe, expect, it } from "@jest/globals";

import { getJoinExperienceMode, isJoinNotionEnabled, normalizeJoinSubmission } from "@/lib/join";

describe("join utils", () => {
  it("normalizes member draft fields into metadata", () => {
    const result = normalizeJoinSubmission({
      name: "Alice",
      contact: "alice@example.com",
      role: "Builder",
      message: "Happy to help.",
      interests: ["内容分享", "", "项目展示"],
      memberProfile: {
        avatarUrl: "avatar.example.com/a.png",
        headline: "Build in public",
        website: "alice.dev",
        github: "github.com/alice",
      },
    });

    expect(result.interests).toEqual(["内容分享", "项目展示"]);
    expect(result.metadata.member_profile).toEqual({
      avatarUrl: "https://avatar.example.com/a.png",
      headline: "Build in public",
      website: "https://alice.dev",
      github: "https://github.com/alice",
      xiaohongshu: "",
    });
  });

  it("defaults to local mode when no external or database config exists", () => {
    const originalUrl = process.env.NEXT_PUBLIC_JOIN_FORM_URL;
    const originalMode = process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE;
    const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const originalPublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    delete process.env.NEXT_PUBLIC_JOIN_FORM_URL;
    delete process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(getJoinExperienceMode()).toBe("local");

    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_JOIN_FORM_URL;
    } else {
      process.env.NEXT_PUBLIC_JOIN_FORM_URL = originalUrl;
    }
    if (originalMode === undefined) {
      delete process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE;
    } else {
      process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE = originalMode;
    }
    if (originalSupabaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
    }
    if (originalServiceKey === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey;
    }
    if (originalPublishableKey === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalPublishableKey;
    }
  });

  it("uses database mode when Notion writeback is enabled", () => {
    const originalToken = process.env.NOTION_API_TOKEN;
    const originalUrl = process.env.NEXT_PUBLIC_JOIN_FORM_URL;
    const originalMode = process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE;
    const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const originalPublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    process.env.NOTION_API_TOKEN = "test-token";
    delete process.env.NEXT_PUBLIC_JOIN_FORM_URL;
    delete process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(isJoinNotionEnabled()).toBe(true);
    expect(getJoinExperienceMode()).toBe("database");

    if (originalToken === undefined) {
      delete process.env.NOTION_API_TOKEN;
    } else {
      process.env.NOTION_API_TOKEN = originalToken;
    }
    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_JOIN_FORM_URL;
    } else {
      process.env.NEXT_PUBLIC_JOIN_FORM_URL = originalUrl;
    }
    if (originalMode === undefined) {
      delete process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE;
    } else {
      process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE = originalMode;
    }
    if (originalSupabaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
    }
    if (originalServiceKey === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey;
    }
    if (originalPublishableKey === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalPublishableKey;
    }
  });
});
