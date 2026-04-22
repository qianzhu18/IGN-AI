const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3003";
const joinUrl =
  process.env.NEXT_PUBLIC_COMMUNITY_JOIN_URL?.trim() || "#join";
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@ignai.community";
const xiaohongshuUrl = process.env.NEXT_PUBLIC_XIAOHONGSHU_URL?.trim() || "";
const wechatUrl = process.env.NEXT_PUBLIC_WECHAT_URL?.trim() || "";
const feishuUrl = process.env.NEXT_PUBLIC_FEISHU_URL?.trim() || "";
const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || "";
const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL?.trim() || "";

type LinkSlot = {
  label: string;
  detail: string;
  href: string;
  configured: boolean;
};

const buildSlot = (
  label: string,
  detail: string,
  href: string,
  configured: boolean,
): LinkSlot => ({
  label,
  detail,
  href: configured ? href : "#join",
  configured,
});

export const siteLinks = {
  siteUrl,
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
  buildSlot("微信入口", "适合本地连接与活动同步", wechatUrl, Boolean(wechatUrl)),
  buildSlot("飞书社群", "适合协作与资料沉淀", feishuUrl, Boolean(feishuUrl)),
  buildSlot("Telegram", "适合跨地域连接", telegramUrl, Boolean(telegramUrl)),
  buildSlot("Discord", "适合持续线上讨论", discordUrl, Boolean(discordUrl)),
  buildSlot("小红书", "适合内容更新与扩散", xiaohongshuUrl, Boolean(xiaohongshuUrl)),
  buildSlot(
    "联系邮箱",
    "合作、提案与对外联系",
    `mailto:${contactEmail}`,
    true,
  ),
];

