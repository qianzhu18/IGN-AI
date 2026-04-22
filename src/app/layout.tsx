import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_SC } from "next/font/google";
import type { ReactNode } from "react";

import { siteLinks } from "@/content/links";
import { siteContent } from "@/content/site";

import "./globals.css";

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteLinks.siteUrl),
  title: "IGNAI | Ignite before AGI.",
  description:
    "IGNAI 是一个 base 长沙、面向国际、立足本地技术连接与行动实践的 AI 社群。",
  keywords: [
    "IGNAI",
    "AI 社群",
    "长沙 AI",
    "Agent 社区",
    "AI 产品",
    "青年技术社区",
    "AGI",
    "长沙开发者",
  ],
  openGraph: {
    title: "IGNAI | Ignite before AGI.",
    description:
      "A living AI community rooted in Changsha and connected to the world.",
    url: siteLinks.siteUrl,
    siteName: siteContent.name,
    images: [
      {
        url: "/og/ignai-og.svg",
        width: 1200,
        height: 630,
        alt: "IGNAI open graph preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IGNAI | Ignite before AGI.",
    description:
      "A living AI community rooted in Changsha and connected to the world.",
    images: ["/og/ignai-og.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07070A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
