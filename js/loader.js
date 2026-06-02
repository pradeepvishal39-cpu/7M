// ============================================
// PREMIUM GSAP LOADER ANIMATION
// 7 Muscle Fitness Studio
// ============================================

// Check if loader should be shown (first load, not navigation)
function shouldShowLoader() {
  if (typeof window === 'undefined') return false;
  
  // Check if we've already shown the loader in this session
  const loaderShown = sessionStorage.getItem('7muscle-loader-shown');
  return loaderShown !== 'true';
}


// Initialize loader animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const fadeNodes = document.querySelectorAll('.fade-in-up');

  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.log('GSAP not available, skipping loader');
    completeLoaderAnimation();
    return;
  }

  // Only show loader on first load
  if (!shouldShowLoader()) {
    completeLoaderAnimation();
    return;
  }

  try {
    const logoElement = document.querySelector('.loader-logo');
    const taglineElement = document.querySelector('.loader-tagline');
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('gsap-loader');
    const hero = document.querySelector('.hero');

    if (!logoElement || !taglineElement || !mainContent || !loader) {
      console.log('Required loader elements not found');
      completeLoaderAnimation();
      return;
    }

    // Enable GPU acceleration
    gsap.config({ force3D: true });

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide loader
        if (loader) loader.style.display = 'none';
        // Mark as shown
        sessionStorage.setItem('7muscle-loader-shown', 'true');
        // Re-enable scroll
        document.documentElement.style.overflowY = 'auto';
        // Scroll to hash if present
        if (window.location.hash) {
          const element = document.querySelector(window.location.hash);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
        // Initialize scroll animations after a brief delay
        setTimeout(() => {
          initScrollAnimations();
          document.dispatchEvent(new CustomEvent('loaderComplete'));
        }, 100);
      }
    });

    // ============================================
    // SIMPLIFIED ANIMATION SEQUENCE
    // ============================================

    // Logo fade in
    tl.to(logoElement, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 0);

    // Tagline fade in (simultaneous)
    tl.to(taglineElement, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 0);

    // Scale effect
    tl.to('.loader-content', {
      scale: 1.05,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0.3);

    // Hold
    tl.to({}, {}, '+=1');

    // Content fade in
    tl.to(mainContent, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4');

    // Loader exit
    tl.to(loader, {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.inOut',
    }, '-=0.4');

  } catch (error) {
    console.error('Loader error:', error);
    completeLoaderAnimation();
  }
});


// Initialize scroll-triggered fade-up animations
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.fade-in-up').forEach((element) => element.classList.add('visible'));
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);

    // Animate all .fade-in-up elements on viewport entry
    gsap.utils.toArray('.fade-in-up').forEach((element) => {
      // Skip if already animated
      if (element.classList.contains('visible')) return;

      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        onStart: () => {
          element.classList.add('visible');
        },
      });
    });


  } catch (error) {
    console.warn('Scroll animation error:', error.message);
  }
}

// Fallback function to complete loader if GSAP fails
function completeLoaderAnimation() {
  const loader = document.getElementById('gsap-loader');
  const mainContent = document.getElementById('main-content');

  if (loader) loader.style.display = 'none';
  if (mainContent) mainContent.classList.add('loaded');

  sessionStorage.setItem('7muscle-loader-shown', 'true');
  document.documentElement.style.overflowY = 'auto';
  // Scroll to hash if present
  if (window.location.hash) {
    const element = document.querySelector(window.location.hash);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
  initScrollAnimations();
  document.querySelectorAll('.fade-in-up').forEach((element) => element.classList.add('visible'));

  // Dispatch loaderComplete event
  document.dispatchEvent(new CustomEvent('loaderComplete'));
}

// Prevent scroll during loader animation
document.documentElement.style.overflowY = 'hidden';
