const fs = require('fs');

const file = 'css/mobile.css';
const content = fs.readFileSync(file, 'utf8');

// Match regardless of Windows/Linux line endings
const searchStr = 'PREMIUM MOBILE REBUILD OVERRIDES';
const index = content.indexOf(searchStr);

if (index !== -1) {
  // Find the exact start of the comment block
  const startOfBlock = content.lastIndexOf('/* ============================================', index);
  
  if (startOfBlock !== -1) {
    const keepContent = content.substring(0, startOfBlock);

    const cleanCSS = `
/* ============================================
   PREMIUM MOBILE REBUILD OVERRIDES (2026)
   ============================================ */
@media (max-width: 768px) {
  /* GLOBAL RESPONSIVE GUARDRAILS */
  html, body, #main-content {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden !important;
  }

  * {
    box-sizing: border-box !important;
  }

  /* PREMIUM TYPOGRAPHY SYSTEM */
  h1, .hero-title, .text-display-lg {
    font-size: clamp(2.5rem, 10vw, 4rem) !important;
    line-height: 1.05 !important;
    letter-spacing: -0.02em !important;
  }

  h2, .section-title, .text-display-md {
    font-size: clamp(2rem, 8vw, 3rem) !important;
    line-height: 1.1 !important;
    letter-spacing: -0.01em !important;
  }

  h3, .text-display-sm {
    font-size: clamp(1.5rem, 6vw, 2.25rem) !important;
    line-height: 1.2 !important;
  }

  p, .hero-sub, .section-sub, .text-body-md, .reviews-card__quote {
    font-size: clamp(1rem, 4vw, 1.125rem) !important;
    line-height: 1.6 !important;
  }

  .text-body-sm {
    font-size: clamp(0.875rem, 3.5vw, 1rem) !important;
    line-height: 1.5 !important;
  }

  /* PREMIUM SPACING & LAYOUT */
  section {
    padding-block: clamp(48px, 12vw, 80px) !important;
    padding-inline: max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-right)) !important;
  }

  .container {
    width: 100% !important;
    max-width: 100% !important;
    padding-inline: 0 !important;
  }

  /* HERO SECTION REDESIGN */
  .hero, .hero-immersive {
    min-height: 100svh !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    padding-top: calc(80px + env(safe-area-inset-top)) !important;
    padding-bottom: clamp(40px, 10vh, 80px) !important;
    text-align: center !important;
  }

  .hero-immersive-content {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
  }

  .hero-badge {
    margin-bottom: 24px !important;
    font-size: clamp(0.75rem, 3vw, 0.875rem) !important;
    padding: 8px 16px !important;
    border-radius: 100px !important;
    background: rgba(255, 215, 0, 0.1) !important;
    backdrop-filter: blur(10px) !important;
  }

  .hero-ctas {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    gap: 16px !important;
    margin-top: 32px !important;
  }

  /* TOUCH TARGETS & BUTTONS */
  .btn, button, a {
    min-height: 48px !important;
  }

  .btn {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 14px 24px !important;
    font-size: 1rem !important;
    border-radius: 12px !important;
    font-weight: 700 !important;
  }

  /* AVOID HORIZONTAL SCROLL BUGS IN CARDS */
  .features-grid, .bento-grid, .prog-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 24px !important;
    width: 100% !important;
    overflow-x: hidden !important;
    scroll-snap-type: none !important;
  }

  .feature-card, .trainer-luxury-card, .bento-item, .program-card {
    width: 100% !important;
    max-width: 100% !important;
    flex: none !important;
    transform: none !important;
    opacity: 1 !important;
  }

  /* REVIEWS SECTION FIXES */
  .reviews-carousel {
    width: 100% !important;
    overflow: hidden !important;
    position: relative !important;
    padding-bottom: 40px !important;
  }

  .reviews-carousel__viewport {
    width: 100% !important;
    overflow: hidden !important;
  }

  .reviews-carousel__track {
    display: flex !important;
    width: 100% !important;
    align-items: stretch !important;
    will-change: transform;
  }

  .reviews-slide {
    flex: 0 0 100% !important;
    width: 100% !important;
    min-width: 100% !important;
    padding: 24px !important;
    box-sizing: border-box !important;
  }

  .reviews-dots {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    display: flex !important;
    justify-content: center !important;
    gap: 8px !important;
  }

  .reviews-dot {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.2) !important;
    border: none !important;
    transition: all 0.3s ease !important;
  }

  .reviews-dot.active {
    width: 24px !important;
    border-radius: 4px !important;
    background: var(--gold) !important;
  }
}
`;
    fs.writeFileSync(file, keepContent + cleanCSS);
    console.log('Fixed CSS block');
  } else {
    console.log('Could not find start of block.');
  }
} else {
  console.log('Could not find PREMIUM keyword.');
}
