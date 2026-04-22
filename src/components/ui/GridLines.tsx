export function GridLines() {
  return (
    <div
      aria-hidden
      className="mask-radial pointer-events-none absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "84px 84px",
      }}
    />
  );
}

