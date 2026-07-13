/* eslint-disable react/no-unknown-property */

/**
 * IGNAI 主题样式
 * 基于 proxio 骨架，爆改为 IGNAI 暗色品牌视觉系统
 */

const ignaiThemeCss = `
      /* ========== 基础底色 ========== */
      body {
        background-color: var(--ignai-bg, #07080c);
        color: var(--ignai-text, #e4e4e7);
        font-family:
          'Noto Sans SC',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
      }
      .dark body {
        background-color: var(--ignai-bg, #07080c);
      }
      .light body {
        background-color: var(--ignai-bg, #fff8ef);
      }

      /* ========== IGNAI 品牌色 ========== */
      html.dark,
      :root {
        color-scheme: dark;
        --ignai-heat: #ff7a18;
        --ignai-signal: #5da9ff;
        --ignai-bg: #07080c;
        --ignai-card: #0d0e14;
        --ignai-card-strong: rgba(10, 12, 18, 0.94);
        --ignai-border: rgba(255, 255, 255, 0.1);
        --ignai-text: #e4e4e7;
        --ignai-text-dim: rgba(255, 255, 255, 0.56);
        --ignai-text-soft: rgba(255, 255, 255, 0.72);
        --ignai-header-bg: linear-gradient(90deg, rgba(18, 12, 12, 0.9) 0%, rgba(10, 12, 18, 0.9) 58%, rgba(6, 12, 20, 0.92) 100%);
        --ignai-header-bg-sticky: linear-gradient(90deg, rgba(18, 12, 12, 0.96) 0%, rgba(10, 12, 18, 0.96) 58%, rgba(6, 12, 20, 0.97) 100%);
        --ignai-header-border: rgba(171, 111, 71, 0.16);
        --ignai-nav-text: rgba(255, 255, 255, 0.68);
        --ignai-nav-hover: rgba(255, 255, 255, 0.96);
        --ignai-dropdown-bg: rgba(13, 14, 20, 0.97);
        --ignai-dropdown-hover: rgba(255, 255, 255, 0.05);
        --ignai-mobile-backdrop: linear-gradient(180deg, rgba(7, 8, 12, 0.16) 0%, rgba(7, 8, 12, 0.42) 100%);
        --ignai-page-grid: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
        --ignai-background-field: radial-gradient(ellipse at 16% 10%, rgba(255,122,24,0.14), transparent 32%), radial-gradient(ellipse at 84% 16%, rgba(93,169,255,0.08), transparent 28%);
        --ignai-home-bg: radial-gradient(circle at 16% 10%, rgba(255, 122, 24, 0.22), transparent 28%), radial-gradient(circle at 84% 18%, rgba(93, 169, 255, 0.1), transparent 26%), linear-gradient(180deg, #040507 0%, #07080c 38%, #090d14 100%);
        --rig-heat: oklch(0.6329 0.2075 31.49);
        --rig-heat-glow: oklch(0.6329 0.2075 31.49 / 42%);
        --rig-signal: oklch(0.5312 0.2603 266.77);
        --rig-ink: oklch(0.1448 0 0);
        --rig-paper: oklch(0.9465 0.0099 87.47);
        --rig-paper-70: rgba(240, 237, 230, 0.7);
        --rig-paper-50: rgba(240, 237, 230, 0.5);
        --rig-paper-45: rgba(240, 237, 230, 0.45);
        --rig-paper-35: rgba(240, 237, 230, 0.35);
        --rig-paper-15: rgba(240, 237, 230, 0.15);
        --rig-paper-06: rgba(240, 237, 230, 0.06);
        --rig-border: oklch(0.9465 0.0099 87.47 / 14%);
        --rig-section-bg: transparent;
        --rig-card-bg: rgba(240, 237, 230, 0.06);
        --rig-card-hover-bg: rgba(240, 237, 230, 0.1);
        --rig-terminal-bg: rgba(10,10,10,0.7);
        --rig-hero-bg: radial-gradient(circle at 18% 12%, rgba(255,122,24,0.22), transparent 30%), radial-gradient(circle at 78% 18%, rgba(93,169,255,0.12), transparent 32%), linear-gradient(135deg, #07080c 0%, #111015 54%, #050608 100%);
        --rig-hero-artwash: linear-gradient(90deg, rgba(255,122,24,0.12), transparent 42%);
        --rig-hero-title: var(--rig-paper);
        --rig-hero-copy: var(--rig-paper-70);
        --rig-hero-visual-bg: rgba(6, 8, 12, 0.58);
        --rig-btn-primary-bg: linear-gradient(135deg, #ff7a18 0%, #ff9a3c 100%);
        --rig-btn-primary-text: #130c08;
        --rig-btn-outline-text: var(--rig-paper);
        --rig-btn-outline-border: rgba(240, 237, 230, 0.28);
        --rig-btn-outline-bg: rgba(240, 237, 230, 0.04);
        --rig-footer-bg: #050608;
        --rig-footer-text: var(--rig-paper-70);
        --rig-chamfer: 14px;
        --rig-max-w: 1200px;
      }

      html.light {
        color-scheme: light;
        --ignai-heat: #f05a1a;
        --ignai-signal: #2457d6;
        --ignai-bg: #fff7ec;
        --ignai-card: #fffaf4;
        --ignai-card-strong: rgba(255, 251, 244, 0.96);
        --ignai-border: rgba(126, 71, 34, 0.16);
        --ignai-text: #19130e;
        --ignai-text-dim: rgba(34, 24, 16, 0.66);
        --ignai-text-soft: rgba(34, 24, 16, 0.78);
        --ignai-header-bg: linear-gradient(90deg, rgba(255, 250, 242, 0.9) 0%, rgba(255, 245, 232, 0.88) 54%, rgba(255, 239, 222, 0.9) 100%);
        --ignai-header-bg-sticky: linear-gradient(90deg, rgba(255, 250, 242, 0.96) 0%, rgba(255, 245, 232, 0.96) 54%, rgba(255, 239, 222, 0.97) 100%);
        --ignai-header-border: rgba(180, 91, 33, 0.18);
        --ignai-nav-text: rgba(39, 26, 16, 0.68);
        --ignai-nav-hover: rgba(22, 15, 9, 0.96);
        --ignai-dropdown-bg: rgba(255, 250, 242, 0.97);
        --ignai-dropdown-hover: rgba(235, 93, 22, 0.08);
        --ignai-mobile-backdrop: linear-gradient(180deg, rgba(255, 248, 239, 0.32) 0%, rgba(91, 50, 21, 0.18) 100%);
        --ignai-page-grid: linear-gradient(rgba(132,74,38,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(132,74,38,0.09) 1px, transparent 1px);
        --ignai-background-field: radial-gradient(ellipse at 16% 10%, rgba(255,122,24,0.16), transparent 32%), radial-gradient(ellipse at 84% 16%, rgba(43,79,255,0.08), transparent 28%);
        --ignai-home-bg: radial-gradient(circle at 16% 10%, rgba(255, 122, 24, 0.16), transparent 30%), radial-gradient(circle at 84% 18%, rgba(43, 79, 255, 0.08), transparent 26%), linear-gradient(180deg, #fff8ef 0%, #fff4e8 44%, #fffaf4 100%);
        --rig-heat: #ff5f1f;
        --rig-heat-glow: rgba(255, 95, 31, 0.28);
        --rig-signal: #2b4fff;
        --rig-ink: #17100b;
        --rig-paper: #20150e;
        --rig-paper-70: rgba(32, 21, 14, 0.72);
        --rig-paper-50: rgba(32, 21, 14, 0.54);
        --rig-paper-45: rgba(32, 21, 14, 0.5);
        --rig-paper-35: rgba(32, 21, 14, 0.38);
        --rig-paper-15: rgba(32, 21, 14, 0.14);
        --rig-paper-06: rgba(32, 21, 14, 0.06);
        --rig-border: rgba(145, 76, 31, 0.18);
        --rig-section-bg: transparent;
        --rig-card-bg: rgba(255, 250, 242, 0.86);
        --rig-card-hover-bg: rgba(255, 252, 246, 0.96);
        --rig-terminal-bg: rgba(30, 20, 13, 0.08);
        --rig-hero-bg: radial-gradient(circle at 18% 16%, rgba(255, 122, 24, 0.16), transparent 32%), radial-gradient(circle at 78% 18%, rgba(255, 164, 92, 0.12), transparent 30%), linear-gradient(135deg, #fff8ef 0%, #fff0df 54%, #ffe3cc 100%);
        --rig-hero-artwash: linear-gradient(90deg, rgba(255,138,24,0.1), transparent 42%);
        --rig-hero-title: #190e08;
        --rig-hero-copy: rgba(25, 14, 8, 0.78);
        --rig-hero-visual-bg: rgba(255, 244, 232, 0.28);
        --rig-btn-primary-bg: #17100b;
        --rig-btn-primary-text: #fff8ef;
        --rig-btn-outline-text: #190e08;
        --rig-btn-outline-border: rgba(25, 14, 8, 0.28);
        --rig-btn-outline-bg: rgba(255, 255, 255, 0.18);
        --rig-footer-bg: #19110c;
        --rig-footer-text: rgba(255, 248, 239, 0.72);
      }

      html.light #theme-proxio {
        --ignai-card-text: #20150e;
        --ignai-card-muted: rgba(32, 21, 14, 0.7);
        --ignai-card-faint: rgba(32, 21, 14, 0.56);
        --ignai-chip-bg: rgba(255, 255, 255, 0.68);
        --ignai-chip-border: rgba(145, 76, 31, 0.16);
        --ignai-chip-text: rgba(32, 21, 14, 0.68);
      }

      html.dark #theme-proxio,
      :root #theme-proxio {
        --ignai-card-text: var(--rig-paper);
        --ignai-card-muted: var(--rig-paper-70);
        --ignai-card-faint: var(--rig-paper-50);
        --ignai-chip-bg: rgba(255, 255, 255, 0.05);
        --ignai-chip-border: rgba(255, 255, 255, 0.1);
        --ignai-chip-text: rgba(255, 255, 255, 0.58);
      }

      #theme-proxio {
        --tw-bg-opacity: 1;
        background: var(--ignai-bg);
        color: var(--ignai-text);
      }

      #theme-proxio .ignai-home-shell {
        position: relative;
        overflow: hidden;
        background: var(--ignai-home-bg);
      }

      #theme-proxio .ignai-grid-overlay {
        opacity: 0.04;
        background-image: var(--ignai-page-grid);
        background-size: 92px 92px;
      }

      html.light #theme-proxio .ignai-grid-overlay {
        opacity: 0.34;
      }

      #theme-proxio .ignai-background-field {
        background: var(--ignai-background-field);
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
        padding-top: 56px;
        padding-bottom: 56px;
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-home-section {
          padding-top: 80px;
          padding-bottom: 80px;
        }
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
          gap: 28px;
        }
        #theme-proxio .ignai-scroll-hint {
          display: none;
        }
        #theme-proxio .ignai-hero-section {
          padding-top: 52px;
          padding-bottom: 42px;
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
        border: 1px solid rgba(255, 183, 121, 0.2);
        background: rgba(34, 20, 8, 0.72);
        color: #f4cf9f;
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
        position: sticky;
        top: 0;
        background: var(--ignai-header-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--ignai-header-border);
        transform: translateY(0);
        transition:
          transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
          background 220ms ease,
          box-shadow 220ms ease,
          border-color 220ms ease;
        will-change: transform;
      }
      #theme-proxio .ud-header.sticky,
      #theme-proxio .ud-header.ignai-header--scrolled {
        background: var(--ignai-header-bg-sticky);
        box-shadow: 0 14px 42px rgba(0, 0, 0, 0.18);
      }

      html.light #theme-proxio .ud-header.ignai-header--scrolled {
        box-shadow: 0 14px 42px rgba(130, 75, 32, 0.12);
      }

      @media (max-width: 767px) {
        #theme-proxio .ud-header:not(.ignai-header--hidden) {
          transform: translateY(0) !important;
        }

        #theme-proxio .ud-header.ignai-header--hidden:not(.ignai-header--menu-open) {
          transform: translateY(calc(-100% - 10px)) !important;
        }
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

      #theme-proxio .ignai-header-brand-lockup {
        position: relative;
      }

      #theme-proxio .ignai-header-logo-frame {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 34px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        background: transparent;
      }

      #theme-proxio .ignai-header-logo-image {
        display: block;
        width: auto;
        height: 30px;
        object-fit: contain;
        filter: drop-shadow(0 0 12px rgba(255, 122, 24, 0.24));
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-header-logo-frame {
          width: 36px;
          height: 40px;
        }

        #theme-proxio .ignai-header-logo-image {
          height: 34px;
        }
      }

      #theme-proxio .ignai-header-wordmark {
        color: var(--ignai-nav-hover);
        font-size: 1.02rem;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      #theme-proxio .ignai-header-subtitle {
        margin-top: 5px;
        color: color-mix(in srgb, var(--ignai-heat) 72%, var(--ignai-text) 28%);
        font-size: 0.58rem;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-header-wordmark {
          font-size: 1.12rem;
        }

        #theme-proxio .ignai-header-subtitle {
          font-size: 0.62rem;
        }
      }

      #theme-proxio .ignai-nav-link {
        color: var(--ignai-nav-text);
      }

      #theme-proxio .ignai-nav-link:hover,
      #theme-proxio .ignai-nav-link:focus-visible {
        color: var(--ignai-nav-hover);
      }

      #theme-proxio .ignai-nav-dropdown {
        background: var(--ignai-dropdown-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--ignai-border);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
      }

      html.light #theme-proxio .ignai-nav-dropdown {
        box-shadow: 0 18px 48px rgba(125, 67, 28, 0.16);
      }

      #theme-proxio .ignai-nav-dropdown-link {
        color: var(--ignai-nav-text);
      }

      #theme-proxio .ignai-nav-dropdown-link:hover,
      #theme-proxio .ignai-nav-dropdown-link:focus-visible {
        color: var(--ignai-nav-hover);
        background: var(--ignai-dropdown-hover);
      }

      #theme-proxio .ignai-theme-toggle,
      #theme-proxio .ignai-mobile-theme-toggle {
        border: 1px solid var(--ignai-border);
        background: var(--ignai-card-strong);
        color: var(--ignai-nav-hover);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
      }

      #theme-proxio .ignai-theme-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      }

      #theme-proxio .ignai-theme-toggle:hover,
      #theme-proxio .ignai-mobile-theme-toggle:hover,
      #theme-proxio .ignai-theme-toggle:focus-visible,
      #theme-proxio .ignai-mobile-theme-toggle:focus-visible {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--ignai-heat) 46%, var(--ignai-border));
        outline: none;
      }

      #theme-proxio .ignai-header-join,
      #theme-proxio .ignai-mobile-menu-cta {
        border: 1px solid rgba(188, 124, 76, 0.34);
        background: linear-gradient(135deg, rgba(126,79,49,0.94) 0%, rgba(168,104,64,0.92) 54%, rgba(110,70,45,0.95) 100%);
        color: #fff;
        box-shadow: inset 0 1px 0 rgba(255,240,224,0.08), 0 12px 34px rgba(69,36,16,0.22);
      }

      html.light #theme-proxio .ignai-header-join,
      html.light #theme-proxio .ignai-mobile-menu-cta {
        background: linear-gradient(135deg, #f05a1a 0%, #ff8a18 54%, #df2530 100%);
        color: #fffaf3;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 12px 34px rgba(202,72,21,0.2);
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

      /* ========== 噪点纹理叠加层 ========== */
      #theme-proxio .ignai-noise-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        pointer-events: none;
        opacity: 0.025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 200px 200px;
        mix-blend-mode: overlay;
      }

      /* ========== 光标跟随光晕 ========== */
      #theme-proxio .ignai-cursor-glow {
        position: fixed;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,122,24,0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 1;
        transform: translate(-50%, -50%);
        transition: left 0.3s ease-out, top 0.3s ease-out;
        will-change: left, top;
      }

      @media (max-width: 768px) {
        #theme-proxio .ignai-cursor-glow {
          display: none;
        }
      }

      /* ========== 毛玻璃卡片增强 ========== */
      #theme-proxio .ignai-glass-card {
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(14,17,24,0.8) 0%, rgba(8,10,16,0.6) 100%);
        backdrop-filter: blur(20px) saturate(1.2);
        -webkit-backdrop-filter: blur(20px) saturate(1.2);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.05),
          0 0 0 1px rgba(255,255,255,0.02),
          0 20px 60px rgba(0,0,0,0.3);
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      #theme-proxio .ignai-glass-card:hover {
        border-color: rgba(255,183,121,0.15);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          0 0 0 1px rgba(255,255,255,0.04),
          0 0 40px rgba(255,122,24,0.06),
          0 30px 80px rgba(0,0,0,0.4);
        transform: translateY(-2px);
      }

      /* ========== 文字渐变闪烁 ========== */
      @keyframes ignai-text-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      #theme-proxio .ignai-text-shimmer {
        background: linear-gradient(
          90deg,
          rgba(255,255,255,0.6) 0%,
          rgba(255,255,255,1) 25%,
          rgba(255,208,154,1) 50%,
          rgba(255,255,255,1) 75%,
          rgba(255,255,255,0.6) 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: ignai-text-shimmer 6s linear infinite;
      }

      /* ========== 数字计数器 ========== */
      #theme-proxio .ignai-counter {
        font-variant-numeric: tabular-nums;
        font-feature-settings: 'tnum';
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
        font-size: clamp(2rem, 8vw, 3rem);
        font-weight: 700;
        line-height: 1.1;
        color: var(--rig-paper);
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
        color: var(--rig-heat);
        opacity: 0.84;
        letter-spacing: 0.04em;
      }

      /* Section lead */
      #theme-proxio .ignai-section-lead {
        font-size: 1.125rem;
        line-height: 1.6;
        color: var(--rig-paper-70);
      }

      /* Section body */
      #theme-proxio .ignai-section-body {
        font-size: 0.9375rem;
        line-height: 1.7;
        color: var(--rig-paper-70);
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
        color: var(--rig-paper);
      }

      #theme-proxio .section-title {
        font-size: clamp(2.2rem, 5vw, 4rem);
        font-weight: 600;
        line-height: 1.06;
        color: var(--rig-paper);
      }

      html.light #theme-proxio .display-title,
      html.light #theme-proxio .section-title,
      html.light #theme-proxio .rig-section-title,
      html.light #theme-proxio .ignai-articles-page-head h1 {
        color: #20150e;
      }

      html.light #theme-proxio .section-lead,
      html.light #theme-proxio .section-body,
      html.light #theme-proxio .card-body,
      html.light #theme-proxio .ignai-articles-page-head p {
        color: rgba(32, 21, 14, 0.74);
      }

      html.light #theme-proxio .section-eyebrow,
      html.light #theme-proxio .card-eyebrow {
        color: #c44817;
        opacity: 1;
      }

      #theme-proxio .section-copy {
        max-width: 34rem;
      }

      #theme-proxio .ignai-home-copy {
        position: relative;
        z-index: 2;
        max-width: 39rem;
      }

      #theme-proxio .ignai-hero-identity {
        display: inline-flex;
        flex-direction: column;
        gap: 10px;
        padding: 16px 18px;
        border-radius: 22px;
        border: 1px solid rgba(165, 108, 71, 0.24);
        background: linear-gradient(
          135deg,
          rgba(35, 23, 17, 0.78) 0%,
          rgba(16, 18, 26, 0.9) 100%
        );
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          0 18px 54px rgba(0, 0, 0, 0.18),
          0 0 0 1px rgba(255, 122, 24, 0.04);
      }

      #theme-proxio .ignai-hero-brand-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
      }

      #theme-proxio .ignai-hero-wordmark {
        margin: 0;
        color: #fff;
        font-size: 1.3rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      #theme-proxio .ignai-hero-brand-divider {
        width: 1px;
        height: 18px;
        background: linear-gradient(180deg, rgba(255, 183, 121, 0), rgba(255, 183, 121, 0.65), rgba(255, 183, 121, 0));
      }

      #theme-proxio .ignai-hero-brand-context {
        margin: 0;
        font-size: 0.86rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.64);
      }

      #theme-proxio .ignai-hero-tagline {
        margin: 0;
        font-size: clamp(1.15rem, 3vw, 1.68rem);
        font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.15;
      }

      #theme-proxio .ignai-hero-pill-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      #theme-proxio .ignai-hero-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 34px;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid rgba(151, 104, 72, 0.28);
        background: linear-gradient(
          180deg,
          rgba(64, 42, 32, 0.34) 0%,
          rgba(30, 22, 20, 0.44) 100%
        );
        color: rgba(255, 255, 255, 0.74);
        font-size: 0.78rem;
        font-weight: 500;
      }

      #theme-proxio .ignai-hero-manifesto {
        margin: 0;
        max-width: 9ch;
        color: #fff;
        font-size: clamp(2.25rem, 8vw, 4.6rem);
        font-weight: 700;
        line-height: 1.12;
        letter-spacing: -0.04em;
        text-wrap: balance;
      }

      #theme-proxio .ignai-hero-summary {
        max-width: 30rem;
        font-size: 1rem;
        line-height: 1.85;
      }

      #theme-proxio .ignai-hero-cta {
        width: 100%;
        border: 1px solid rgba(151, 104, 72, 0.34);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          0 14px 40px rgba(19, 13, 10, 0.14);
      }

      @media (min-width: 640px) {
        #theme-proxio .ignai-hero-cta {
          width: auto;
        }
      }

      #theme-proxio .ignai-hero-cta--primary {
        background: linear-gradient(
          135deg,
          rgba(126, 79, 49, 0.96) 0%,
          rgba(173, 109, 66, 0.94) 54%,
          rgba(113, 71, 45, 0.96) 100%
        );
        box-shadow:
          inset 0 1px 0 rgba(255, 240, 224, 0.08),
          0 16px 42px rgba(77, 40, 18, 0.22);
      }

      #theme-proxio .ignai-hero-cta--secondary {
        background: linear-gradient(
          180deg,
          rgba(67, 45, 33, 0.42) 0%,
          rgba(35, 25, 20, 0.62) 100%
        );
      }

      #theme-proxio .ignai-mobile-hero-panel {
        border-radius: 22px;
        border: 1px solid rgba(165, 108, 71, 0.18);
        background: linear-gradient(
          180deg,
          rgba(24, 17, 17, 0.94) 0%,
          rgba(12, 14, 21, 0.96) 100%
        );
        padding: 18px;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.03),
          0 22px 60px rgba(0, 0, 0, 0.22);
      }

      #theme-proxio .ignai-mobile-hero-kicker {
        margin: 0;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255, 183, 121, 0.82);
      }

      #theme-proxio .ignai-mobile-signal-list {
        display: grid;
        gap: 14px;
      }

      #theme-proxio .ignai-mobile-signal-item {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 12px;
        align-items: start;
      }

      #theme-proxio .ignai-mobile-signal-dot {
        margin-top: 6px;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        box-shadow: 0 0 18px rgba(255, 122, 24, 0.2);
      }

      #theme-proxio .ignai-mobile-signal-dot--heat {
        background: linear-gradient(135deg, #ff7a18 0%, #ffb062 100%);
      }

      #theme-proxio .ignai-mobile-signal-dot--soft {
        background: linear-gradient(135deg, rgba(255, 183, 121, 0.92) 0%, rgba(255, 217, 168, 0.72) 100%);
      }

      #theme-proxio .ignai-mobile-signal-eyebrow {
        margin: 0;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.46);
      }

      #theme-proxio .ignai-mobile-signal-title {
        margin: 4px 0 0;
        color: #fff;
        font-size: 0.98rem;
        font-weight: 600;
        line-height: 1.38;
      }

      #theme-proxio .ignai-mobile-signal-description {
        margin: 6px 0 0;
        color: rgba(255, 255, 255, 0.62);
        font-size: 0.9rem;
        line-height: 1.65;
      }

      @media (max-width: 639px) {
        #theme-proxio .ignai-hero-identity {
          width: 100%;
          padding: 15px 16px;
        }

        #theme-proxio .ignai-hero-wordmark {
          font-size: 1.18rem;
        }

        #theme-proxio .ignai-hero-brand-context {
          font-size: 0.76rem;
          letter-spacing: 0.1em;
        }

        #theme-proxio .ignai-hero-manifesto {
          max-width: none;
        }

        #theme-proxio .ignai-hero-summary {
          font-size: 0.98rem;
          line-height: 1.72;
        }
      }

      #theme-proxio .section-eyebrow {
        color: var(--rig-heat);
        opacity: 0.88;
        font-size: 0.8rem;
        text-transform: uppercase;
      }

      #theme-proxio .section-lead {
        font-size: clamp(1.06rem, 2vw, 1.22rem);
        line-height: 1.62;
        color: var(--rig-paper-70);
      }

      #theme-proxio .section-body,
      #theme-proxio .card-body {
        font-size: 0.95rem;
        line-height: 1.9;
        color: var(--rig-paper-70);
      }

      #theme-proxio .card-title {
        margin-top: 14px;
        font-size: clamp(1.8rem, 3vw, 2.18rem);
        font-weight: 600;
        line-height: 1.02;
        color: var(--rig-paper);
      }

      #theme-proxio .card-eyebrow {
        font-size: 0.74rem;
        text-transform: uppercase;
        color: var(--rig-paper-50);
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
        border: 1px solid var(--rig-border);
        background: var(--rig-card-bg);
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
        padding: 20px;
      }
      @media (min-width: 640px) {
        #theme-proxio .open-grid-item {
          padding: 28px;
        }
      }

      #theme-proxio .ignai-unified-card:hover,
      #theme-proxio .open-grid-item:hover {
        transform: translateY(-4px);
        border-color: color-mix(in srgb, var(--rig-heat) 30%, var(--rig-border));
        background: var(--rig-card-hover-bg);
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
        background:
          linear-gradient(180deg, rgba(16, 18, 26, 0.96) 0%, rgba(10, 12, 18, 0.98) 100%);
        color: #fff8ef;
      }

      html.light #theme-proxio .ignai-unified-card [class*="text-white"],
      html.light #theme-proxio .open-grid-item [class*="text-white"],
      html.light #theme-proxio .ignai-themed-page [class*="text-white"] {
        color: var(--ignai-card-muted) !important;
      }

      html.light #theme-proxio .ignai-unified-card h2,
      html.light #theme-proxio .ignai-unified-card h3,
      html.light #theme-proxio .ignai-unified-card h2[class*="text-white"],
      html.light #theme-proxio .ignai-unified-card h3[class*="text-white"],
      html.light #theme-proxio .ignai-event-card h3,
      html.light #theme-proxio .ignai-event-card h3[class*="text-white"],
      html.light #theme-proxio .ignai-record-card h3,
      html.light #theme-proxio .ignai-record-card h3[class*="text-white"],
      html.light #theme-proxio .open-grid-item h2,
      html.light #theme-proxio .open-grid-item h3,
      html.light #theme-proxio .ignai-themed-page h1,
      html.light #theme-proxio .ignai-themed-page h2,
      html.light #theme-proxio .ignai-themed-page h3,
      html.light #theme-proxio .ignai-themed-page .font-semibold {
        color: var(--ignai-card-text) !important;
      }

      html.light #theme-proxio .ignai-unified-card [class*="border-white"],
      html.light #theme-proxio .open-grid-item [class*="border-white"],
      html.light #theme-proxio .ignai-themed-page [class*="border-white"] {
        border-color: var(--ignai-chip-border) !important;
      }

      html.light #theme-proxio .ignai-unified-card [class*="bg-white/"],
      html.light #theme-proxio .open-grid-item [class*="bg-white/"],
      html.light #theme-proxio .ignai-themed-page [class*="bg-white/"] {
        background-color: var(--ignai-chip-bg) !important;
      }

      html.light #theme-proxio .ignai-unified-card .rounded-full,
      html.light #theme-proxio .open-grid-item .rounded-full,
      html.light #theme-proxio .ignai-themed-page .rounded-full {
        color: var(--ignai-chip-text) !important;
      }

      html.light #theme-proxio .ignai-event-card,
      html.light #theme-proxio .ignai-record-card,
      html.light #theme-proxio .ignai-article-card {
        border-color: rgba(126, 71, 34, 0.18);
        background:
          linear-gradient(180deg, rgba(255, 252, 246, 0.96) 0%, rgba(255, 247, 236, 0.9) 100%);
        color: var(--ignai-card-text);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.7),
          0 22px 70px rgba(117, 69, 35, 0.12);
      }

      html.light #theme-proxio .ignai-event-card [class*="text-white"],
      html.light #theme-proxio .ignai-record-card [class*="text-white"] {
        color: var(--ignai-card-muted) !important;
      }

      html.light #theme-proxio .ignai-event-card h3,
      html.light #theme-proxio .ignai-event-card h3[class*="text-white"],
      html.light #theme-proxio .ignai-record-card h3,
      html.light #theme-proxio .ignai-record-card h3[class*="text-white"],
      html.light #theme-proxio .ignai-event-card .font-semibold,
      html.light #theme-proxio .ignai-record-card .font-semibold {
        color: var(--ignai-card-text) !important;
      }

      html.light #theme-proxio .ignai-event-card .rounded-full,
      html.light #theme-proxio .ignai-record-card .rounded-full {
        border-color: rgba(202, 105, 49, 0.18) !important;
        background: rgba(255, 248, 238, 0.86) !important;
        color: rgba(32, 21, 14, 0.7) !important;
      }

      #theme-proxio .ignai-themed-page {
        background:
          radial-gradient(circle at 12% 7%, color-mix(in srgb, var(--rig-heat) 12%, transparent), transparent 30%),
          radial-gradient(circle at 88% 9%, color-mix(in srgb, var(--rig-signal) 8%, transparent), transparent 24%),
          var(--ignai-bg);
      }

      #theme-proxio .ignai-themed-card,
      #theme-proxio .ignai-themed-page > * [class*="bg-white/"] {
        background-color: var(--rig-card-bg);
      }

      #theme-proxio .ignai-themed-card {
        border-color: var(--rig-border);
        color: var(--rig-paper);
      }

      #theme-proxio .ignai-themed-card:hover {
        border-color: color-mix(in srgb, var(--rig-heat) 32%, var(--rig-border));
        background-color: var(--rig-card-hover-bg);
      }

      #theme-proxio .ignai-about-page {
        position: relative;
        background:
          radial-gradient(circle at 18% 8%, color-mix(in srgb, var(--rig-heat) 14%, transparent), transparent 32%),
          radial-gradient(circle at 82% 12%, color-mix(in srgb, var(--rig-signal) 7%, transparent), transparent 26%),
          var(--ignai-bg);
        color: var(--rig-paper);
      }

      #theme-proxio .ignai-about-page::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.22;
        background-image: var(--ignai-page-grid);
        background-size: 92px 92px;
        mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 86%, transparent 100%);
      }

      #theme-proxio .ignai-about-page > section {
        position: relative;
        z-index: 1;
      }

      #theme-proxio .ignai-about-hero-line--primary {
        color: var(--rig-paper);
      }

      #theme-proxio .ignai-about-hero-line--accent,
      #theme-proxio .ignai-about-stat-num {
        color: var(--rig-heat);
      }

      #theme-proxio .ignai-about-eyebrow {
        color: color-mix(in srgb, var(--rig-heat) 72%, var(--rig-paper) 28%);
      }

      #theme-proxio .ignai-about-title,
      #theme-proxio .ignai-about-value-title,
      #theme-proxio .ignai-about-panel-question {
        color: var(--rig-paper);
      }

      #theme-proxio .ignai-about-copy,
      #theme-proxio .ignai-about-value-desc,
      #theme-proxio .ignai-about-panel-answer,
      #theme-proxio .ignai-about-stat-label,
      #theme-proxio .ignai-about-stat-note {
        color: var(--rig-paper-70);
      }

      #theme-proxio .ignai-about-stats {
        border-color: var(--rig-border);
        background: color-mix(in srgb, var(--rig-card-bg) 24%, transparent);
      }

      #theme-proxio .ignai-about-panel,
      #theme-proxio .ignai-about-value-card {
        border-color: var(--rig-border);
        background: var(--rig-card-bg);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
      }

      #theme-proxio .ignai-about-value-card:hover {
        border-color: color-mix(in srgb, var(--rig-heat) 34%, var(--rig-border));
        background: var(--rig-card-hover-bg);
      }

      #theme-proxio .ignai-about-panel-row {
        border-color: var(--rig-border);
      }

      #theme-proxio .ignai-about-value-icon {
        border-color: color-mix(in srgb, var(--rig-heat) 28%, transparent);
        background: color-mix(in srgb, var(--rig-heat) 12%, transparent);
        color: var(--rig-heat);
      }

      html.light #theme-proxio .ignai-about-page {
        background:
          radial-gradient(circle at 10% 6%, rgba(255, 125, 43, 0.14), transparent 28%),
          linear-gradient(180deg, #fff7ec 0%, #fffaf4 46%, #fff6ea 100%);
        color: #20150e;
      }

      html.light #theme-proxio .ignai-about-page::before {
        opacity: 0.42;
      }

      html.light #theme-proxio .ignai-about-hero-line--primary {
        color: #20150e;
      }

      html.light #theme-proxio .ignai-about-hero-line--accent,
      html.light #theme-proxio .ignai-about-stat-num {
        color: #e34f16;
      }

      html.light #theme-proxio .ignai-about-eyebrow {
        color: #b94214;
      }

      html.light #theme-proxio .ignai-about-title,
      html.light #theme-proxio .ignai-about-value-title,
      html.light #theme-proxio .ignai-about-panel-question {
        color: #20150e;
      }

      html.light #theme-proxio .ignai-about-copy,
      html.light #theme-proxio .ignai-about-value-desc,
      html.light #theme-proxio .ignai-about-panel-answer,
      html.light #theme-proxio .ignai-about-stat-label,
      html.light #theme-proxio .ignai-about-stat-note {
        color: rgba(32, 21, 14, 0.72);
      }

      html.light #theme-proxio .ignai-about-stats {
        border-color: rgba(126, 71, 34, 0.14);
        background: rgba(255, 248, 238, 0.48);
      }

      html.light #theme-proxio .ignai-about-panel,
      html.light #theme-proxio .ignai-about-value-card {
        border-color: rgba(126, 71, 34, 0.16);
        background: rgba(255, 252, 246, 0.84);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
      }

      html.light #theme-proxio .ignai-about-value-card:hover {
        border-color: rgba(227, 79, 22, 0.32);
        background: rgba(255, 248, 238, 0.92);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
      }

      html.light #theme-proxio .ignai-about-panel-row {
        border-color: rgba(126, 71, 34, 0.14);
      }

      html.light #theme-proxio .ignai-about-value-icon {
        border-color: rgba(227, 79, 22, 0.2);
        background: rgba(255, 122, 24, 0.1);
        color: #e34f16;
      }

      html.light #theme-proxio .ignai-cta-primary {
        border-color: rgba(209, 86, 25, 0.3);
        background: linear-gradient(135deg, #ff7a18 0%, #ff8f2e 52%, #df3822 100%);
        color: #fffaf3;
        box-shadow:
          inset 0 1px 0 rgba(255, 250, 243, 0.18),
          0 16px 42px rgba(227, 79, 22, 0.22);
      }

      html.light #theme-proxio .ignai-cta-secondary {
        border-color: rgba(126, 71, 34, 0.2);
        background: rgba(255, 250, 242, 0.74);
        color: #20150e;
      }

      html.light #theme-proxio .ignai-cta-secondary:hover {
        border-color: rgba(227, 79, 22, 0.32);
        background: rgba(255, 242, 226, 0.9);
      }


      /* ========== IGNAI CTA 按钮 ========== */
      #theme-proxio .ignai-cta-primary {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 32px;
        border-radius: 12px;
        border: 1px solid rgba(188, 124, 76, 0.34);
        background: linear-gradient(
          135deg,
          rgba(126, 79, 49, 0.96) 0%,
          rgba(173, 109, 66, 0.94) 54%,
          rgba(113, 71, 45, 0.96) 100%
        );
        color: #fff;
        font-weight: 600;
        font-size: 0.9375rem;
        overflow: hidden;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        box-shadow:
          inset 0 1px 0 rgba(255, 240, 224, 0.08),
          0 12px 38px rgba(77, 40, 18, 0.22);
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
        box-shadow:
          inset 0 1px 0 rgba(255, 240, 224, 0.1),
          0 16px 44px rgba(77, 40, 18, 0.3);
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
        border: 1px solid rgba(151, 104, 72, 0.34);
        background: linear-gradient(
          180deg,
          rgba(67, 45, 33, 0.42) 0%,
          rgba(35, 25, 20, 0.62) 100%
        );
        color: #e4e4e7;
        font-weight: 500;
        font-size: 0.9375rem;
        transition:
          border-color 0.2s,
          background 0.2s;
      }
      #theme-proxio .ignai-cta-secondary:hover {
        border-color: rgba(214, 147, 95, 0.42);
        background: linear-gradient(
          180deg,
          rgba(80, 54, 39, 0.5) 0%,
          rgba(42, 29, 23, 0.68) 100%
        );
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

      #theme-proxio .ignai-signal-item {
        padding: 8px;
        border-radius: 8px;
        transition: background 0.3s ease;
      }

      #theme-proxio .ignai-signal-item:hover {
        background: rgba(255, 255, 255, 0.03);
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
        border-top: 1px solid var(--ignai-border);
        background: var(--rig-footer-bg);
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
        background: var(--ignai-nav-hover);
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

      #theme-proxio .ignai-mobile-toggle {
        color: var(--ignai-nav-hover);
        border: 1px solid var(--ignai-border);
        background: var(--ignai-card-strong);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          0 16px 38px rgba(0, 0, 0, 0.12);
        transition:
          border-color 0.2s ease,
          background 0.2s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      #theme-proxio .ignai-mobile-toggle:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--ignai-heat) 46%, var(--ignai-border));
        background: var(--ignai-dropdown-bg);
      }

      #theme-proxio .ignai-mobile-toggle:focus-visible {
        outline: 2px solid rgba(255, 154, 60, 0.58);
        outline-offset: 2px;
      }

      #theme-proxio .ignai-mobile-backdrop {
        position: fixed;
        inset: 0;
        z-index: 39;
        background: var(--ignai-mobile-backdrop);
        border: 0;
      }

      /* 移动端菜单面板动画 */
      #theme-proxio .ignai-mobile-menu {
        top: calc(100% + 12px);
        transform-origin: top right;
        background: var(--ignai-dropdown-bg);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--ignai-border);
        box-shadow: 0 24px 64px rgba(0,0,0,0.32);
        transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      }

      html.light #theme-proxio .ignai-mobile-menu {
        box-shadow: 0 24px 64px rgba(125,67,28,0.18);
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

      #theme-proxio .ignai-mobile-menu-header {
        border-bottom: 1px solid var(--ignai-border);
      }

      #theme-proxio .ignai-mobile-menu-kicker {
        margin: 0;
        color: rgba(255, 183, 121, 0.78);
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      #theme-proxio .ignai-mobile-menu-title {
        color: var(--ignai-nav-hover);
        font-size: 1.16rem;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      #theme-proxio .ignai-mobile-menu-title-glow {
        color: color-mix(in srgb, var(--ignai-heat) 72%, var(--ignai-text) 28%);
        font-size: 0.94rem;
        font-weight: 600;
      }

      #theme-proxio .ignai-mobile-menu-copy {
        color: var(--ignai-text-soft);
      }

      #theme-proxio .ignai-mobile-menu-list > li + li {
        margin-top: 2px;
      }

      #theme-proxio .ignai-mobile-menu-link,
      #theme-proxio .ignai-mobile-menu-sub-link {
        margin-left: 10px;
        margin-right: 10px;
      }

      #theme-proxio .ignai-mobile-menu-link {
        color: var(--ignai-nav-text);
      }

      #theme-proxio .ignai-mobile-menu-sub-link {
        color: var(--ignai-text-dim);
      }

      #theme-proxio .ignai-mobile-menu-link:hover,
      #theme-proxio .ignai-mobile-menu-link:focus-visible {
        color: var(--ignai-nav-hover);
        background: var(--ignai-dropdown-hover);
      }

      #theme-proxio .ignai-mobile-menu-sub-link:hover,
      #theme-proxio .ignai-mobile-menu-sub-link:focus-visible {
        color: var(--ignai-nav-hover);
        background: var(--ignai-dropdown-hover);
      }

      #theme-proxio .ignai-mobile-menu-cta {
        color: #fff;
      }

      #theme-proxio .ignai-mobile-menu-cta:hover,
      #theme-proxio .ignai-mobile-menu-cta:focus-visible {
        color: #fff;
        background: linear-gradient(
          135deg,
          rgba(138, 86, 53, 0.98) 0%,
          rgba(184, 114, 69, 0.96) 54%,
          rgba(118, 75, 47, 0.98) 100%
        );
      }

      /* ========== 品牌滚动条 ========== */
      #theme-proxio .ignai-brand-scroll {
        border: 1px solid var(--ignai-border);
        background: var(--ignai-card-strong);
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

      #theme-proxio .ignai-back-to-top {
        border: 1px solid rgba(255, 183, 121, 0.2);
        background: linear-gradient(135deg, rgba(255, 122, 24, 0.96), rgba(255, 154, 60, 0.9)) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          0 18px 36px rgba(255, 122, 24, 0.22);
      }

      #theme-proxio .ignai-back-to-top:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, rgba(255, 136, 42, 0.98), rgba(255, 166, 76, 0.94)) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.14),
          0 22px 46px rgba(255, 122, 24, 0.28);
      }

      @media (max-width: 767px) {
        #theme-proxio .ignai-back-to-top {
          right: 20px;
          bottom: 20px;
        }
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
        background: radial-gradient(ellipse at center, rgba(255,122,24,0.03) 0%, transparent 60%);
      }

      @media (max-width: 640px) {
        .avatar-scatter-container {
          max-height: 360px;
          border-radius: 16px;
        }
      }

      .avatar-scatter-item {
        position: absolute;
        cursor: pointer;
        will-change: transform;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.16s ease-out;
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

      /* --- Rig 设计系统：字体声明保留在 styled-jsx 中，其余通过独立 style 注入 --- */

`

