import type { MetadataRoute } from "next";

import { siteLinks } from "@/content/links";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: new URL("/sitemap.xml", siteLinks.siteUrl).toString(),
  };
}
