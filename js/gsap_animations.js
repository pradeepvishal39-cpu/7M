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
  const container = document.getElementById('reviews-carousel');
  if (!container || container.dataset.reviewsReady === 'true') return;
  
  // Only apply infinite mobile slider if on mobile view
  if (window.innerWidth > 768) return;

  const viewport = container.querySelector('.reviews-carousel__viewport');
  const track = container.querySelector('.reviews-carousel__track');
  const originalSlides = Array.from(container.querySelectorAll('.reviews-slide'));
  let dotsContainer = container.querySelector('.reviews-dots');

  if (!viewport || !track || originalSlides.length === 0) return;

  container.dataset.reviewsReady = 'true';

  const AUTOPLAY_MS = 5000;
  let currentIndex = 1; // Start at 1 because 0 is the prepended clone
  let autoplayInterval = null;
  let isTransitioning = false;

  // 1. Clone slides for infinite loop
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

  firstClone.classList.add('clone');
  lastClone.classList.add('clone');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalSlides[0]);

  const allSlides = Array.from(track.children);

  // 2. Setup track styles
  track.style.display = 'flex';
  track.style.transition = 'none';
  track.style.transform = `translateX(-100%)`;

  // 3. Setup Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    originalSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i + 1));
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.reviews-dot');
    dots.forEach(d => d.classList.remove('active'));
    
    // Calculate real index
    let realIndex = currentIndex - 1;
    if (currentIndex === 0) realIndex = originalSlides.length - 1;
    if (currentIndex === allSlides.length - 1) realIndex = 0;
    
    if (dots[realIndex]) dots[realIndex].classList.add('active');
  };

  const goToSlide = (index, smooth = true) => {
    if (isTransitioning && smooth) return;
    currentIndex = index;
    
    track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    updateDots();

    if (smooth) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
        // Loop back seamlessly
        if (currentIndex === 0) {
          goToSlide(originalSlides.length, false);
        } else if (currentIndex === allSlides.length - 1) {
          goToSlide(1, false);
        }
      }, 500);
    }
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  // 4. Auto Play
  const startAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_MS);
  };

  const stopAutoplay = () => clearInterval(autoplayInterval);

  // 5. Touch / Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    stopAutoplay();
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  // Run on load
  setTimeout(() => {
    goToSlide(1, false);
    startAutoplay();
  }, 100);
}

function bootReviewsSliderWhenReady() {
  if (!document.getElementById('reviews-carousel')) return;
  initReviewsSlider();
}

bootReviewsSliderWhenReady();
document.addEventListener('DOMContentLoaded', bootReviewsSliderWhenReady);
window.addEventListener('load', bootReviewsSliderWhenReady);
setTimeout(bootReviewsSliderWhenReady, 800);
