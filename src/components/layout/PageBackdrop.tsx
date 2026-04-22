import { GridLines } from "@/components/ui/GridLines";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

export function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.025),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
      <div className="absolute left-[-14rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,126,51,0.15)_0%,transparent_74%)] blur-3xl" />
      <div className="absolute right-[-12rem] top-[8rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(119,97,255,0.14)_0%,transparent_72%)] blur-3xl" />
      <div className="absolute bottom-[-12rem] left-[22%] h-[28rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_72%)] blur-3xl" />
      <GridLines />
      <NoiseOverlay />
    </div>
  );
}
