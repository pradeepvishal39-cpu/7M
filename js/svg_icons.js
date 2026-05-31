// ============================================
// SVG ICONS - 7 Muscle Fitness Studio
// ============================================
 
function createFeatureIcons() {
  const svgIcons = {
 
    // 🏋️ → ⚡ LIGHTNING BOLT — Raw power, energy, strength
    bolt: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="boltG" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="boltGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <polygon points="58,10 30,52 50,52 42,90 70,48 50,48 58,10"
          fill="url(#boltG)" filter="url(#boltGlow)" opacity="0.95"/>
        <polygon points="58,10 30,52 50,52 42,90 70,48 50,48 58,10"
          fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.3"/>
      </svg>
    `,
 
    // 💪 → 🎯 TARGET — Precision goals, personal training
    target: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="targetG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="targetGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#targetG)" stroke-width="2" opacity="0.3" filter="url(#targetGlow)"/>
        <circle cx="50" cy="50" r="28" fill="none" stroke="url(#targetG)" stroke-width="2.5" opacity="0.55"/>
        <circle cx="50" cy="50" r="16" fill="none" stroke="url(#targetG)" stroke-width="2.5" opacity="0.8"/>
        <circle cx="50" cy="50" r="6" fill="url(#targetG)" opacity="1"/>
        <line x1="50" y1="10" x2="50" y2="26" stroke="url(#targetG)" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
        <line x1="50" y1="74" x2="50" y2="90" stroke="url(#targetG)" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
        <line x1="10" y1="50" x2="26" y2="50" stroke="url(#targetG)" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
        <line x1="74" y1="50" x2="90" y2="50" stroke="url(#targetG)" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
      </svg>
    `,
 
    // 🏆 → 👑 CROWN — Elite status, champion mindset
    crown: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crownG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="crownGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M 15 68 L 15 40 L 30 55 L 50 22 L 70 55 L 85 40 L 85 68 Z"
          fill="none" stroke="url(#crownG)" stroke-width="2.8"
          stroke-linejoin="round" stroke-linecap="round"
          filter="url(#crownGlow)" opacity="0.95"/>
        <rect x="15" y="68" width="70" height="10" rx="2"
          fill="none" stroke="url(#crownG)" stroke-width="2.5" opacity="0.9"/>
        <circle cx="50" cy="22" r="3.5" fill="#FFD700" opacity="0.9"/>
        <circle cx="15" cy="40" r="3" fill="#FF3B3B" opacity="0.8"/>
        <circle cx="85" cy="40" r="3" fill="#FF3B3B" opacity="0.8"/>
      </svg>
    `,
 
    // 🔥 → ◈ DIAMOND — High intensity, cutting-edge programs
    diamondbolt: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dbG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF3B3B"/>
            <stop offset="50%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="dbGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <polygon points="50,10 82,50 50,90 18,50"
          fill="none" stroke="url(#dbG)" stroke-width="2.5"
          filter="url(#dbGlow)" opacity="0.85"/>
        <polygon points="50,26 66,50 50,74 34,50"
          fill="none" stroke="url(#dbG)" stroke-width="2" opacity="0.6"/>
        <circle cx="50" cy="50" r="5" fill="url(#dbG)" opacity="0.95"/>
        <line x1="50" y1="10" x2="50" y2="26" stroke="url(#dbG)" stroke-width="1.5" opacity="0.35"/>
        <line x1="50" y1="74" x2="50" y2="90" stroke="url(#dbG)" stroke-width="1.5" opacity="0.35"/>
        <line x1="18" y1="50" x2="34" y2="50" stroke="url(#dbG)" stroke-width="1.5" opacity="0.35"/>
        <line x1="66" y1="50" x2="82" y2="50" stroke="url(#dbG)" stroke-width="1.5" opacity="0.35"/>
      </svg>
    `,
 
    // ⏰ → ∞ INFINITY — Limitless, 24/7, endurance
    infinity: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="infG" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style="stop-color:#FF3B3B"/>
            <stop offset="50%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="infGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M 50 50
                 C 50 38, 35 28, 24 28
                 C 13 28, 10 36, 10 44
                 C 10 52, 13 60, 24 60
                 C 35 60, 50 50, 50 50
                 C 50 50, 65 40, 76 40
                 C 87 40, 90 48, 90 56
                 C 90 64, 87 72, 76 72
                 C 65 72, 50 62, 50 50 Z"
          fill="none" stroke="url(#infG)" stroke-width="5"
          stroke-linecap="round"
          filter="url(#infGlow)" opacity="0.95"/>
        <circle cx="50" cy="50" r="3" fill="#FFD700" opacity="0.8"/>
      </svg>
    `,
 
    // ✨ → ✦ COMPASS STAR — Transformation, excellence, results
    compassstar: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="csG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="csGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M 50 12 L 56 44 L 88 50 L 56 56 L 50 88 L 44 56 L 12 50 L 44 44 Z"
          fill="url(#csG)" opacity="0.9" filter="url(#csGlow)"/>
        <path d="M 50 28 L 53 47 L 72 50 L 53 53 L 50 72 L 47 53 L 28 50 L 47 47 Z"
          fill="none" stroke="#FFD700" stroke-width="1" opacity="0.35"/>
        <circle cx="50" cy="50" r="4" fill="#0A0A0A" opacity="0.8"/>
        <circle cx="50" cy="50" r="2" fill="#FFD700" opacity="0.9"/>
      </svg>
    `,
 
    // 📍 → ◎ SIGNAL PULSE — Location, live studio energy, presence
    signalpulse: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="spG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#FF3B3B"/>
          </linearGradient>
          <filter id="spGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#spG)" stroke-width="1.2" opacity="0.2"/>
        <circle cx="50" cy="50" r="28" fill="none" stroke="url(#spG)" stroke-width="1.8" opacity="0.4"/>
        <circle cx="50" cy="50" r="18" fill="none" stroke="url(#spG)" stroke-width="2.2" opacity="0.65"/>
        <circle cx="50" cy="50" r="9" fill="url(#spG)" opacity="1" filter="url(#spGlow)"/>
        <circle cx="50" cy="50" r="4" fill="#0A0A0A" opacity="0.9"/>
      </svg>
    `
  };
 
  return svgIcons;
}
 
/**
 * Inject SVG icons into feature cards
 */
function injectFeatureIcons() {
  const icons = createFeatureIcons();
 
  // Intentional emoji → icon replacements for stronger UI/UX:
  // 🏋️ → ⚡ Bolt        (raw power / strength training)
  // 💪 → 🎯 Target      (goal precision / personal training)
  // 🏆 → 👑 Crown       (elite / champion status)
  // 🔥 → ◈  Diamond     (intensity / high-performance)
  // ⏰ → ∞  Infinity    (unlimited access / 24-7)
  // ✨ → ✦  Compass Star (transformation / excellence)
  // 📍 → ◎  Signal Pulse (location / live energy)
  const iconMappings = {
    '🏋️': 'bolt',
    '💪': 'target',
    '🏆': 'crown',
    '🔥': 'diamondbolt',
    '⏰': 'infinity',
    '✨': 'compassstar',
    '📍': 'signalpulse'
  };
 
  document.querySelectorAll('.feature-icon, .program-card-img').forEach((element) => {
    const text = element.textContent.trim();
    const iconType = iconMappings[text];
 
    if (iconType && icons[iconType]) {
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.innerHTML = icons[iconType];
 
      element.innerHTML = '';
      element.appendChild(wrapper);
    }
  });
}
 
// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFeatureIcons);
} else {
  injectFeatureIcons();
}
 
window.createFeatureIcons = createFeatureIcons;
window.injectFeatureIcons = injectFeatureIcons;
 