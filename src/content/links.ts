const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3003";
const joinUrl =
  process.env.NEXT_PUBLIC_COMMUNITY_JOIN_URL?.trim() || "/join";
const joinFormUrl = process.env.NEXT_PUBLIC_JOIN_FORM_URL?.trim() || "";
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@ignai.community";
const xiaohongshuUrl = process.env.NEXT_PUBLIC_XIAOHONGSHU_URL?.trim() || "";
const wechatUrl = process.env.NEXT_PUBLIC_WECHAT_URL?.trim() || "";
const feishuUrl = process.env.NEXT_PUBLIC_FEISHU_URL?.trim() || "";
const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || "";

type LinkSlot = {
  label: string;
  href: string;
  configured: boolean;
};

const buildSlot = (
  label: string,
  href: string,
  configured: boolean,
): LinkSlot => ({
  label,
  href: configured ? href : "/join",
  configured,
});

export const siteLinks = {
  siteUrl,
  joinFormUrl,
  joinFormConfigured: Boolean(joinFormUrl),
  contactEmail,
  contactEmailHref: `mailto:${contactEmail}`,
};

export const primaryLinks = {
  joinCommunity: {
    href: joinUrl,
    configured: joinUrl !== "#join",
  },
  contact: {
    href: `mailto:${contactEmail}`,
    configured: true,
  },
  culture: {
    href: "#core-spirit",
    configured: true,
  },
};

export const socialLinkSlots: LinkSlot[] = [
  buildSlot("微信社群", wechatUrl, Boolean(wechatUrl)),
  buildSlot("飞书", feishuUrl, Boolean(feishuUrl)),
  buildSlot("Telegram", telegramUrl, Boolean(telegramUrl)),
  buildSlot("小红书", xiaohongshuUrl, Boolean(xiaohongshuUrl)),
  buildSlot("Email", `mailto:${contactEmail}`, true),
];
