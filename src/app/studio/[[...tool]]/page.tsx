import type { Metadata } from "next";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";

import { StudioClient } from "./StudioClient";

export { viewport };
export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "IGNAI Studio",
};

export default function StudioPage() {
  return <StudioClient />;
}
