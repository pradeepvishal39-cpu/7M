// ============================================
// APP.JS — Shared utilities for all pages
// 7 Muscle Fitness Studio
// ============================================

const PHONE = '916382973619';
const WHATSAPP_MSG = encodeURIComponent('Hi! I want to know more about 7 Muscle Fitness Studio memberships.');

// ============================================
// AUTH NAV LINKS — wire static site to Next.js auth routes
// Set useLegacyAuth: true to fall back to dashboard.html (static-only hosting)
// Set nextOrigin for local dev when static site runs on a different port (e.g. 'http://localhost:3000')
// ============================================
const AUTH_NAV = {
  useLegacyAuth: false,
  nextOrigin: '',
};

window.AUTH_NAV = AUTH_NAV;

function initAuthNavLinks() {
  const loginUrl = AUTH_NAV.useLegacyAuth
    ? 'dashboard.html'
    : `${AUTH_NAV.nextOrigin}/login`;
  const accountUrl = AUTH_NAV.useLegacyAuth
    ? 'dashboard.html'
    : `${AUTH_NAV.nextOrigin}/dashboard`;

  document.querySelectorAll('[data-auth-login]').forEach(el => {
    el.setAttribute('href', loginUrl);
  });
  document.querySelectorAll('[data-auth-account]').forEach(el => {
    el.setAttribute('href', accountUrl);
  });
}

// ============================================
// NAVBAR
// ============================================
function getNavbarRollAnchor() {
  return document.querySelector('.hero-immersive, .page-hero');
}

function syncNavbarRollUp(navbar, rollAnchor, state) {
  let pastAnchor = false;

  if (rollAnchor) {
    pastAnchor = rollAnchor.getBoundingClientRect().bottom <= 0;
  } else {
    pastAnchor = window.scrollY > navbar.offsetHeight + 120;
  }

  if (pastAnchor !== state.lastRolledUp) {
    navbar.classList.toggle('navbar--rolled-up', pastAnchor);
    state.lastRolledUp = pastAnchor;
  }
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const urgencyBar = document.querySelector('.urgency-bar');
  const rollAnchor = getNavbarRollAnchor();
  const rollState = { lastRolledUp: false };

  // Fixed urgency bar + navbar — stay locked together (no gap on overscroll)
  if (urgencyBar && navbar) {
    let lastOffset = null;
    let lastScrolled = false;
    let barH = urgencyBar.offsetHeight;

    function updateHeaderMetrics() {
      barH = urgencyBar.offsetHeight;
      const navH = navbar.offsetHeight;
      document.documentElement.style.setProperty(
        '--site-header-h',
        `${barH + navH}px`,
      );
    }

    function syncNavbarTop() {
      const scrollY = Math.max(0, window.scrollY);
      const offset = Math.max(0, barH - scrollY);
      const urgencyShift = Math.min(scrollY, barH);

      urgencyBar.style.transform = `translate3d(0, -${urgencyShift}px, 0)`;

      if (lastOffset !== offset) {
        navbar.style.top = `${offset}px`;
        lastOffset = offset;
      }

      const isScrolled = scrollY >= barH;
      if (isScrolled !== lastScrolled) {
        navbar.classList.toggle('scrolled', isScrolled);
        lastScrolled = isScrolled;
      }

      syncNavbarRollUp(navbar, rollAnchor, rollState);
    }

    updateHeaderMetrics();
    syncNavbarTop();
    window.addEventListener('scroll', syncNavbarTop, { passive: true });
    window.addEventListener('resize', () => {
      updateHeaderMetrics();
      syncNavbarTop();
    });
  } else if (navbar) {
    let lastScrolled = false;

    function syncNavbarScroll() {
      const isScrolled = window.scrollY > 60;
      if (isScrolled !== lastScrolled) {
        navbar.classList.toggle('scrolled', isScrolled);
        lastScrolled = isScrolled;
      }

      syncNavbarRollUp(navbar, rollAnchor, rollState);
    }

    syncNavbarScroll();
    window.addEventListener('scroll', syncNavbarScroll, { passive: true });
  }

  // ---- Shared open/close helpers ----
  function openMenu() {
    if (!mobileNav) return;
    const navBottom = navbar ? navbar.getBoundingClientRect().bottom : 60;
    mobileNav.style.top = navBottom + 'px';
    mobileNav.classList.add('open');
    if (hamburger) {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('mobile-nav-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('mobile-nav-open');
    document.body.style.overflow = '';
  }

  // ---- Hamburger: TOGGLE (open if closed, close if open) ----
  if (hamburger && mobileNav) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobile-nav-panel');
    hamburger.setAttribute('aria-label', 'Open menu');
    mobileNav.id = mobileNav.id || 'mobile-nav-panel';
    mobileNav.setAttribute('role', 'navigation');
    mobileNav.setAttribute('aria-label', 'Mobile navigation');

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileNav.classList.contains('open')) {
        closeMenu();
        hamburger.setAttribute('aria-label', 'Open menu');
      } else {
        openMenu();
        hamburger.setAttribute('aria-label', 'Close menu');
      }
    });
  }

  // ---- Close button (✕) ----
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // ---- Close when user taps backdrop (outside nav links) ----
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMenu();
    });
  }

  // ---- Close on Escape key ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---- Close menu when a nav link or button is tapped ----
  if (mobileNav) {
    mobileNav.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => closeMenu());
    });
  }

  // ---- Close when tapping the backdrop ----
  document.addEventListener('click', (e) => {
    if (!mobileNav?.classList.contains('open')) return;
    const target = e.target;
    if (
      target instanceof Node &&
      !mobileNav.contains(target) &&
      !hamburger?.contains(target)
    ) {
      closeMenu();
      if (hamburger) hamburger.setAttribute('aria-label', 'Open menu');
    }
  });

  // Set active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0];
    if (cleanHref === path) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SCROLL ANIMATIONS - Now handled by loader.js using GSAP ScrollTrigger (more performant)
