// ============================================
// LUXURY GSAP ANIMATIONS & SLIDERS
// ============================================

function initAllAnimations() {
  if (window.gsapAnimationsInitialized) return;
  window.gsapAnimationsInitialized = true;

  try {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. HERO TEXT REVEAL
    const revealText = document.querySelectorAll('.reveal-text span');
    if (revealText.length > 0) {
      gsap.to(revealText, {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2,
        delay: 0.5
      });
    }

    // 2. PARALLAX BACKGROUNDS
    gsap.utils.toArray('.gs-parallax').forEach(section => {
      const speed = section.dataset.speed || 0.5;
      gsap.to(section, {
        yPercent: 30 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: section.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // 3. STAGGER REVEALS (Bento, Features, Pricing)
    gsap.utils.toArray('.gs-stagger').forEach(container => {
      const items = container.children;
      gsap.fromTo(items, 
        { y: 80, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
          }
        }
      );
    });

    // 4. GENERAL FADE IN / REVEALS (skip carousel — scale clips avatars)
    gsap.utils.toArray('.gs-reveal:not(#reviews-carousel)').forEach(element => {
      gsap.fromTo(element,
        { y: 60, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          }
        }
      );
    });

    const reviewsCarousel = document.getElementById('reviews-carousel');
    if (reviewsCarousel) {
      gsap.fromTo(reviewsCarousel,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: reviewsCarousel,
            start: 'top 88%',
          }
        }
      );
    }

    // 5. NUMBER COUNTERS
    gsap.utils.toArray('[data-target]').forEach((element) => {
      const targetValue = parseInt(element.getAttribute('data-target'), 10);
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to({ value: 0 }, {
            value: targetValue,
            duration: 2.5,
            ease: 'power4.out',
            onUpdate: function () {
              element.textContent = Math.floor(this.targets()[0].value) + (element.dataset.target == 500 || element.dataset.target == 90 ? '+' : '');
            },
          });
        }
      });
    });

    // 6. BUTTON & CARD HOVER EFFECTS
    gsap.utils.toArray('.feature-card, .trainer-luxury-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { scale: 1.03, y: -4, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { scale: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    // 7. MAGNETIC BUTTONS - REMOVED PER USER REQUEST
    // Button magnetic micro-interaction removed.

    console.log('✅ Premium GSAP animations initialized');
  } catch (error) {
    console.warn('GSAP animation error:', error.message);
  }
}

window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not available');
    return;
  }

  const loader = document.getElementById('gsap-loader');
  const loaderVisible = loader && window.getComputedStyle(loader).display !== 'none';

  if (!loaderVisible || sessionStorage.getItem('7muscle-loader-shown') === 'true') {
    initAllAnimations();
  } else {
    document.addEventListener('loaderComplete', initAllAnimations);
  }
});

// 8. CLIP-PATH REVEALS
if (typeof gsap !== 'undefined') {
  gsap.utils.toArray('.clip-reveal').forEach(img => {
    gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.8, ease: 'power4.out', scrollTrigger: { trigger: img, start: 'top 85%' } });
  });
}