const rigStyle = `
  /* --- Rig 工具类 --- */
  #theme-proxio .rig-mono { font-family: 'Rig Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
  #theme-proxio .rig-display { font-family: 'Rig Chalet', 'Rig Sans', sans-serif; letter-spacing: 0; }
  #theme-proxio .rig-sans { font-family: 'Rig Sans', system-ui, sans-serif; }

  /* --- 覆盖效果 --- */
  #theme-proxio .rig-scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 10002;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 4px);
  }
  html.light #theme-proxio .rig-scanlines {
    opacity: 0.18;
  }
  #theme-proxio .rig-rgb-fringe {
    position: fixed; inset: 0; pointer-events: none; z-index: 10003;
    background: linear-gradient(90deg, #e5332a05, #2b4fff04, #e5332a05);
    background-size: 3px 100%;
  }
  #theme-proxio .rig-content-lines {
    position: fixed; inset: 0; z-index: 9999; pointer-events: none;
  }
  #theme-proxio .rig-content-lines::before,
  #theme-proxio .rig-content-lines::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 1px;
    background: var(--rig-border);
  }
  #theme-proxio .rig-content-lines::before { left: calc(50% - 600px); }
  #theme-proxio .rig-content-lines::after { right: calc(50% - 600px); }

  /* --- 切角按钮 --- */
  #theme-proxio .rig-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 1rem 2rem; border: 0; color: inherit; cursor: pointer;
    font: 800 0.85rem/1 'Rig Mono', monospace; text-decoration: none;
    clip-path: polygon(var(--rig-chamfer) 0, 100% 0, 100% calc(100% - var(--rig-chamfer)), calc(100% - var(--rig-chamfer)) 100%, 0 100%, 0 var(--rig-chamfer));
    transition: box-shadow 0.18s, transform 0.18s, text-shadow 0.18s;
  }
  #theme-proxio .rig-btn--dark {
    background: var(--rig-btn-primary-bg);
    color: var(--rig-btn-primary-text);
    box-shadow: 0 16px 42px var(--rig-heat-glow);
  }
  #theme-proxio .rig-btn--heat {
    background: var(--rig-btn-primary-bg); color: var(--rig-btn-primary-text);
    box-shadow: 0 0 40px var(--rig-heat-glow);
  }
  #theme-proxio .rig-btn--outline {
    clip-path: none; border: 1px solid var(--rig-btn-outline-border);
    color: var(--rig-btn-outline-text); background: var(--rig-btn-outline-bg);
  }
  #theme-proxio .rig-btn:hover {
    transform: translate(-1px, -1px);
    text-shadow: -1px 0 rgba(43,79,255,0.35), 1px 0 rgba(237,70,45,0.35);
    box-shadow: 4px 4px 0 var(--rig-signal);
  }

  /* --- Badge --- */
  #theme-proxio .rig-badge {
    width: fit-content; display: flex; align-items: center; gap: 0.6rem;
    margin: 0 auto 2rem; padding: 0.5rem 1rem;
    border: 1px solid color-mix(in srgb, var(--rig-heat) 28%, transparent); background: var(--ignai-card-strong);
    color: var(--rig-heat);
    font: 800 0.72rem/1 'Rig Mono', monospace; letter-spacing: 0; text-transform: uppercase;
    backdrop-filter: blur(8px);
  }

  /* --- Section --- */
  #theme-proxio .rig-section {
    max-width: var(--rig-max-w); margin: 0 auto; padding: 6rem 3rem;
  }
  #theme-proxio .rig-section-title {
    margin: 0; color: var(--rig-paper);
    font: 400 clamp(2.6rem, 5vw, 4.7rem)/1.02 'Rig Chalet', sans-serif;
    letter-spacing: 0;
  }
  #theme-proxio .rig-section-title br + * { color: var(--rig-heat); }
  #theme-proxio .rig-section-subline {
    max-width: 660px;
    margin: 1.1rem auto 0;
    color: var(--rig-paper-50);
    font-size: 1rem;
    line-height: 1.72;
    text-align: center;
  }
  #theme-proxio .rig-divider {
    max-width: var(--rig-max-w); height: 1px; margin: 0 auto;
    background: var(--rig-border);
  }

  /* --- Hero --- */
  #theme-proxio .rig-hero {
    position: relative; z-index: 10; overflow: hidden;
    background: var(--rig-hero-bg); color: var(--rig-hero-title);
    padding: 5.75rem 0 4.25rem;
  }
  #theme-proxio .rig-hero-artwash {
    position: absolute;
    inset: 0;
    opacity: 0.16;
    background-image: var(--rig-hero-artwash);
    background-position: center;
    background-size: cover;
    mix-blend-mode: soft-light;
    pointer-events: none;
  }
  #theme-proxio .rig-hero-inner {
    position: relative; z-index: 1;
    max-width: calc(var(--rig-max-w) + 6rem); margin: 0 auto; padding: 0 3rem;
    display: grid; grid-template-columns: minmax(0, 980px);
    gap: 3.5rem; align-items: center; justify-content: center;
  }
  #theme-proxio .rig-hero-copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  #theme-proxio .rig-hero-kicker {
    display: inline-flex; align-items: center; gap: 0.55rem;
    margin-bottom: 1.4rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid color-mix(in srgb, var(--rig-hero-title) 20%, transparent);
    background: color-mix(in srgb, var(--rig-hero-visual-bg) 76%, transparent);
    color: var(--rig-hero-title);
    font: 800 0.72rem/1 'Rig Mono', monospace;
    text-transform: uppercase;
  }
  #theme-proxio .rig-hero-kicker-dot {
    width: 7px; height: 7px; border-radius: 999px;
    background: var(--rig-heat);
    box-shadow: 0 0 16px var(--rig-heat-glow);
  }
  #theme-proxio .rig-hero h1 {
    max-width: 980px; margin: 0 auto 2rem; color: var(--rig-hero-title);
    font: 400 clamp(3.6rem, 7vw, 6.6rem)/0.98 'Rig Chalet', sans-serif;
    letter-spacing: 0;
    text-shadow: 0 18px 50px rgba(0,0,0,0.18);
  }
  #theme-proxio .rig-hero-sub {
    max-width: 760px; margin: 0 auto 1.5rem; color: var(--rig-hero-copy);
    font-size: 1.1rem; line-height: 1.55; font-weight: 700; opacity: 0.86;
  }
  #theme-proxio .rig-hero-proof-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: min(760px, 100%);
    margin: 0 auto 2.5rem;
    border-top: 1px solid color-mix(in srgb, var(--rig-hero-title) 16%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--rig-hero-title) 16%, transparent);
  }
  #theme-proxio .rig-hero-proof-item {
    padding: 0.86rem 1rem 0.82rem;
  }
  #theme-proxio .rig-hero-proof-item + .rig-hero-proof-item {
    padding-left: 1rem;
    border-left: 1px solid color-mix(in srgb, var(--rig-hero-title) 14%, transparent);
  }
  #theme-proxio .rig-hero-proof-item strong {
    display: block;
    color: var(--rig-heat);
    font: 400 2.1rem/0.95 'Rig Chalet', sans-serif;
  }
  #theme-proxio .rig-hero-proof-item span {
    display: block;
    margin-top: 0.35rem;
    color: var(--rig-hero-copy);
    font: 800 0.62rem/1.25 'Rig Mono', monospace;
    text-transform: uppercase;
  }

  html.light #theme-proxio .rig-hero h1 {
    text-shadow: none;
  }

  html.light #theme-proxio .rig-hero-sub {
    color: rgba(25, 14, 8, 0.82);
    opacity: 1;
  }
  html.light #theme-proxio .rig-hero-kicker {
    background: rgba(255, 255, 255, 0.36);
  }
  html.light #theme-proxio .rig-hero-proof-row {
    border-color: rgba(25, 14, 8, 0.18);
  }
  html.light #theme-proxio .rig-hero-proof-item + .rig-hero-proof-item {
    border-color: rgba(25, 14, 8, 0.14);
  }
  html.light #theme-proxio .rig-hero-proof-item span {
    color: rgba(25, 14, 8, 0.68);
  }
  #theme-proxio .rig-hero-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

  /* --- Ticker --- */
  #theme-proxio .rig-ticker {
    border-top: 1px solid var(--rig-border);
    padding: 0.75rem 0; overflow: hidden; margin-top: 3rem;
    font: 800 0.78rem/1 'Rig Mono', monospace; white-space: nowrap; color: var(--rig-paper);
    opacity: 0.62;
  }
  #theme-proxio .rig-ticker-track {
    display: flex; gap: 2.5rem; width: max-content;
    animation: rig-ticker-scroll 28s linear infinite;
  }
  #theme-proxio .rig-ticker-track span { white-space: nowrap; }
  #theme-proxio .rig-ticker-dot { margin: 0 0.5rem; opacity: 0.4; }
  @keyframes rig-ticker-scroll { to { transform: translateX(-50%); } }

  /* --- Problem --- */
  #theme-proxio .rig-problem-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;
  }
  #theme-proxio .rig-problem-card {
    padding: 1.7rem 1.5rem; border: 1px solid var(--rig-border);
    background: color-mix(in srgb, var(--rig-card-bg) 72%, transparent);
    clip-path: polygon(var(--rig-chamfer) 0, 100% 0, 100% calc(100% - var(--rig-chamfer)), calc(100% - var(--rig-chamfer)) 100%, 0 100%, 0 var(--rig-chamfer));
    transition: background 0.2s;
  }
  #theme-proxio .rig-problem-card:hover { background: var(--rig-card-hover-bg); }
  #theme-proxio .rig-problem-card-label {
    font: 800 0.68rem/1 'Rig Mono', monospace; color: var(--rig-heat);
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;
  }
  #theme-proxio .rig-problem-card-num {
    font: 400 2.05rem/1 'Rig Chalet', sans-serif; color: var(--rig-paper-15);
    margin-bottom: 0.75rem;
  }
  #theme-proxio .rig-problem-card-title {
    font: 600 1.05rem/1.4 'Rig Sans', sans-serif; color: var(--rig-paper);
    margin-bottom: 0.5rem;
  }
  #theme-proxio .rig-problem-card-desc {
    font-size: 0.88rem; line-height: 1.55; color: var(--rig-paper-50);
  }

  /* --- Capabilities --- */
  #theme-proxio .rig-caps-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;
  }
  #theme-proxio .rig-cap-card {
    padding: 1.85rem 1.5rem; border: 1px solid var(--rig-border);
    background: color-mix(in srgb, var(--rig-card-bg) 74%, transparent);
    clip-path: polygon(var(--rig-chamfer) 0, 100% 0, 100% calc(100% - var(--rig-chamfer)), calc(100% - var(--rig-chamfer)) 100%, 0 100%, 0 var(--rig-chamfer));
    transition: background 0.2s;
  }
  #theme-proxio .rig-cap-card:hover { background: var(--rig-card-hover-bg); }
  #theme-proxio .rig-cap-label {
    font: 800 0.72rem/1 'Rig Mono', monospace; color: var(--rig-heat);
    margin-bottom: 0.85rem;
    opacity: 0.86;
  }
  #theme-proxio .rig-cap-title {
    font: 600 1.05rem/1.4 'Rig Sans', sans-serif; color: var(--rig-paper);
    margin-bottom: 0.5rem;
  }
  #theme-proxio .rig-cap-desc {
    font-size: 0.88rem; line-height: 1.55; color: var(--rig-paper-50);
  }

  /* --- Stats --- */
  #theme-proxio .rig-stats {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1px;
    background: var(--rig-border);
  }
  #theme-proxio .rig-stat {
    padding: 2.5rem 1.5rem; background: var(--ignai-card-strong); text-align: center;
  }
  #theme-proxio .rig-stat-value {
    font: 400 3.2rem/1 'Rig Chalet', sans-serif; color: var(--rig-paper);
    margin-bottom: 0.4rem;
  }
  #theme-proxio .rig-stat-label {
    font: 800 0.72rem/1 'Rig Mono', monospace; color: var(--rig-heat);
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;
  }
  #theme-proxio .rig-stat-note { font-size: 0.78rem; color: var(--rig-paper-35); }

  /* --- Terminal --- */
  #theme-proxio .rig-terminal {
    border: 1px solid var(--rig-border); background: var(--rig-terminal-bg);
    font-family: 'Rig Mono', monospace; overflow: hidden;
  }
  #theme-proxio .rig-terminal-bar {
    padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--rig-border);
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.72rem; color: var(--rig-paper-35);
  }
  #theme-proxio .rig-terminal-dot {
    width: 8px; height: 8px; border-radius: 50%; display: inline-block;
  }
  #theme-proxio .rig-terminal-body { padding: 1.5rem 1.25rem; font-size: 0.82rem; line-height: 1.8; }
  #theme-proxio .rig-term-prompt::before {
    content: '❯ '; color: var(--rig-heat);
  }
  #theme-proxio .rig-term-plain { color: var(--rig-paper-70); }
  #theme-proxio .rig-term-success { color: #34d399; }
  #theme-proxio .rig-term-ascii { color: var(--rig-heat); white-space: pre; font-size: 0.6rem; line-height: 1.2; }
  #theme-proxio .rig-term-cursor {
    display: inline-block; width: 8px; height: 1em; background: var(--rig-heat);
    animation: rig-blink 1s step-end infinite; vertical-align: text-bottom;
  }
  @keyframes rig-blink { 50% { opacity: 0; } }

  /* --- FAQ --- */
  #theme-proxio .rig-faq-item {
    border: 1px solid var(--rig-border); border-bottom: 0;
    background: var(--rig-card-bg);
  }
  #theme-proxio .rig-faq-item:last-child { border-bottom: 1px solid var(--rig-border); }
  #theme-proxio .rig-faq-q {
    padding: 1.25rem 1.5rem; display: flex; justify-content: space-between;
    align-items: center; cursor: pointer; font-weight: 600; color: var(--rig-paper);
    transition: background 0.2s;
  }
  #theme-proxio .rig-faq-q:hover { background: var(--rig-card-hover-bg); }
  #theme-proxio .rig-faq-a {
    padding: 0 1.5rem; max-height: 0; overflow: hidden;
    color: var(--rig-paper-70); font-size: 0.9rem; line-height: 1.6;
    transition: max-height 0.35s ease, padding 0.35s ease;
  }
  #theme-proxio .rig-faq-item--open .rig-faq-a { max-height: 300px; padding: 0 1.5rem 1.25rem; }
  #theme-proxio .rig-faq-chevron {
    width: 18px; height: 18px; transition: transform 0.25s;
    color: var(--rig-paper-35);
  }
  #theme-proxio .rig-faq-item--open .rig-faq-chevron { transform: rotate(180deg); }

  /* --- CTA --- */
  #theme-proxio .rig-cta {
    text-align: center; padding: 6rem 3rem;
    position: relative; overflow: hidden;
  }
  #theme-proxio .rig-cta-glow {
    position: absolute; width: 420px; height: 420px; border-radius: 50%;
    background: var(--rig-heat); opacity: 0.08; filter: blur(100px);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    pointer-events: none;
  }
  #theme-proxio .rig-cta-title {
    position: relative; margin: 0 0 1rem;
    font: 400 clamp(2.6rem, 5vw, 4.2rem)/0.92 'Rig Chalet', sans-serif;
    color: var(--rig-paper);
  }
  #theme-proxio .rig-cta-sub {
    position: relative; max-width: 480px; margin: 0 auto 2.5rem;
    color: var(--rig-paper-70); font-size: 1rem; line-height: 1.6;
  }

  /* --- Article collections --- */
  #theme-proxio .ignai-articles-section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 2rem;
  }
  #theme-proxio .ignai-home-articles-grid,
  #theme-proxio .ignai-articles-grid {
    display: grid;
    gap: 1rem;
  }
  #theme-proxio .ignai-home-articles-grid {
    margin-top: 4rem;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }
  #theme-proxio .ignai-home-articles-grid .ignai-article-card:not(:first-child) {
    min-height: 0;
  }
  #theme-proxio .ignai-articles-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  #theme-proxio .ignai-articles-page {
    position: relative;
    z-index: 10;
    padding: 8rem 1.5rem 5rem;
  }
  #theme-proxio .ignai-search-page {
    position: relative;
    z-index: 10;
    padding-top: 7rem;
  }
  #theme-proxio .ignai-articles-page-inner {
    max-width: 1180px;
    margin: 0 auto;
  }
  #theme-proxio .ignai-articles-page-head {
    max-width: 700px;
    margin-bottom: 3rem;
  }
  #theme-proxio .ignai-articles-page-head h1 {
    margin: 1.1rem 0 1rem;
    color: var(--rig-paper);
    font: 400 clamp(3rem, 6vw, 5.8rem)/0.9 'Rig Chalet', sans-serif;
    letter-spacing: 0;
  }
  #theme-proxio .ignai-articles-page-head p {
    margin: 0;
    max-width: 620px;
    color: var(--rig-paper-70);
    font-size: 1rem;
    line-height: 1.75;
  }
  #theme-proxio .ignai-article-card {
    display: flex;
    min-width: 0;
    min-height: 100%;
    overflow: hidden;
    border: 1px solid var(--rig-border);
    background: var(--rig-card-bg);
    color: var(--rig-paper);
    text-decoration: none;
    clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }
  #theme-proxio .ignai-article-card:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--rig-heat) 38%, var(--rig-border));
    background: var(--rig-card-hover-bg);
  }
  #theme-proxio .ignai-article-card:not(.ignai-article-card--featured) {
    flex-direction: column;
  }
  #theme-proxio .ignai-home-articles-grid .ignai-article-card--featured {
    grid-row: span 3;
    flex-direction: column;
  }
  #theme-proxio .ignai-articles-grid .ignai-article-card--featured {
    grid-column: span 2;
    flex-direction: column;
  }
  #theme-proxio .ignai-article-cover {
    position: relative;
    flex: 0 0 auto;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--ignai-card-strong);
    border-bottom: 1px solid var(--rig-border);
  }
  #theme-proxio .ignai-article-card:not(.ignai-article-card--featured) .ignai-article-cover {
    aspect-ratio: 16 / 8.8;
  }
  #theme-proxio .ignai-article-cover img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }
  #theme-proxio .ignai-article-card:hover .ignai-article-cover img {
    transform: scale(1.025);
  }
  #theme-proxio .ignai-article-body {
    display: flex;
    min-width: 0;
    flex: 1 1 auto;
    flex-direction: column;
    padding: 1.2rem;
  }
  #theme-proxio .ignai-article-card--featured .ignai-article-body {
    padding: 1.45rem;
  }
  #theme-proxio .ignai-article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    color: var(--rig-heat);
    font: 800 0.66rem/1 'Rig Mono', monospace;
    text-transform: uppercase;
  }
  #theme-proxio .ignai-article-meta span + span {
    color: var(--rig-paper-35);
  }
  #theme-proxio .ignai-article-authorline {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem;
    margin-top: 0.65rem;
    color: var(--rig-paper-45);
    font: 700 0.68rem/1.2 'Rig Mono', monospace;
    text-transform: uppercase;
  }
  #theme-proxio .ignai-article-authorline strong {
    color: var(--rig-paper-70);
    font-weight: 800;
  }
  #theme-proxio .ignai-article-body h3 {
    margin: 0.85rem 0 0;
    color: var(--rig-paper);
    font-size: 1.08rem;
    font-weight: 700;
    line-height: 1.35;
  }
  #theme-proxio .ignai-article-card--featured .ignai-article-body h3 {
    font-size: clamp(1.55rem, 3vw, 2.3rem);
    line-height: 1.16;
  }
  #theme-proxio .ignai-article-body p {
    margin: 0.75rem 0 0;
    color: var(--rig-paper-50);
    font-size: 0.9rem;
    line-height: 1.65;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  #theme-proxio .ignai-article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: auto;
    padding-top: 1.1rem;
  }
  #theme-proxio .ignai-article-tags span {
    border: 1px solid color-mix(in srgb, var(--rig-heat) 18%, var(--rig-border));
    padding: 0.36rem 0.5rem;
    color: var(--rig-paper-50);
    font: 700 0.68rem/1 'Rig Mono', monospace;
  }
  #theme-proxio .ignai-articles-empty {
    border: 1px solid var(--rig-border);
    background: var(--rig-card-bg);
    padding: 2rem;
    color: var(--rig-paper-50);
    font-size: 0.95rem;
  }

  /* --- Post detail community context --- */
  #theme-proxio .ignai-post-context {
    max-width: 980px;
    margin: 0 auto 2.5rem;
    padding: 1.25rem;
    border: 1px solid var(--rig-border);
    background: var(--rig-card-bg);
    color: var(--rig-paper);
    clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
  }
  #theme-proxio .ignai-post-context-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid var(--rig-border);
  }
  #theme-proxio .ignai-post-context-head span,
  #theme-proxio .ignai-post-context-label,
  #theme-proxio .ignai-post-context-status {
    font: 800 0.68rem/1 'Rig Mono', monospace;
    text-transform: uppercase;
  }
  #theme-proxio .ignai-post-context-head span {
    color: var(--rig-heat);
  }
  #theme-proxio .ignai-post-context-head h2 {
    margin: 0;
    color: var(--rig-paper);
    font: 700 1rem/1.35 'Rig Sans', sans-serif;
  }
  #theme-proxio .ignai-post-context-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  #theme-proxio .ignai-post-context-group {
    min-width: 0;
  }
  #theme-proxio .ignai-post-context-label {
    margin-bottom: 0.7rem;
    color: var(--rig-paper-35);
  }
  #theme-proxio .ignai-post-context-items {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  #theme-proxio .ignai-post-context-member,
  #theme-proxio .ignai-post-context-event {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
    padding: 0.72rem;
    border: 1px solid var(--rig-border);
    background: color-mix(in srgb, var(--rig-card-bg) 72%, transparent);
    color: var(--rig-paper);
    text-decoration: none;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }
  #theme-proxio .ignai-post-context-member:hover,
  #theme-proxio .ignai-post-context-event:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--rig-heat) 42%, var(--rig-border));
    background: var(--rig-card-hover-bg);
  }
  #theme-proxio .ignai-post-context-avatar {
    position: relative;
    flex: 0 0 auto;
    width: 34px;
    height: 34px;
    overflow: hidden;
    border: 1px solid var(--rig-border);
    background: var(--ignai-card-strong);
  }
  #theme-proxio .ignai-post-context-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #theme-proxio .ignai-post-context-member strong,
  #theme-proxio .ignai-post-context-event strong {
    display: block;
    overflow: hidden;
    color: var(--rig-paper);
    font-size: 0.9rem;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #theme-proxio .ignai-post-context-member em,
  #theme-proxio .ignai-post-context-event em {
    display: block;
    margin-top: 0.18rem;
    overflow: hidden;
    color: var(--rig-paper-50);
    font-size: 0.76rem;
    font-style: normal;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #theme-proxio .ignai-post-context-member--author {
    border-color: color-mix(in srgb, var(--rig-heat) 34%, var(--rig-border));
  }
  #theme-proxio .ignai-post-context-event {
    justify-content: space-between;
    align-items: flex-start;
  }
  #theme-proxio .ignai-post-context-event-main {
    min-width: 0;
  }
  #theme-proxio .ignai-post-context-status {
    flex: 0 0 auto;
    padding: 0.35rem 0.45rem;
    border: 1px solid color-mix(in srgb, var(--rig-heat) 28%, var(--rig-border));
    color: var(--rig-heat);
    font-size: 0.58rem;
  }

  /* --- Footer --- */
  #theme-proxio .rig-footer {
    border-top: 1px solid var(--rig-border); padding: 4rem 0 2rem;
    background: var(--rig-footer-bg); color: var(--rig-footer-text);
  }
  #theme-proxio .rig-footer-grid {
    display: grid; grid-template-columns: 2fr repeat(var(--footer-cols, 2), 1fr);
    gap: 3rem;
  }
  #theme-proxio .rig-footer-brand p { margin: 0; }
  #theme-proxio .rig-footer-col h3 {
    margin: 0 0 1rem; font: 800 0.72rem/1 'Rig Mono', monospace;
    color: color-mix(in srgb, var(--rig-footer-text) 56%, transparent); text-transform: uppercase; letter-spacing: 0.08em;
  }
  #theme-proxio .rig-footer-col ul { list-style: none; margin: 0; padding: 0; }
  #theme-proxio .rig-footer-col li { margin-bottom: 0.5rem; }
  #theme-proxio .rig-footer-col a {
    color: var(--rig-footer-text); text-decoration: none; font-size: 0.88rem;
    transition: color 0.15s;
  }
  #theme-proxio .rig-footer-col a:hover { color: color-mix(in srgb, var(--rig-footer-text) 70%, #fff 30%); }
  #theme-proxio .rig-footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--rig-border);
    font-size: 0.72rem; color: color-mix(in srgb, var(--rig-footer-text) 50%, transparent);
  }
  #theme-proxio .rig-footer-status {
    display: flex; align-items: center; gap: 0.5rem;
    font: 800 0.68rem/1 'Rig Mono', monospace;
  }
  #theme-proxio .rig-footer-status-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #34d399;
    box-shadow: 0 0 8px #34d39988;
  }

  /* --- 响应式 --- */
  @media (max-width: 959px) {
    #theme-proxio .rig-hero {
      padding: 5rem 0 3rem;
    }
    #theme-proxio .rig-hero-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    #theme-proxio .rig-hero h1 {
      max-width: 820px;
    }
  }

  @media (max-width: 768px) {
    #theme-proxio .rig-section { padding: 4rem 1.5rem; }
    #theme-proxio .rig-hero-inner { padding: 0 1.5rem; }
    #theme-proxio .rig-hero h1 {
      font-size: clamp(3rem, 13vw, 4rem);
      line-height: 1.1;
      margin-bottom: 1.35rem;
    }
    #theme-proxio .rig-hero-sub {
      max-width: 31rem;
      margin-bottom: 1.5rem;
      font-size: 1.02rem;
      line-height: 1.78;
    }
    #theme-proxio .rig-hero-proof-row {
      grid-template-columns: 1fr;
      margin-bottom: 2rem;
    }
    #theme-proxio .rig-hero-proof-item {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.82rem 0;
    }
    #theme-proxio .rig-hero-proof-item + .rig-hero-proof-item {
      padding-left: 0;
      border-left: 0;
      border-top: 1px solid color-mix(in srgb, var(--rig-hero-title) 14%, transparent);
    }
    #theme-proxio .rig-hero-proof-item strong {
      font-size: 1.8rem;
    }
    #theme-proxio .rig-hero-proof-item span {
      margin-top: 0;
      text-align: right;
    }
    #theme-proxio .rig-hero-actions {
      gap: 0.85rem;
      width: 100%;
    }
    #theme-proxio .rig-btn {
      min-height: 3.5rem;
      width: 100%;
      padding: 1rem 1.4rem;
      font-size: 0.88rem;
    }
    #theme-proxio .rig-section-title,
    #theme-proxio .section-title {
      font-size: clamp(2.4rem, 11vw, 3.35rem);
      line-height: 1.1;
    }
    #theme-proxio .rig-section-subline {
      margin-top: 0.85rem;
      font-size: 0.92rem;
      line-height: 1.7;
      text-align: left;
    }
    #theme-proxio .rig-hero-kicker { font-size: 0.66rem; }
    #theme-proxio .rig-problem-grid { grid-template-columns: 1fr; }
    #theme-proxio .rig-caps-grid { grid-template-columns: 1fr; }
    #theme-proxio .rig-stats { grid-template-columns: repeat(2, 1fr); }
    #theme-proxio .ignai-articles-section-head {
      display: block;
    }
    #theme-proxio .ignai-articles-section-head .ignai-cta-secondary {
      margin-top: 1.5rem;
    }
    #theme-proxio .ignai-home-articles-grid,
    #theme-proxio .ignai-articles-grid {
      grid-template-columns: 1fr;
    }
    #theme-proxio .ignai-home-articles-grid .ignai-article-card--featured {
      grid-row: auto;
    }
    #theme-proxio .ignai-articles-grid .ignai-article-card--featured {
      grid-column: auto;
    }
    #theme-proxio .ignai-articles-page {
      padding: 6rem 1.25rem 4rem;
    }
    #theme-proxio .ignai-article-card--featured .ignai-article-body h3 {
      font-size: 1.55rem;
    }
    #theme-proxio .ignai-post-context {
      padding: 1rem;
      margin-bottom: 1.75rem;
    }
    #theme-proxio .ignai-post-context-head {
      display: block;
    }
    #theme-proxio .ignai-post-context-head h2 {
      margin-top: 0.45rem;
    }
    #theme-proxio .ignai-post-context-grid {
      grid-template-columns: 1fr;
    }
    #theme-proxio .rig-footer-grid { grid-template-columns: 1fr; }
    #theme-proxio .rig-content-lines::before,
    #theme-proxio .rig-content-lines::after { display: none; }
    #theme-proxio .rig-cta { padding: 4rem 1.5rem; }
  }
`

const Style = () => {
  return <style dangerouslySetInnerHTML={{ __html: `${ignaiThemeCss}\n${rigStyle}` }} />
}

export { Style }
