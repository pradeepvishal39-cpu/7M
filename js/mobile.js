/**
 * 7 Muscle Fitness — Mobile & responsive interactions
 * Hamburger overlay, scroll-spy, stat counters, carousels, pricing center
 */
(function () {
  'use strict';

  const MOBILE_MQ = window.matchMedia('(max-width: 768px)');
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isMobile() {
    return MOBILE_MQ.matches;
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function whenLoaderDone(fn) {
    const loader = document.getElementById('gsap-loader');
    if (!loader || window.getComputedStyle(loader).display === 'none') {
      fn();
      return;
    }
    const run = () => {
      document.removeEventListener('loaderComplete', run);
      fn();
    };
    document.addEventListener('loaderComplete', run);
    setTimeout(run, 4000);
  }

  // ── 1. Mobile nav overlay (single navbar) ─────────────────────────
  function initMobileNav() {
    const navbar = document.querySelector('.navbar');
    const overlay = document.getElementById('nav-overlay');
    const hamburger = document.querySelector('.hamburger');
    const closeBtn = document.querySelector('.nav-overlay-close');

    if (!navbar || !overlay || !hamburger) return;

    function openMenu() {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('mobile-nav-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('mobile-nav-open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (overlay.classList.contains('open')) closeMenu();
      else openMenu();
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });

    overlay.querySelectorAll('.nav-overlay-links a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
    });

    MOBILE_MQ.addEventListener('change', () => {
      if (!isMobile()) closeMenu();
    });
  }

  // ── 2. Scroll-spy for nav links ───────────────────────────────────
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const navLinks = document.querySelectorAll(
      '.nav-links a[href*="#"], .nav-overlay-links a[href*="#"]'
    );
    if (!navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const hash = href.includes('#') ? href.split('#')[1] : '';
            link.classList.toggle('active', hash === id);
          });
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  // ── 3. Stat counters (viewport threshold 0.5) ─────────────────────
  function animateCounter(el, target, duration = 1500) {
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * target);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }

  function initStatsCounter() {
    const row = document.querySelector('.hero-stats-glass');
    const targets = row
      ? row.querySelectorAll('[data-target]')
      : document.querySelectorAll('.hero-stat-num[data-target], [data-target].hero-stat-num');

    if (!targets.length) return;

    const runAll = () => {
      targets.forEach((el) => {
        if (el.dataset.counted === 'true') return;
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        el.dataset.counted = 'true';
        let suffix = el.dataset.suffix || '';
        if (!suffix && el.closest('.hero-stats-glass') && (target === 500 || target === 90)) {
          suffix = '+';
        }
        el.dataset.suffix = suffix;
        animateCounter(el, target);
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          whenLoaderDone(runAll);
          io.disconnect();
        });
      },
      { threshold: 0.5 }
    );

    io.observe(row || targets[0]);
  }

  // ── 4. Swipe hint (fade after 3s) ─────────────────────────────────
  function addSwipeHint(grid, label) {
    if (!isMobile() || grid.querySelector('.swipe-hint')) return;
    const hint = document.createElement('p');
    hint.className = 'swipe-hint';
    hint.textContent = label || '← swipe →';
    hint.setAttribute('aria-hidden', 'true');
    grid.insertAdjacentElement('afterend', hint);
    requestAnimationFrame(() => hint.classList.add('swipe-hint--fade'));
    setTimeout(() => hint.remove(), 3500);
  }

  // ── 5. Pricing auto-center featured card ──────────────────────────
  function initPricingCenter() {
    const grid = document.querySelector('.pricing-grid');
    if (!grid || !isMobile()) return;

    const featured =
      grid.querySelector('.pricing-card.featured') ||
      grid.querySelector('.pricing-luxury.featured');
    if (!featured) return;

    const center = () => {
      featured.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    };

    whenLoaderDone(() => {
      requestAnimationFrame(center);
      setTimeout(center, 100);
    });

    addSwipeHint(grid, '← swipe →');
  }

  // ── 6. Reviews carousel (mobile scroll + dots + autoplay) ─────────
  function initReviewsMobile() {
    const container = document.getElementById('reviews-carousel');
    if (!container) return;

    const viewport = container.querySelector('.reviews-carousel__viewport');
    const track = container.querySelector('.reviews-carousel__track');
    const slides = container.querySelectorAll('.reviews-slide');
    const dotsContainer = container.querySelector('.reviews-dots');

    if (!viewport || !track || !slides.length) return;

    let autoplayTimer = null;
    let touchPaused = false;
    const AUTO_MS = 5000;

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Review ${i + 1} of ${slides.length}`);
        dot.addEventListener('click', () => {
          slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          stopAutoplay();
          touchPaused = true;
          setTimeout(() => {
            touchPaused = false;
            startAutoplay();
          }, 8000);
        });
        dotsContainer.appendChild(dot);
      });
    }

    function setActiveDot(index) {
      dotsContainer?.querySelectorAll('.reviews-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
    }

    function getActiveIndex() {
      const vp = viewport.getBoundingClientRect();
      const center = vp.left + vp.width / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const r = slide.getBoundingClientRect();
        const slideCenter = r.left + r.width / 2;
        const dist = Math.abs(slideCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function scrollToIndex(index) {
      const i = ((index % slides.length) + slides.length) % slides.length;
      slides[i].scrollIntoView({
        behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      if (!isMobile() || touchPaused || REDUCED_MOTION.matches || document.hidden) return;
      autoplayTimer = setInterval(() => {
        scrollToIndex(getActiveIndex() + 1);
      }, AUTO_MS);
    }

    function enableScrollMode() {
      container.classList.add('reviews-scroll-mode');
      track.style.transform = 'none';
      track.classList.add('no-transition');
      buildDots();

      let scrollTicking = false;
      viewport.addEventListener(
        'scroll',
        () => {
          if (scrollTicking) return;
          scrollTicking = true;
          requestAnimationFrame(() => {
            setActiveDot(getActiveIndex());
            scrollTicking = false;
          });
        },
        { passive: true }
      );

      viewport.addEventListener(
        'touchstart',
        () => {
          stopAutoplay();
          touchPaused = true;
        },
        { passive: true }
      );
      viewport.addEventListener(
        'touchend',
        () => {
          setTimeout(() => {
            touchPaused = false;
            startAutoplay();
          }, 5000);
        },
        { passive: true }
      );

      setActiveDot(0);
      startAutoplay();

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoplay();
        else startAutoplay();
      });
    }

    function enableDesktopGrid() {
      container.classList.remove('reviews-scroll-mode');
      stopAutoplay();
    }

    function applyMode() {
      if (isMobile()) enableScrollMode();
      else enableDesktopGrid();
    }

    applyMode();
    MOBILE_MQ.addEventListener('change', applyMode);

    const visObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isMobile()) startAutoplay();
          else stopAutoplay();
        });
      },
      { threshold: 0.2 }
    );
    visObserver.observe(container);
  }

  // ── 7. Navbar scroll blur (supplement) ────────────────────────────
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    document.documentElement.style.setProperty('--nav-height', '64px');

    const onScroll = () => {
      navbar.classList.toggle('navbar--blur', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Init ──────────────────────────────────────────────────────────
  onReady(() => {
    initMobileNav();
    initScrollSpy();
    initNavbarScroll();
    whenLoaderDone(() => {
      initStatsCounter();
      initPricingCenter();
    });
    initReviewsMobile();

    document.querySelectorAll('.programs-grid, .bento-grid').forEach((grid) => {
      if (isMobile()) addSwipeHint(grid, '← swipe →');
    });

    MOBILE_MQ.addEventListener('change', () => {
      if (isMobile()) initPricingCenter();
    });
  });
})();
