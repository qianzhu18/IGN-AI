export function GridLines() {
  return (
    <div
      aria-hidden
      className="mask-radial pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "linear-gradient(rgba(124,200,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,166,94,0.035) 1px, transparent 1px)",
        backgroundSize: "92px 92px",
      }}
    />
  );
}
