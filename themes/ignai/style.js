/* eslint-disable react/no-unknown-property */

/**
 * IGNAI 主题样式
 * 基于 proxio 骨架，爆改为 IGNAI 暗色品牌视觉系统
 */

const Style = () => {
  return (
    <style jsx global>{`
      /* ========== 基础底色 ========== */
      body {
        background-color: #07080c;
        color: #e4e4e7;
        font-family:
          'Noto Sans SC',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
      }
      .dark body {
        background-color: #07080c;
      }

      /* ========== IGNAI 品牌色 ========== */
      :root {
        --ignai-heat: #ff7a18;
        --ignai-signal: #5da9ff;
        --ignai-bg: #07080c;
        --ignai-card: #0d0e14;
        --ignai-border: rgba(255, 255, 255, 0.1);
        --ignai-text: #e4e4e7;
        --ignai-text-dim: rgba(255, 255, 255, 0.56);
      }

      #theme-proxio {
        --tw-bg-opacity: 1;
      }

      #theme-proxio .ignai-home-shell {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(
            circle at 16% 10%,
            rgba(255, 122, 24, 0.22),
            transparent 28%
          ),
          radial-gradient(
            circle at 84% 18%,
            rgba(93, 169, 255, 0.1),
            transparent 26%
          ),
          linear-gradient(180deg, #040507 0%, #07080c 38%, #090d14 100%);
      }

      #theme-proxio,
      #theme-proxio p,
      #theme-proxio a,
      #theme-proxio span,
      #theme-proxio li,
      #theme-proxio button,
      #theme-proxio input,
      #theme-proxio textarea {
        font-family:
          'Noto Sans SC',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
      }

      #theme-proxio .ignai-home-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding-left: 20px;
        padding-right: 20px;
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-home-container {
          padding-left: 32px;
          padding-right: 32px;
        }
      }

      #theme-proxio .ignai-home-section {
        position: relative;
        z-index: 10;
        padding-top: 96px;
        padding-bottom: 96px;
      }

      @media (min-width: 1024px) {
        #theme-proxio .ignai-home-section {
          padding-top: 120px;
          padding-bottom: 120px;
        }
      }

      #theme-proxio .ignai-hero-section {
        position: relative;
        min-height: auto;
        overflow: hidden;
        padding-top: 80px;
        padding-bottom: 48px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-hero-section {
          padding-top: 100px;
          padding-bottom: 64px;
        }
      }

      @media (min-width: 1024px) {
        #theme-proxio .ignai-hero-section {
          min-height: 880px;
          padding-top: 44px;
        }
      }

      /* 移动端隐藏 Hero 视觉面板，只保留文案 */
      @media (max-width: 767px) {
        #theme-proxio .ignai-home-visual {
          display: none;
        }
        #theme-proxio .ignai-hero-grid {
          min-height: auto;
        }
        #theme-proxio .ignai-scroll-hint {
          display: none;
        }
      }

      #theme-proxio .ignai-hero-grid {
        min-height: calc(100vh - 112px);
        align-items: center;
      }

      @media (min-width: 1024px) {
        #theme-proxio .ignai-hero-grid {
          min-height: 760px;
        }
      }

      #theme-proxio .ignai-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: linear-gradient(135deg, #ffb062 0%, #7cc8ff 100%);
        box-shadow: 0 0 18px rgba(255, 154, 60, 0.5);
      }

      #theme-proxio .ignai-hero-image {
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
        animation: ignai-slow-pan 18s ease-in-out infinite;
      }

      #theme-proxio .ignai-hero-image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(5, 8, 12, 0.12) 0%,
          rgba(5, 8, 12, 0.18) 28%,
          rgba(5, 8, 12, 0.82) 100%
        );
      }

      #theme-proxio .ignai-hero-badge {
        position: absolute;
        left: 20px;
        top: 20px;
        border-radius: 999px;
        border: 1px solid rgba(124, 200, 255, 0.2);
        background: rgba(8, 19, 30, 0.7);
        color: #9aceff;
        padding: 6px 12px;
        font-size: 0.68rem;
        text-transform: uppercase;
      }

      #theme-proxio .ignai-hero-caption {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        padding: 20px 20px 24px;
        color: #fff;
        font-size: 1.45rem;
        font-weight: 600;
        line-height: 1.32;
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-hero-caption {
          font-size: 2rem;
          padding: 24px;
        }
      }


      #theme-proxio .converge-field {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }

      /* ========== 容器 ========== */
      #theme-proxio .container {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding-right: 20px;
        padding-left: 20px;
      }
      @media (min-width: 540px) {
        #theme-proxio .container {
          max-width: 540px;
        }
      }
      @media (min-width: 720px) {
        #theme-proxio .container {
          max-width: 720px;
        }
      }
      @media (min-width: 960px) {
        #theme-proxio .container {
          max-width: 960px;
        }
      }
      @media (min-width: 1140px) {
        #theme-proxio .container {
          max-width: 1140px;
        }
      }
      @media (min-width: 1536px) {
        #theme-proxio .container {
          max-width: 1200px;
        }
      }

      /* ========== 导航栏 ========== */
      #theme-proxio .ud-header {
        background: rgba(7, 8, 12, 0.72);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      #theme-proxio .ud-header.sticky {
        background: rgba(7, 8, 12, 0.92);
      }

      #theme-proxio .ignai-header-shell {
        min-height: 64px;
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-header-shell {
          min-height: 92px;
        }
      }

      #theme-proxio .navbar-logo span,
      #theme-proxio .section-eyebrow,
      #theme-proxio .card-eyebrow {
        letter-spacing: 0.03em;
      }

      #theme-proxio .ignai-header-logo {
        display: block;
        width: auto;
        height: 26px;
        object-fit: contain;
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-header-logo {
          height: 30px;
        }
      }

      /* ========== IGNAI Hero ========== */
      #theme-proxio .ignai-hero {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        background: linear-gradient(
          180deg,
          #06080c 0%,
          #090b10 56%,
          #06080c 100%
        );
      }
      #theme-proxio .ignai-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            circle at 16% 18%,
            rgba(255, 122, 24, 0.18),
            transparent 32%
          ),
          radial-gradient(
            circle at 84% 16%,
            rgba(93, 169, 255, 0.1),
            transparent 26%
          );
        pointer-events: none;
      }

      /* Ignite field 粒子背景 */
      #theme-proxio .ignai-hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            1.5px 1.5px at 20% 30%,
            rgba(255, 160, 60, 0.4),
            transparent
          ),
          radial-gradient(
            1px 1px at 40% 15%,
            rgba(255, 180, 80, 0.3),
            transparent
          ),
          radial-gradient(
            1px 1px at 60% 25%,
            rgba(255, 200, 100, 0.2),
            transparent
          ),
          radial-gradient(
            1.5px 1.5px at 80% 20%,
            rgba(93, 169, 255, 0.3),
            transparent
          ),
          radial-gradient(
            1px 1px at 15% 60%,
            rgba(255, 160, 60, 0.2),
            transparent
          ),
          radial-gradient(
            1px 1px at 75% 70%,
            rgba(93, 169, 255, 0.2),
            transparent
          );
        animation: ignai-float 8s ease-in-out infinite;
        pointer-events: none;
      }

      #theme-proxio .ignai-hero-section::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            circle at 16% 18%,
            rgba(255, 122, 24, 0.18),
            transparent 32%
          ),
          radial-gradient(
            circle at 84% 16%,
            rgba(93, 169, 255, 0.1),
            transparent 26%
          );
        pointer-events: none;
      }

      #theme-proxio .ignai-hero-section::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            1.5px 1.5px at 20% 30%,
            rgba(255, 160, 60, 0.4),
            transparent
          ),
          radial-gradient(
            1px 1px at 40% 15%,
            rgba(255, 180, 80, 0.3),
            transparent
          ),
          radial-gradient(
            1px 1px at 60% 25%,
            rgba(255, 200, 100, 0.2),
            transparent
          ),
          radial-gradient(
            1.5px 1.5px at 80% 20%,
            rgba(93, 169, 255, 0.3),
            transparent
          ),
          radial-gradient(
            1px 1px at 15% 60%,
            rgba(255, 160, 60, 0.2),
            transparent
          ),
          radial-gradient(
            1px 1px at 75% 70%,
            rgba(93, 169, 255, 0.2),
            transparent
          );
        animation: ignai-float 8s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes ignai-float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-12px);
        }
      }

      @keyframes ignai-slow-pan {
        0%,
        100% {
          transform: scale(1.01) translate3d(0, 0, 0);
        }
        50% {
          transform: scale(1.06) translate3d(0, -10px, 0);
        }
      }

      /* ========== v1.0.0 动效迁移：关键帧动画库 ========== */

      @keyframes ignai-pulse-glow {
        0%,
        100% {
          opacity: 0.55;
          transform: scale(0.98);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.04);
        }
      }

      @keyframes ignai-drift-x {
        0%,
        100% {
          transform: translate3d(0, 0, 0);
        }
        50% {
          transform: translate3d(24px, -6px, 0);
        }
      }

      @keyframes ignai-drift-rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes ignai-ambient-fade {
        0%,
        100% {
          opacity: 0.2;
        }
        50% {
          opacity: 0.5;
        }
      }

      @keyframes ignai-ignite-breathe {
        0%,
        100% {
          opacity: 0.48;
          transform: translate3d(0, 0, 0) scale(1);
        }
        45% {
          opacity: 0.78;
          transform: translate3d(1.4rem, -0.8rem, 0) scale(1.04);
        }
      }

      @keyframes ignai-ignite-ring {
        0% {
          opacity: 0;
          transform: scale(0.55);
        }
        16% {
          opacity: 0.55;
        }
        100% {
          opacity: 0;
          transform: scale(1.55);
        }
      }

      @keyframes ignai-cta-heat {
        0%,
        100% {
          filter: brightness(1);
          box-shadow: 0 20px 48px rgba(255, 122, 24, 0.28);
        }
        48% {
          filter: brightness(1.08);
          box-shadow: 0 24px 68px rgba(255, 122, 24, 0.42);
        }
      }

      /* ========== 动效 Utility Classes ========== */

      #theme-proxio .ignai-float-slow {
        animation: ignai-float 9s ease-in-out infinite;
      }
      #theme-proxio .ignai-float-delayed {
        animation: ignai-float 11s ease-in-out 1.4s infinite;
      }
      #theme-proxio .ignai-pulse-glow {
        animation: ignai-pulse-glow 7s ease-in-out infinite;
      }
      #theme-proxio .ignai-drift-x {
        animation: ignai-drift-x 18s ease-in-out infinite;
      }
      #theme-proxio .ignai-drift-rotate {
        animation: ignai-drift-rotate 24s linear infinite;
      }
      #theme-proxio .ignai-ambient-fade {
        animation: ignai-ambient-fade 12s ease-in-out infinite;
      }
      #theme-proxio .ignai-motion-cta {
        animation: ignai-cta-heat 7s ease-in-out infinite;
      }
      #theme-proxio .ignai-ignite-field {
        pointer-events: none;
        position: absolute;
        opacity: 0.48;
        background:
          radial-gradient(ellipse at 24% 48%, rgba(255, 122, 24, 0.16), transparent 28%),
          radial-gradient(ellipse at 72% 44%, rgba(124, 200, 255, 0.1), transparent 24%);
        mix-blend-mode: screen;
        animation: ignai-ignite-breathe 14s ease-in-out infinite;
      }

      /* ========== v1.0.0 动效迁移：渐变标题 ========== */

      @keyframes ignai-gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      #theme-proxio .ignai-gradient-title {
        background: linear-gradient(
          120deg,
          #fff 0%,
          #ffd09a 25%,
          #fff 50%,
          #9aceff 75%,
          #fff 100%
        );
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: ignai-gradient-shift 8s ease-in-out infinite;
      }

      /* ========== 卡片边框发光动画 ========== */

      @keyframes ignai-card-border-glow {
        0% {
          border-image-source: linear-gradient(
            135deg,
            rgba(255, 184, 121, 0) 0%,
            rgba(255, 122, 24, 0.3) 50%,
            rgba(93, 169, 255, 0) 100%
          );
        }
        50% {
          border-image-source: linear-gradient(
            135deg,
            rgba(93, 169, 255, 0) 0%,
            rgba(93, 169, 255, 0.3) 50%,
            rgba(255, 184, 121, 0) 100%
          );
        }
        100% {
          border-image-source: linear-gradient(
            135deg,
            rgba(255, 184, 121, 0) 0%,
            rgba(255, 122, 24, 0.3) 50%,
            rgba(93, 169, 255, 0) 100%
          );
        }
      }

      /* ========== 浮动装饰球体 ========== */

      @keyframes ignai-orb-drift-1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -40px) scale(1.1); }
        50% { transform: translate(-20px, -60px) scale(0.95); }
        75% { transform: translate(-40px, -20px) scale(1.05); }
      }

      @keyframes ignai-orb-drift-2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-25px, 35px) scale(1.05); }
        50% { transform: translate(35px, 15px) scale(0.9); }
        75% { transform: translate(15px, -25px) scale(1.1); }
      }

      #theme-proxio .ignai-ambient-orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(60px);
        mix-blend-mode: screen;
      }

      #theme-proxio .ignai-orb-heat {
        background: radial-gradient(circle, rgba(255, 122, 24, 0.18), transparent 70%);
        animation: ignai-orb-drift-1 20s ease-in-out infinite;
      }

      #theme-proxio .ignai-orb-signal {
        background: radial-gradient(circle, rgba(93, 169, 255, 0.12), transparent 70%);
        animation: ignai-orb-drift-2 24s ease-in-out infinite;
      }

      /* ========== Section 动态分割线 ========== */

      @keyframes ignai-divider-flow {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      #theme-proxio .ignai-section-divider {
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 122, 24, 0.2) 20%,
          rgba(255, 184, 121, 0.4) 50%,
          rgba(93, 169, 255, 0.2) 80%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: ignai-divider-flow 6s linear infinite;
      }

      /* ========== 卡片 hover 增强发光 ========== */

      #theme-proxio .ignai-unified-card:hover,
      #theme-proxio .open-grid-item:hover {
        transform: translateY(-6px) scale(1.01);
        border-color: rgba(255, 184, 121, 0.24);
        background: linear-gradient(
          180deg,
          rgba(16, 20, 28, 0.96) 0%,
          rgba(12, 15, 22, 0.94) 100%
        );
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          0 0 40px rgba(255, 122, 24, 0.08),
          0 32px 100px rgba(0, 0, 0, 0.44);
      }

      /* ========== Eyebrow 脉冲发光 ========== */

      @keyframes ignai-eyebrow-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(255, 154, 60, 0);
        }
        50% {
          box-shadow: 0 0 16px 2px rgba(255, 154, 60, 0.12);
        }
      }

      #theme-proxio .eyebrow-label {
        animation: ignai-eyebrow-pulse 5s ease-in-out infinite;
      }

      /* ========== Section 背景氛围层 ========== */

      #theme-proxio .ignai-section-atmosphere {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      #theme-proxio .ignai-section-atmosphere::before {
        content: '';
        position: absolute;
        width: 120%;
        height: 120%;
        top: -10%;
        left: -10%;
        background:
          radial-gradient(ellipse at 30% 50%, rgba(255, 122, 24, 0.04), transparent 50%),
          radial-gradient(ellipse at 70% 50%, rgba(93, 169, 255, 0.03), transparent 50%);
        animation: ignai-drift-x 30s ease-in-out infinite;
      }

      /* ========== 标题逐字渐显 ========== */

      @keyframes ignai-char-reveal {
        0% {
          opacity: 0;
          transform: translateY(8px);
          filter: blur(4px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }

      #theme-proxio .ignai-char-animate span {
        display: inline-block;
        opacity: 0;
        animation: ignai-char-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      /* ========== 图片缩放 hover 增强 ========== */

      #theme-proxio .ignai-event-card img,
      #theme-proxio .ignai-record-card img {
        transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      #theme-proxio .ignai-event-card:hover img,
      #theme-proxio .ignai-record-card:hover img {
        transform: scale(1.06);
      }

      /* ========== 品牌标签 hover 发光 ========== */

      #theme-proxio .ignai-badge {
        transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
      }

      #theme-proxio .ignai-badge:hover {
        border-color: rgba(255, 183, 121, 0.32);
        background: rgba(255, 154, 60, 0.12);
        box-shadow: 0 0 20px rgba(255, 154, 60, 0.08);
      }

      /* ========== Scroll indicator ========== */

      @keyframes ignai-scroll-bounce {
        0%, 100% { transform: translateY(0); opacity: 0.6; }
        50% { transform: translateY(8px); opacity: 1; }
      }

      #theme-proxio .ignai-scroll-hint {
        position: absolute;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        animation: ignai-scroll-bounce 2.5s ease-in-out infinite;
        pointer-events: none;
      }

      #theme-proxio .ignai-scroll-hint svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
      }

      /* ========== prefers-reduced-motion 全局禁用 ========== */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Eyebrow 标签 */
      #theme-proxio .ignai-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 100px;
        border: 1px solid rgba(255, 183, 121, 0.2);
        background: rgba(255, 154, 60, 0.08);
        color: #f2c892;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      /* Display 标题 */
      #theme-proxio .ignai-display-title {
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.1;
        color: #fff;
        letter-spacing: -0.02em;
      }
      @media (min-width: 640px) {
        #theme-proxio .ignai-display-title {
          font-size: 4rem;
        }
      }
      @media (min-width: 1024px) {
        #theme-proxio .ignai-display-title {
          font-size: 5.6rem;
        }
      }

      /* Section eyebrow */
      #theme-proxio .ignai-section-eyebrow {
        font-size: 0.8rem;
        color: #f0d48d;
        opacity: 0.84;
        letter-spacing: 0.04em;
      }

      /* Section lead */
      #theme-proxio .ignai-section-lead {
        font-size: 1.125rem;
        line-height: 1.6;
        color: #e4e4e7;
      }

      /* Section body */
      #theme-proxio .ignai-section-body {
        font-size: 0.9375rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.72);
      }

      #theme-proxio .display-title,
      #theme-proxio .section-title,
      #theme-proxio .card-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        letter-spacing: 0;
      }

      #theme-proxio .display-title {
        font-size: clamp(3rem, 8vw, 5.6rem);
        font-weight: 600;
        line-height: 0.98;
        color: #fff;
      }

      #theme-proxio .section-title {
        font-size: clamp(2.2rem, 5vw, 4rem);
        font-weight: 600;
        line-height: 1.02;
        color: #fff;
      }

      #theme-proxio .section-copy {
        max-width: 34rem;
      }

      #theme-proxio .section-eyebrow {
        color: #f0d48d;
        opacity: 0.84;
        font-size: 0.8rem;
        text-transform: uppercase;
      }

      #theme-proxio .section-lead {
        font-size: clamp(1.06rem, 2vw, 1.22rem);
        line-height: 1.62;
        color: rgba(255, 255, 255, 0.9);
      }

      #theme-proxio .section-body,
      #theme-proxio .card-body {
        font-size: 0.95rem;
        line-height: 1.9;
        color: rgba(255, 255, 255, 0.64);
      }

      #theme-proxio .card-title {
        margin-top: 14px;
        font-size: clamp(1.8rem, 3vw, 2.18rem);
        font-weight: 600;
        line-height: 1.02;
        color: #fff;
      }

      #theme-proxio .card-eyebrow {
        font-size: 0.74rem;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.62);
      }

      #theme-proxio .eyebrow-label {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 183, 121, 0.18);
        background: rgba(255, 154, 60, 0.08);
        padding: 7px 14px;
        font-size: 0.74rem;
        text-transform: uppercase;
        color: #f2c892;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
      }

      #theme-proxio .section-grid,
      #theme-proxio .section-grid-start {
        position: relative;
        z-index: 1;
        display: grid;
        gap: 48px;
      }

      @media (min-width: 1024px) {
        #theme-proxio .section-grid,
        #theme-proxio .section-grid-start {
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 72px;
        }
      }

      #theme-proxio .open-grid {
        display: grid;
        gap: 18px;
      }

      @media (min-width: 640px) {
        #theme-proxio .open-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      #theme-proxio .open-grid-item,
      #theme-proxio .ignai-unified-card {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(
          180deg,
          rgba(14, 18, 26, 0.94) 0%,
          rgba(10, 13, 20, 0.92) 100%
        );
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.02),
          0 24px 70px rgba(0, 0, 0, 0.34);
        transition:
          transform 280ms ease,
          border-color 280ms ease,
          background 280ms ease,
          box-shadow 280ms ease;
      }

      #theme-proxio .open-grid-item {
        padding: 28px;
      }

      #theme-proxio .ignai-unified-card:hover,
      #theme-proxio .open-grid-item:hover {
        transform: translateY(-4px);
        border-color: rgba(255, 184, 121, 0.2);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.03),
          0 30px 90px rgba(0, 0, 0, 0.42);
      }

      #theme-proxio .ignai-unified-panel {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(
          180deg,
          rgba(11, 14, 20, 0.9) 0%,
          rgba(7, 9, 14, 0.88) 100%
        );
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.03),
          0 28px 80px rgba(0, 0, 0, 0.38);
      }

      #theme-proxio .ignai-event-card,
      #theme-proxio .ignai-record-card {
        background: linear-gradient(
          180deg,
          rgba(11, 14, 20, 0.92) 0%,
          rgba(8, 11, 17, 0.96) 100%
        );
      }


      /* ========== IGNAI CTA 按钮 ========== */
      #theme-proxio .ignai-cta-primary {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 32px;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          rgba(255, 122, 24, 0.98) 0%,
          rgba(255, 154, 60, 0.92) 100%
        );
        color: #fff;
        font-weight: 600;
        font-size: 0.9375rem;
        overflow: hidden;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        box-shadow: 0 8px 32px rgba(255, 122, 24, 0.2);
      }
      #theme-proxio .ignai-cta-primary::after {
        content: '';
        position: absolute;
        inset: -25% auto -25% -32%;
        width: 28%;
        transform: skewX(-24deg);
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(255, 255, 255, 0.08) 20%,
          rgba(255, 255, 255, 0.46) 50%,
          transparent 100%
        );
        transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      }
      #theme-proxio .ignai-cta-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 40px rgba(255, 122, 24, 0.32);
      }
      #theme-proxio .ignai-cta-primary:hover::after {
        transform: translateX(360%) skewX(-24deg);
      }

      #theme-proxio .ignai-cta-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 32px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(255, 255, 255, 0.04);
        color: #e4e4e7;
        font-weight: 500;
        font-size: 0.9375rem;
        transition:
          border-color 0.2s,
          background 0.2s;
      }
      #theme-proxio .ignai-cta-secondary:hover {
        border-color: rgba(255, 183, 121, 0.32);
        background: rgba(255, 255, 255, 0.06);
      }

      /* ========== Signal 卡片网格 ========== */
      #theme-proxio .ignai-signal-grid {
        display: grid;
        gap: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px 0;
      }
      @media (min-width: 640px) {
        #theme-proxio .ignai-signal-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        #theme-proxio .ignai-signal-grid > div:not(:first-child) {
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding-left: 24px;
        }
      }

      /* ========== Converge rays (Join 区动画) ========== */
      @keyframes ignai-converge-ray {
        0% {
          transform: translateX(-100%) rotate(var(--ray-rotate, 0deg));
          opacity: 0;
        }
        30% {
          opacity: 0.6;
        }
        100% {
          transform: translateX(200%) rotate(var(--ray-rotate, 0deg));
          opacity: 0;
        }
      }
      #theme-proxio .converge-ray {
        position: absolute;
        top: var(--ray-y, 30%);
        left: -20%;
        width: 60%;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 122, 24, 0.3),
          transparent
        );
        animation: ignai-converge-ray 4s ease-in-out infinite;
        animation-delay: var(--ray-delay, 0s);
        pointer-events: none;
      }

      /* ========== Footer ========== */
      #theme-proxio .ignai-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: #07080c;
      }

      /* ========== 移动端汉堡菜单动画 ========== */
      #theme-proxio .ignai-hamburger {
        position: relative;
        width: 30px;
        height: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      #theme-proxio .ignai-hamburger span {
        display: block;
        height: 2px;
        width: 100%;
        background: #fff;
        border-radius: 2px;
        transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
        transform-origin: center;
      }

      #theme-proxio .ignai-hamburger--open span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }

      #theme-proxio .ignai-hamburger--open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      #theme-proxio .ignai-hamburger--open span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }

      /* 移动端菜单面板动画 */
      #theme-proxio .ignai-mobile-menu {
        transform-origin: top right;
        transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      }

      #theme-proxio .ignai-mobile-menu--hidden {
        opacity: 0;
        transform: scale(0.95) translateY(-8px);
        pointer-events: none;
      }

      #theme-proxio .ignai-mobile-menu--visible {
        opacity: 1;
        transform: scale(1) translateY(0);
      }

      /* ========== 品牌滚动条 ========== */
      #theme-proxio .ignai-brand-scroll {
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(13, 14, 20, 0.6);
      }

      /* ========== 暗色覆盖 ========== */
      .dark\:bg-dark:is(.dark *) {
        background-color: #07080c !important;
      }
      .dark\:bg-dark-2:is(.dark *) {
        background-color: #0d0e14 !important;
      }
      .dark\:bg-dark-1:is(.dark *) {
        background-color: #13141c !important;
      }
      .dark\:text-dark-6 {
        color: rgba(255, 255, 255, 0.56) !important;
      }
      .dark\:text-white {
        color: #e4e4e7 !important;
      }

      /* ========== Back to Top ========== */
      #theme-proxio .back-to-top {
        background: linear-gradient(135deg, #ff7a18, #ff9a3c) !important;
      }

      /* ========== Carousel ========== */
      .common-carousel .swiper-button-next:after,
      .common-carousel .swiper-button-prev:after {
        display: none;
      }
      .common-carousel .swiper-button-next,
      .common-carousel .swiper-button-prev {
        position: static !important;
        margin: 0;
        height: 3rem;
        width: 3rem;
        border-radius: 0.5rem;
        background-color: rgba(13, 14, 20, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #e4e4e7;
        transition: all 0.2s;
      }
      .common-carousel .swiper-button-next:hover,
      .common-carousel .swiper-button-prev:hover {
        background: linear-gradient(135deg, #ff7a18, #ff9a3c);
        border-color: transparent;
        color: #fff;
      }

      /* ========== 全局链接 ========== */
      #theme-proxio a {
        color: inherit;
      }
      #theme-proxio a:hover {
        color: var(--ignai-heat, #ff7a18);
      }

      /* ========== 品牌标签 ========== */
      #theme-proxio .ignai-badge {
        padding: 4px 12px;
        border-radius: 100px;
        border: 1px solid rgba(255, 183, 121, 0.16);
        background: rgba(255, 154, 60, 0.06);
        color: #f0d48d;
        font-size: 0.8rem;
        display: inline-block;
      }

      /* ========== 轨道成员环 ========== */
      .avatar-scatter-container {
        position: relative;
        max-width: 100%;
        margin: 0 auto;
        user-select: none;
        overflow: hidden;
      }

      @media (max-width: 640px) {
        .avatar-scatter-container {
          max-height: 360px;
          border-radius: 16px;
        }
      }

      .avatar-scatter-item {
        position: absolute;
        transform: translate(-50%, -50%);
        cursor: pointer;
        will-change: transform;
      }

      .avatar-scatter-item--featured {
        z-index: 5;
      }

      .avatar-scatter-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid rgba(255,255,255,0.1);
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
        background: #0d0e14;
        display: block;
      }

      .avatar-scatter-img--active {
        border-color: #ff7a18;
        box-shadow: 0 0 20px rgba(255,122,24,0.6), 0 0 40px rgba(255,122,24,0.2);
      }

      .avatar-scatter-img--featured {
        border-color: rgba(255,183,121,0.25);
        box-shadow: 0 0 12px rgba(255,122,24,0.15);
      }

      /* 预览卡片 */
      .avatar-preview-card {
        position: absolute;
        transform: translate(-50%, calc(-100% - 20px));
        width: min(260px, 80vw);
        z-index: 60;
        pointer-events: none;
      }

      .avatar-preview-card-inner {
        padding: 14px 16px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(160deg, rgba(14,17,24,0.97) 0%, rgba(8,10,16,0.95) 100%);
        box-shadow:
          0 2px 8px rgba(0,0,0,0.3),
          0 16px 48px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.04);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
    `}</style>
  )
}

export { Style }
