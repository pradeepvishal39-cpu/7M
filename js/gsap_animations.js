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
      const isPlus = element.innerText.includes('+');
      
      // Ensure text is visible immediately if JS fails
      element.style.visibility = 'visible';

      ScrollTrigger.create({
        trigger: element,
        start: 'top 95%',
        once: true,
        onEnter: () => {
          let proxy = { val: 0 };
          gsap.to(proxy, {
            val: targetValue,
            duration: 2.5,
            ease: 'expo.out',
            onUpdate: function () {
              element.textContent = Math.floor(proxy.val) + (isPlus ? '+' : '');
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

// Reviews carousel handled by js/sliders.js (all breakpoints)
