import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const opsSessionCookieName = "ignai_ops_session";

const opsAccessPassword = process.env.OPS_ACCESS_PASSWORD?.trim() || "";

const hashValue = (value: string) =>
  createHash("sha256").update(value).digest("hex");

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const isOpsPasswordConfigured = Boolean(opsAccessPassword);
export const isOpsProtectionRequired =
  process.env.NODE_ENV === "production" || isOpsPasswordConfigured;

export function validateOpsPassword(password: string) {
  return isOpsPasswordConfigured && safeEqual(hashValue(password), hashValue(opsAccessPassword));
}

export function createOpsSessionValue() {
  return hashValue(opsAccessPassword);
}

export function hasValidOpsSession(value?: string) {
  return Boolean(
    isOpsPasswordConfigured &&
      value &&
      safeEqual(value, createOpsSessionValue()),
  );
}

export async function isOpsRequestAuthorized() {
  if (!isOpsProtectionRequired) {
    return true;
  }

  if (!isOpsPasswordConfigured) {
    return false;
  }

  const cookieStore = await cookies();
  return hasValidOpsSession(cookieStore.get(opsSessionCookieName)?.value);
}

export function getOpsSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}
