// ============================================
// HERO GRAPHICS & ANIMATIONS
// 7 Muscle Fitness Studio
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  createHeroBackground();
  animateHeroElements();
});

// ============================================
// CREATE ANIMATED HERO BACKGROUND
// ============================================
function createHeroBackground() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Create SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 1200 800');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';

  // Define gradients
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  // Gold gradient
  const goldGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  goldGradient.setAttribute('id', 'goldGradient');
  goldGradient.setAttribute('x1', '0%');
  goldGradient.setAttribute('y1', '0%');
  goldGradient.setAttribute('x2', '100%');
  goldGradient.setAttribute('y2', '100%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#FFD700');
  stop1.setAttribute('stop-opacity', '0.3');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#FF3B3B');
  stop2.setAttribute('stop-opacity', '0.1');
  
  goldGradient.appendChild(stop1);
  goldGradient.appendChild(stop2);
  defs.appendChild(goldGradient);

  // Filter for glow
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'glow');
  filter.setAttribute('x', '-50%');
  filter.setAttribute('y', '-50%');
  filter.setAttribute('width', '200%');
  filter.setAttribute('height', '200%');
  
  const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  feGaussianBlur.setAttribute('stdDeviation', '4');
  feGaussianBlur.setAttribute('result', 'coloredBlur');
  
  filter.appendChild(feGaussianBlur);
  defs.appendChild(filter);

  svg.appendChild(defs);

  // Create animated shapes
  const shapes = [
    // Large circle top right
    {
      type: 'circle',
      x: 950,
      y: -100,
      r: 300,
      fill: 'url(#goldGradient)',
      opacity: 0.2,
      class: 'hero-shape-1'
    },
    // Medium circle bottom left
    {
      type: 'circle',
      x: -150,
      y: 700,
      r: 250,
      fill: 'url(#goldGradient)',
      opacity: 0.15,
      class: 'hero-shape-2'
    },
    // Geometric lines top
    {
      type: 'line',
      x1: 0,
      y1: 100,
      x2: 1200,
      y2: 100,
      stroke: '#FFD700',
      'stroke-width': 2,
      opacity: 0.1,
      class: 'hero-line-1'
    },
    // Diagonal lines
    {
      type: 'line',
      x1: 1200,
      y1: 0,
      x2: 0,
      y2: 400,
      stroke: '#FF3B3B',
      'stroke-width': 1.5,
      opacity: 0.08,
      class: 'hero-line-2'
    }
  ];

  shapes.forEach((shape) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', shape.type);
    
    Object.keys(shape).forEach((key) => {
      if (key !== 'type') {
        element.setAttribute(key, shape[key]);
      }
    });

    svg.appendChild(element);
  });

  // Clear and add SVG to hero background
  heroBg.innerHTML = '';
  heroBg.appendChild(svg);

  // Add CSS animations
  addHeroGraphicsStyles();
}

// ============================================
// ADD CSS ANIMATIONS FOR HERO GRAPHICS
// ============================================
function addHeroGraphicsStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-30px) translateX(20px); }
    }

    @keyframes float-slower {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(20px) translateX(-30px); }
    }

    @keyframes glow-pulse {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.35; }
    }

    @keyframes line-draw {
      0% { stroke-dashoffset: 1000; }
      100% { stroke-dashoffset: 0; }
    }

    .hero-shape-1 {
      animation: float-slow 6s ease-in-out infinite;
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.2));
    }

    .hero-shape-2 {
      animation: float-slower 8s ease-in-out infinite;
      filter: drop-shadow(0 0 15px rgba(255, 59, 59, 0.1));
    }

    .hero-line-1 {
      animation: glow-pulse 4s ease-in-out infinite;
    }

    .hero-line-2 {
      animation: glow-pulse 5s ease-in-out infinite;
      animation-delay: 0.5s;
    }

    /* Fade in animation for hero content */
    .hero-badge {
      animation: fadeInDown 0.8s ease-out 0.2s both;
    }

    .hero-title {
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .hero-sub {
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }

    .hero-ctas {
      animation: fadeInUp 0.8s ease-out 0.8s both;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  document.head.appendChild(style);
}

// ============================================
// ANIMATE HERO SECTION ELEMENTS
// ============================================
function animateHeroElements() {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    // Create rotating border effect
    const style = document.createElement('style');
    style.textContent = `
      .hero-visual {
        position: relative;
        overflow: hidden;
      }

      .hero-visual::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          rgba(255, 215, 0, 0.3) 0deg,
          rgba(255, 59, 59, 0.2) 90deg,
          rgba(255, 215, 0, 0.1) 180deg,
          rgba(255, 59, 59, 0.2) 270deg,
          rgba(255, 215, 0, 0.3) 360deg
        );
        animation: rotate-slow 20s linear infinite;
        z-index: -1;
      }

      @keyframes rotate-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulse-ring {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
        }
        70% {
          box-shadow: 0 0 0 30px rgba(255, 215, 0, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
        }
      }

      .hero-visual-inner {
        animation: pulse-ring 2s infinite;
      }
    `;

    document.head.appendChild(style);
  }
}

// ============================================
// CREATE SECTION GRAPHICS
// ============================================
function createSectionGraphics(sectionSelector, graphicType) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 1200 400');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.zIndex = '-1';
  svg.style.opacity = '0.05';

  // Add different graphic patterns
  if (graphicType === 'dots') {
    for (let x = 0; x < 1200; x += 80) {
      for (let y = 0; y < 400; y += 80) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', '#FFD700');
        svg.appendChild(circle);
      }
    }
  } else if (graphicType === 'lines') {
    for (let i = 0; i < 10; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', i * 50);
      line.setAttribute('x2', '1200');
      line.setAttribute('y2', i * 50);
      line.setAttribute('stroke', '#FFD700');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }
  }

  section.style.position = 'relative';
  section.appendChild(svg);
}

window.createSectionGraphics = createSectionGraphics;