// ============================================
// REVIEWS / TESTIMONIALS CAROUSEL (standalone)
// ============================================
function initReviewsSlider() {
  const section = document.getElementById('reviews');
  const container = document.getElementById('reviews-carousel');
  if (!section || !container || container.dataset.reviewsReady === 'true') return;

  const viewport = container.querySelector('.reviews-carousel__viewport');
  const track = container.querySelector('.reviews-carousel__track');
  const slides = container.querySelectorAll('.reviews-slide');
  const dotsContainer = container.querySelector('.reviews-dots');

  if (!viewport || !track || slides.length === 0) return;

  if (container.dataset.reviewsReady === 'true') return;
  container.dataset.reviewsReady = 'true';

  const totalSlides = slides.length;
  const AUTOPLAY_MS = 5000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentIndex = 0;
  let autoplayInterval = null;
  let autoplayEnabled = true;
  let pausedUntilScroll = false;

  function getSlideWidth() {
    return viewport.clientWidth || viewport.getBoundingClientRect().width;
  }

  function syncSlideWidths() {
    return getSlideWidth() > 0;
  }

  function getTrackOffset() {
    const slide = slides[currentIndex];
    return slide ? slide.offsetLeft : currentIndex * getSlideWidth();
  }

  function setActiveSlide() {
    slides.forEach((slide, i) => {
      const active = i === currentIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dotsContainer?.querySelectorAll('.reviews-dot').forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function setTrackPosition(animate) {
    if (!syncSlideWidths()) return;
    const offset = getTrackOffset();

    if (animate && !prefersReducedMotion) {
      track.classList.remove('no-transition');
    } else {
      track.classList.add('no-transition');
      requestAnimationFrame(() => track.classList.remove('no-transition'));
    }

    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    setActiveSlide();
  }

  function goTo(index, animate = true) {
    currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
    setTrackPosition(animate);
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function runAutoplayInterval() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      next();
    }, AUTOPLAY_MS);
  }

  function startAutoplay() {
    stopAutoplay();
    if (!autoplayEnabled || document.hidden || pausedUntilScroll) return;
    runAutoplayInterval();
  }

  /** Manual slide change — stay paused until the user scrolls the page */
  function pauseAutoplayUntilScroll() {
    stopAutoplay();
    pausedUntilScroll = true;
  }

  function resumeIfScrollPaused() {
    if (!pausedUntilScroll) return;
    if (!autoplayEnabled || document.hidden) return;
    pausedUntilScroll = false;
    startAutoplay();
  }

  window.addEventListener('scroll', resumeIfScrollPaused, { passive: true });

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Review ${i + 1} of ${totalSlides}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(i);
        pauseAutoplayUntilScroll();
      });
      dotsContainer.appendChild(dot);
    }
  }

  const DRAG_THRESHOLD = 40;
  let startX = 0;
  let isDragging = false;
  let activePointerId = null;

  function endDrag(clientX, pointerId) {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    if (pointerId != null) {
      try { viewport.releasePointerCapture(pointerId); } catch (_) { /* noop */ }
    }
    activePointerId = null;

    const diff = startX - clientX;
    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) next();
      else prev();
    }
    pauseAutoplayUntilScroll();
  }

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    activePointerId = e.pointerId;
    startX = e.clientX;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
    stopAutoplay();
  });

  viewport.addEventListener('pointerup', (e) => {
    if (activePointerId !== e.pointerId) return;
    endDrag(e.clientX, e.pointerId);
  });

  viewport.addEventListener('pointercancel', (e) => {
    if (activePointerId !== e.pointerId) return;
    endDrag(e.clientX, e.pointerId);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
      pauseAutoplayUntilScroll();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
      pauseAutoplayUntilScroll();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (!pausedUntilScroll) {
      startAutoplay();
    }
  });

  const resizeObserver = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(() => {
        syncSlideWidths();
        goTo(currentIndex, false);
      })
    : null;
  resizeObserver?.observe(viewport);

  window.addEventListener('resize', () => {
    syncSlideWidths();
    goTo(currentIndex, false);
  });

  function boot() {
    goTo(0, false);
    startAutoplay();
  }

  boot();

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          autoplayEnabled = entry.isIntersecting;
          if (autoplayEnabled && !pausedUntilScroll) {
            startAutoplay();
          } else if (!autoplayEnabled) {
            stopAutoplay();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(container);
  }
}

function bootReviewsSliderWhenReady() {
  if (!document.getElementById('reviews-carousel')) return;
  initReviewsSlider();
}

bootReviewsSliderWhenReady();
document.addEventListener('DOMContentLoaded', bootReviewsSliderWhenReady);
window.addEventListener('load', bootReviewsSliderWhenReady);
setTimeout(bootReviewsSliderWhenReady, 800);