// Keeping function stub for backward compatibility
function initScrollAnimations() {
  // ScrollTrigger animations are now initialized in loader.js for better performance
  // and to avoid duplicate animation triggers
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown(targetDate) {
  const timer = document.getElementById('countdown-timer');
  if (!timer) return;

  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      timer.innerHTML = '<div class="countdown-unit"><div class="countdown-num">00</div><div class="countdown-label">Hours</div></div>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    timer.innerHTML = `
      ${d > 0 ? `<div class="countdown-unit"><div class="countdown-num">${pad(d)}</div><div class="countdown-label">Days</div></div>` : ''}
      <div class="countdown-unit"><div class="countdown-num">${pad(h)}</div><div class="countdown-label">Hours</div></div>
      <div class="countdown-unit"><div class="countdown-num">${pad(m)}</div><div class="countdown-label">Mins</div></div>
      <div class="countdown-unit"><div class="countdown-num">${pad(s)}</div><div class="countdown-label">Secs</div></div>
    `;
  }
  update();
  setInterval(update, 1000);
}

// ============================================
// EXIT INTENT POPUP
// ============================================
function initExitPopup() {
  const overlay = document.getElementById('exit-popup-overlay');
  if (!overlay) return;

  let shown = sessionStorage.getItem('exitPopupShown');
  if (shown) return;

  const closeBtn = overlay.querySelector('.exit-popup-close');

  document.addEventListener('mouseleave', e => {
    if (e.clientY <= 0 && !shown) {
      overlay.classList.add('show');
      shown = true;
      sessionStorage.setItem('exitPopupShown', '1');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
  }
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  // Mobile: show after 30s
  setTimeout(() => {
    if (!shown) {
      overlay.classList.add('show');
      shown = true;
      sessionStorage.setItem('exitPopupShown', '1');
    }
  }, 30000);
}

// ============================================
// WHATSAPP BUTTON
// ============================================
function initWhatsApp() {
  document.querySelectorAll('.whatsapp-btn, .whatsapp-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.open(`https://wa.me/${PHONE}?text=${WHATSAPP_MSG}`, '_blank');
    });
  });
}

