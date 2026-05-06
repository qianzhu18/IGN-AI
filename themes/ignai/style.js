/* eslint-disable react/no-unknown-property */
/**
 * IGNAI 主题样式
 * 从 v1.0.0 官网 UI 一比一复刻
 * 颜色系统：Heat #FF7A18, Signal #5DA9FF, 背景 #07080C
 * 不支持 tailwindCSS 的 @apply 语法
 */
const Style = () => {
  return (
    <style jsx global>{`
      /* ===== Design Tokens (from v1 tokens.css) ===== */
      :root {
        --ignai-bg: #07080c;
        --ignai-bg-elevated: rgba(12, 17, 24, 0.82);
        --ignai-bg-strong: rgba(11, 16, 32, 0.92);
        --ignai-border: rgba(255, 255, 255, 0.08);
        --ignai-text-primary: #f6f4ef;
        --ignai-text-secondary: #dde4f0;
        --ignai-text-muted: #96a0b1;
        --ignai-accent-orange: #ff7a18;
        --ignai-accent-yellow: #ffc56b;
        --ignai-accent-blue: #5da9ff;
        --ignai-accent-violet: #8e63ff;
        --ignai-gradient-brand: linear-gradient(
          135deg,
          rgba(255, 122, 24, 0.98) 0%,
          rgba(255, 154, 60, 0.95) 36%,
          rgba(255, 197, 107, 0.92) 66%,
          rgba(124, 200, 255, 0.82) 100%
        );
        --ignai-gradient-surface: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.02) 100%
        );
      }

      /* ===== Base (from v1 globals.css) ===== */
      #theme-ignai {
        background:
          radial-gradient(circle at 16% 10%, rgba(255, 122, 24, 0.22), transparent 28%),
          radial-gradient(circle at 84% 18%, rgba(93, 169, 255, 0.1), transparent 26%),
          linear-gradient(180deg, #040507 0%, #07080c 38%, #090d14 100%);
        color: var(--ignai-text-primary);
        overflow-x: hidden;
      }

      #theme-ignai ::selection {
        background: rgba(255, 122, 24, 0.35);
        color: var(--ignai-text-primary);
      }

      #theme-ignai * {
        box-sizing: border-box;
        border-color: rgba(255, 255, 255, 0.1);
      }

      /* ===== Scrollbar ===== */
      #theme-ignai ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      #theme-ignai ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      /* ===== Surface Cards (from v1) ===== */
      #theme-ignai .surface-card {
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.09);
        background-color: rgba(9, 13, 20, 0.62);
        backdrop-filter: blur(12px);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.035),
          0 18px 48px rgba(0, 0, 0, 0.22);
      }

      #theme-ignai .surface-card-strong {
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background-color: rgba(8, 12, 18, 0.74);
        backdrop-filter: blur(16px);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          0 22px 58px rgba(0, 0, 0, 0.28);
      }

      /* ===== IGNAI Typography ===== */
      #theme-ignai .eyebrow-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 184, 121, 0.2);
        background-color: rgba(255, 154, 60, 0.08);
        color: #f2c892;
        padding: 0.5rem 1rem;
        font-size: 0.68rem;
        font-weight: 500;
        text-transform: uppercase;
        width: fit-content;
      }

      #theme-ignai .section-eyebrow {
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        color: rgba(240, 203, 138, 0.78);
        letter-spacing: 0;
      }

      #theme-ignai .display-title {
        font-style: italic;
        color: white;
        font-size: 4.5rem;
        line-height: 0.96;
        letter-spacing: 0;
      }

      #theme-ignai .section-title {
        font-weight: 600;
        color: white;
        font-size: 3.8rem;
        line-height: 1.12;
        letter-spacing: 0;
      }

      #theme-ignai .section-lead {
        color: rgba(255, 255, 255, 0.88);
        font-size: 1.45rem;
        line-height: 1.55;
        letter-spacing: 0;
      }

      #theme-ignai .section-body {
        max-width: 520px;
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.64);
        line-height: 1.8;
      }

      @media (min-width: 640px) {
        #theme-ignai .section-body { font-size: 1.125rem; }
      }

      /* ===== Responsive Typography ===== */
      @media (max-width: 1023px) {
        #theme-ignai .display-title { font-size: 3.9rem; }
        #theme-ignai .section-title { font-size: 3.2rem; }
      }
      @media (max-width: 639px) {
        #theme-ignai .display-title { font-size: 3.1rem; }
        #theme-ignai .section-title { font-size: 2.55rem; }
        #theme-ignai .section-lead { font-size: 1.18rem; }
      }

      /* ===== Section Grid ===== */
      #theme-ignai .section-grid {
        display: grid;
        gap: 3rem;
      }
      @media (min-width: 1280px) {
        #theme-ignai .section-grid {
          grid-template-columns: 5fr 7fr;
          align-items: center;
          gap: 72px;
        }
      }

      #theme-ignai .section-grid-start {
        display: grid;
        gap: 3rem;
      }
      @media (min-width: 1280px) {
        #theme-ignai .section-grid-start {
          grid-template-columns: 5fr 7fr;
          gap: 72px;
        }
      }

      #theme-ignai .section-copy {
        position: sticky;
        top: 6rem;
        height: fit-content;
      }

      /* ===== Open Grid ===== */
      #theme-ignai .open-grid {
        display: grid;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      #theme-ignai .open-grid-item {
        min-height: 9rem;
        padding: 1.65rem 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      #theme-ignai .open-grid-item:first-child { border-top: 0; }

      @media (min-width: 768px) {
        #theme-ignai .open-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #theme-ignai .open-grid-item { padding: 2rem; }
        #theme-ignai .open-grid-item:nth-child(-n + 2) { border-top: 0; }
        #theme-ignai .open-grid-item:nth-child(odd) { padding-left: 0; }
        #theme-ignai .open-grid-item:nth-child(even) {
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding-right: 0;
        }
      }

      /* ===== Card Typography ===== */
      #theme-ignai .card-eyebrow {
        font-size: 0.7rem;
        font-weight: 500;
        text-transform: uppercase;
        color: rgba(240, 203, 138, 0.78);
        letter-spacing: 0;
      }
      #theme-ignai .card-title {
        margin-top: 1rem;
        font-size: 1.45rem;
        font-weight: 600;
        color: rgb(255, 255, 255);
        line-height: 1.32;
        letter-spacing: 0;
      }
      #theme-ignai .card-body {
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.64);
        line-height: 1.7;
      }

      /* ===== CTA Buttons ===== */
      #theme-ignai .ignai-cta-primary {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 216, 174, 0.4);
        background: linear-gradient(135deg, #ffb062 0%, #ff9a3c 34%, #ffc56b 100%);
        color: #111;
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        box-shadow: 0 20px 48px rgba(255, 122, 24, 0.28);
        transition: all 0.3s;
        overflow: hidden;
        text-decoration: none;
      }
      #theme-ignai .ignai-cta-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 26px 58px rgba(255, 122, 24, 0.34);
      }

      #theme-ignai .ignai-cta-secondary {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 184, 121, 0.16);
        background: rgba(12, 17, 24, 0.9);
        color: white;
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        transition: all 0.3s;
        text-decoration: none;
      }
      #theme-ignai .ignai-cta-secondary:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 184, 121, 0.3);
        background: #121823;
      }

      /* Button shine */
      #theme-ignai .button-shine::after {
        content: "";
        position: absolute;
        inset: -25% auto -25% -32%;
        width: 28%;
        transform: skewX(-24deg);
        background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.46) 50%, transparent 100%);
        transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      }
      #theme-ignai .button-shine:hover::after {
        transform: translateX(360%) skewX(-24deg);
      }

      /* ===== Ignite Field ===== */
      #theme-ignai .ignite-field {
        pointer-events: none;
        position: absolute;
        inset: 10% 0 0;
        opacity: 0.48;
        background:
          radial-gradient(ellipse at 24% 48%, rgba(255, 122, 24, 0.16), transparent 28%),
          radial-gradient(ellipse at 72% 44%, rgba(124, 200, 255, 0.1), transparent 24%);
        mix-blend-mode: screen;
        animation: ignite-breathe 14s ease-in-out infinite;
      }
      #theme-ignai .ignite-field::after {
        content: "";
        position: absolute;
        left: 18%;
        top: 34%;
        width: min(42vw, 34rem);
        aspect-ratio: 1;
        border: 1px solid rgba(255, 154, 60, 0.16);
        border-radius: 999px;
        transform: scale(0.72);
        animation: ignite-ring 9s ease-out infinite;
      }

      /* ===== Converge Field ===== */
      #theme-ignai .converge-field {
        pointer-events: none;
        position: absolute;
        inset: 0;
        overflow: hidden;
        opacity: 0.58;
        mix-blend-mode: screen;
      }
      #theme-ignai .converge-ray {
        position: absolute;
        left: -14%;
        top: var(--ray-y);
        width: 64%;
        height: 1px;
        transform-origin: right center;
        transform: rotate(var(--ray-rotate));
        background: linear-gradient(90deg, transparent, rgba(255,197,107,0.34), rgba(124,200,255,0.18), transparent);
        animation: converge-ray 9s ease-in-out infinite;
        animation-delay: var(--ray-delay);
      }

      /* ===== Energy Card ===== */
      #theme-ignai .energy-panel { position: relative; }
      #theme-ignai .energy-panel::before {
        content: "";
        position: absolute;
        inset: -1px;
        z-index: -1;
        border-radius: inherit;
        background: linear-gradient(115deg, rgba(255,122,24,0.35), rgba(255,197,107,0.08), rgba(124,200,255,0.28), rgba(255,122,24,0.35));
        background-size: 260% 260%;
        opacity: 0.55;
        animation: energy-border-flow 16s linear infinite;
      }

      #theme-ignai .energy-card {
        transition: filter 0.45s ease, transform 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
        animation: card-energy-pulse 10s ease-in-out infinite;
      }
      #theme-ignai .energy-card:hover {
        filter: brightness(1.08) contrast(1.04);
        transform: translateY(-4px);
        border-color: rgba(255,184,121,0.22);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 90px rgba(0,0,0,0.52), 0 0 42px rgba(255,122,24,0.12);
      }

      /* ===== Motion CTA ===== */
      #theme-ignai .motion-cta { animation: cta-heat 7s ease-in-out infinite; }

      /* ===== Slow Pan ===== */
      #theme-ignai .slow-pan { animation: slow-pan 18s ease-in-out infinite; }

      /* ===== Masks ===== */
      #theme-ignai .mask-radial { mask-image: radial-gradient(circle at center, black 45%, transparent 88%); }
      #theme-ignai .mask-top { mask-image: linear-gradient(180deg, transparent 0%, black 14%, black 100%); }
      #theme-ignai .mask-bottom { mask-image: linear-gradient(180deg, black 0%, black 72%, transparent 100%); }

      /* ===== Text Gradient ===== */
      #theme-ignai .text-gradient {
        background-image: var(--ignai-gradient-brand);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      /* ===== IGNAI Header ===== */
      #theme-ignai .ignai-header-nav a {
        color: rgba(255, 255, 255, 0.68);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;
      }
      #theme-ignai .ignai-header-nav a:hover { color: white; }

      /* ===== IGNAI Footer ===== */
      #theme-ignai .ignai-footer a {
        color: rgba(255, 255, 255, 0.56);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;
      }
      #theme-ignai .ignai-footer a:hover { color: white; }

      /* ===== Scrollbar hide ===== */
      #theme-ignai .recent-top-post-group::-webkit-scrollbar { display: none; }
      #theme-ignai .scroll-hidden::-webkit-scrollbar { display: none; }

      /* ===== Animations ===== */
      @keyframes ignite-breathe {
        0%, 100% { opacity: 0.48; transform: translate3d(0, 0, 0) scale(1); }
        45% { opacity: 0.78; transform: translate3d(1.4rem, -0.8rem, 0) scale(1.04); }
      }
      @keyframes ignite-ring {
        0% { opacity: 0; transform: scale(0.55); }
        16% { opacity: 0.55; }
        100% { opacity: 0; transform: scale(1.55); }
      }
      @keyframes energy-border-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 260% 50%; }
      }
      @keyframes card-energy-pulse {
        0%, 100% { filter: brightness(0.96) contrast(1); }
        46% { filter: brightness(1.06) contrast(1.03); }
      }
      @keyframes converge-ray {
        0%, 100% { opacity: 0; transform: translateX(-8%) rotate(var(--ray-rotate)) scaleX(0.54); }
        38% { opacity: 0.72; }
        70% { opacity: 0.2; transform: translateX(74%) rotate(var(--ray-rotate)) scaleX(0.94); }
      }
      @keyframes cta-heat {
        0%, 100% { filter: brightness(1); box-shadow: 0 20px 48px rgba(255, 122, 24, 0.28); }
        48% { filter: brightness(1.08); box-shadow: 0 24px 68px rgba(255, 122, 24, 0.42); }
      }
      @keyframes slow-pan {
        0%, 100% { transform: scale(1.01) translate3d(0, 0, 0); }
        50% { transform: scale(1.05) translate3d(-10px, -8px, 0); }
      }
      @keyframes float {
        0%, 100% { transform: translate3d(0, 0, 0); }
        50% { transform: translate3d(0, -12px, 0); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.55; transform: scale(0.98); }
        50% { opacity: 0.9; transform: scale(1.04); }
      }

      /* ===== Reduced Motion ===== */
      @media (prefers-reduced-motion: reduce) {
        #theme-ignai, #theme-ignai *, #theme-ignai *::before, #theme-ignai *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  )
}

export { Style }
