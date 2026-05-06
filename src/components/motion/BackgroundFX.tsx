"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  baseY: number;
  speed: number;
  drift: number;
  size: number;
  phase: number;
  color: "heat" | "signal";
};

type FlowLine = {
  y: number;
  amplitude: number;
  phase: number;
  speed: number;
  color: "heat" | "signal";
};

const PARTICLE_COLORS = {
  heat: "255, 154, 60",
  signal: "124, 200, 255",
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let lines: FlowLine[] = [];

    const scrollProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      return scrollable <= 0 ? 0 : clamp(window.scrollY / scrollable, 0, 1);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = width < 768 ? 42 : 76;
      particles = Array.from({ length: particleCount }, (_, index) => {
        const band = index / particleCount;
        const baseY = height * (0.16 + 0.68 * ((band * 1.7 + Math.random() * 0.35) % 1));

        return {
          x: Math.random() * width,
          y: baseY + (Math.random() - 0.5) * 80,
          baseY,
          speed: 8 + Math.random() * 22,
          drift: 12 + Math.random() * 36,
          size: 0.7 + Math.random() * 1.9,
          phase: Math.random() * Math.PI * 2,
          color: index % 5 === 0 ? "signal" : "heat",
        };
      });

      lines = Array.from({ length: width < 768 ? 4 : 7 }, (_, index) => ({
        y: height * (0.24 + index * 0.09),
        amplitude: 18 + index * 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.08 + index * 0.012,
        color: index % 3 === 1 ? "signal" : "heat",
      }));
    };

    const drawFlowLine = (line: FlowLine, time: number, progress: number) => {
      const color = PARTICLE_COLORS[line.color];
      const energy = 0.16 + Math.sin(time * 0.0014 + line.phase) * 0.05;
      const offset = time * line.speed + progress * width * 0.42;

      context.beginPath();
      for (let x = -80; x <= width + 80; x += 28) {
        const y =
          line.y +
          Math.sin((x + offset) * 0.006 + line.phase) * line.amplitude +
          Math.sin((x - offset * 0.6) * 0.011) * 8;

        if (x === -80) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = `rgba(${color}, ${energy})`;
      context.lineWidth = line.color === "signal" ? 0.65 : 0.8;
      context.stroke();

      const tracerX = ((time * (0.038 + line.speed * 0.02) + line.phase * 80) % (width + 180)) - 90;
      const tracerY =
        line.y +
        Math.sin((tracerX + offset) * 0.006 + line.phase) * line.amplitude +
        Math.sin((tracerX - offset * 0.6) * 0.011) * 8;
      const gradient = context.createRadialGradient(tracerX, tracerY, 0, tracerX, tracerY, 42);
      gradient.addColorStop(0, `rgba(${color}, ${0.38 + progress * 0.12})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(tracerX, tracerY, 42, 0, Math.PI * 2);
      context.fill();
    };

    const drawPulse = (x: number, y: number, radius: number, alpha: number, color: string) => {
      context.strokeStyle = `rgba(${color}, ${alpha})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
    };

    const draw = (time: number) => {
      const progress = scrollProgress();
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      lines.forEach((line) => drawFlowLine(line, time, progress));

      const attractorX = width * (0.24 + progress * 0.46);
      const attractorY = height * (0.46 + Math.sin(progress * Math.PI) * 0.12);

      particles.forEach((particle) => {
        const wave = Math.sin(time * 0.00045 + particle.phase);
        const flow = progress < 0.72 ? 1 : 1.9;
        particle.x += (particle.speed * flow) / 60;
        particle.y =
          particle.baseY +
          wave * particle.drift +
          Math.sin(time * 0.0003 + particle.phase * 0.7) * 12;

        if (progress > 0.68) {
          particle.y += (attractorY - particle.y) * 0.004;
        }

        if (particle.x > width + 24) {
          particle.x = -24;
          particle.baseY = height * (0.14 + Math.random() * 0.72);
        }

        const color = PARTICLE_COLORS[particle.color];
        const distance = Math.hypot(particle.x - attractorX, particle.y - attractorY);
        const focusBoost = clamp(1 - distance / Math.max(width * 0.34, 260), 0, 1);
        const alpha = 0.12 + focusBoost * 0.22 + Math.max(0, wave) * 0.08;

        context.fillStyle = `rgba(${color}, ${alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size + focusBoost * 0.9, 0, Math.PI * 2);
        context.fill();
      });

      const pulsePhase = (time * 0.00016) % 1;
      const heroPulse = 26 + pulsePhase * 110;
      drawPulse(width * 0.24, height * 0.44, heroPulse, (1 - pulsePhase) * 0.18, "255, 154, 60");
      drawPulse(width * 0.72, height * 0.42, heroPulse * 0.72, (1 - pulsePhase) * 0.1, "124, 200, 255");

      if (progress > 0.68) {
        const converge = (progress - 0.68) / 0.32;
        drawPulse(attractorX, attractorY, 36 + Math.sin(time * 0.002) * 8, 0.08 + converge * 0.16, "255, 197, 107");
      }

      context.globalCompositeOperation = "source-over";

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();
    draw(performance.now());

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-40 mix-blend-screen"
    />
  );
}