// ============================================
// COUNTER ANIMATION (stats)
// ============================================
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const runAnimation = (el) => {
    let target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) {
      target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    }
    if (!isNaN(target)) {
      animateCounter(el, target);
    }
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const loader = document.getElementById('gsap-loader');
        const loaderVisible = loader && window.getComputedStyle(loader).display !== 'none';
        
        if (loaderVisible) {
          const onLoaderComplete = () => {
            runAnimation(entry.target);
            document.removeEventListener('loaderComplete', onLoaderComplete);
          };
          document.addEventListener('loaderComplete', onLoaderComplete);
        } else {
          runAnimation(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target], .stat-number').forEach(el => observer.observe(el));
}

// ============================================
// BOOKING FORM
// ============================================
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Booking...';
    btn.disabled = true;

    const data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      goal: form.goal.value,
      time_slot: form.time_slot.value
    };

    try {
      await window.bookingApi.submitBooking(data);
      showToast('Free trial booked! We\'ll call you soon 🏋️', 'success');
      setTimeout(() => {
        const success = document.getElementById('booking-success');
        if (success) success.style.display = 'block';
        form.style.display = 'none'; // Hides the old form to make the success state prominent
      }, 200);
    } catch (err) {
      const msg = err.message || 'Please try again or call us!';
      showToast(`Booking failed: ${msg}`, 'error');
      console.error('Supabase booking error:', err);
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

// ============================================
// MOBILE SLIDER: ZOOM FOCUS (No Infinite Loop)
// ============================================
function initMobileSliders() {
  const sliderGrids = document.querySelectorAll(
    '.programs-grid, .trainers-grid, .pricing-grid, .testimonials-grid, .features-grid'
  );
  if (!sliderGrids.length) return;

  if (window.innerWidth > 768) return;

  const observerOptions = {
    root: null,
    threshold: 0.6,
    rootMargin: '0px -25% 0px -25%'
  };

  sliderGrids.forEach(grid => {
    if (grid.dataset.mobileSlider === 'true') return;
    grid.dataset.mobileSlider = 'true';

    const items = Array.from(grid.children).filter(
      (el) => el.matches('.feature-card, .program-card, .trainer-card, .testimonial-card, .pricing-card, .pricing-luxury')
    );
    if (!items.length) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    const scrollToItem = (idx) => {
      const itemLeft = items[idx].offsetLeft;
      const itemWidth = items[idx].offsetWidth;
      const gridWidth = grid.offsetWidth;
      grid.scrollTo({
        left: itemLeft - (gridWidth / 2) + (itemWidth / 2),
        behavior: 'smooth'
      });
    };

    items.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        stopAutoPlay();
        scrollToItem(idx);
        startAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
    grid.insertAdjacentElement('afterend', dotsContainer);
    const dots = dotsContainer.querySelectorAll('.slider-dot');

    const focalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sisters = grid.querySelectorAll('.centered');
          sisters.forEach(s => s.classList.remove('centered'));
          entry.target.classList.add('centered');

          // Update dots
          const idx = items.indexOf(entry.target);
          if (idx !== -1) {
            dots.forEach(d => d.classList.remove('active'));
            dots[idx].classList.add('active');
          }
        }
      });
    }, observerOptions);

    // Start focal observer on all items
    items.forEach(item => focalObserver.observe(item));

    // Auto-roller (Auto-play)
    let autoPlayInterval;
    const startAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        let currentIdx = Array.from(dots).findIndex(d => d.classList.contains('active'));
        if (currentIdx === -1) currentIdx = 0;
        const nextIdx = (currentIdx + 1) % items.length;
        scrollToItem(nextIdx);
      }, 3500);
    };
    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    grid.addEventListener('touchstart', stopAutoPlay, { passive: true });
    grid.addEventListener('touchend', () => {
      setTimeout(startAutoPlay, 2000); // Wait 2s after touch ends before resuming auto-play
    }, { passive: true });
    
    startAutoPlay();
  });
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initAuthNavLinks();
  initNavbar();
  initScrollAnimations();
  initExitPopup();
  initWhatsApp();
  if (typeof gsap === 'undefined') {
    initCounters();
  }
  initBookingForm();
  initMobileSliders();

  // Default countdown: 3 days from now
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59);
  initCountdown(target);
});

window.showToast = window.showToast || function(msg, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 4000);
};
