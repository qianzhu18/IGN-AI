import { GridLines } from "@/src/components/ui/GridLines";
import { NoiseOverlay } from "@/src/components/ui/NoiseOverlay";

export function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.018)_0%,transparent_18%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_18%,rgba(255,122,24,0.2),transparent_34%),radial-gradient(ellipse_at_88%_22%,rgba(93,169,255,0.13),transparent_32%),linear-gradient(125deg,rgba(255,154,60,0.08),transparent_24%,rgba(124,200,255,0.08)_78%,transparent_100%)]" />
      <div className="absolute inset-y-0 left-1/2 hidden w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_10%,rgba(255,255,255,0.02)_55%,transparent_100%)] lg:block" />
      <GridLines />
      <NoiseOverlay />
    </div>
  );
}
