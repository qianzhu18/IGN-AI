export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "1wxr3e75";

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2025-02-19";

export const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);
