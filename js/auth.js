// ============================================
// AUTH.JS — Authentication logic
// 7 Muscle Fitness Studio
// ============================================

// ============================================
// AUTH FORM TOGGLE
// ============================================
function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const toSignup = document.getElementById('to-signup');
  const toLogin = document.getElementById('to-login');
  const authTitle = document.getElementById('auth-title');
  const authSub = document.getElementById('auth-sub');

  if (toSignup) {
    toSignup.addEventListener('click', e => {
      e.preventDefault();
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      if (authTitle) authTitle.textContent = 'Create Account';
      if (authSub) authSub.textContent = 'Join the 7 Muscle family today';
    });
  }
  if (toLogin) {
    toLogin.addEventListener('click', e => {
      e.preventDefault();
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
      if (authTitle) authTitle.textContent = 'Welcome Back';
      if (authSub) authSub.textContent = 'Sign in to your account';
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = loginForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      try {
        const rememberMe = loginForm.querySelector('[name="remember"]')?.checked ?? true;
        await window.auth.signIn(loginForm.email.value, loginForm.password.value, rememberMe);
        window.location.href = 'dashboard.html';
      } catch (err) {
        window.showToast(err.message || 'Login failed. Check credentials.', 'error');
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });
  }

  // Sign up
  if (signupForm) {
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = signupForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Creating account...';
      btn.disabled = true;
      try {
        await window.auth.signUp(
          signupForm.email.value,
          signupForm.password.value,
          signupForm.name.value,
          signupForm.phone.value
        );
        window.showToast('Account created! Check your email to verify.', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
      } catch (err) {
        window.showToast(err.message || 'Sign up failed. Try again.', 'error');
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });
  }

  // Google Login
  const googleBtn = document.getElementById('google-signin-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const orig = googleBtn.innerHTML;
      googleBtn.innerHTML = 'Connecting...';
      googleBtn.disabled = true;
      try {
        await window.auth.signInWithGoogle();
      } catch (err) {
        window.showToast(err.message || 'Google login failed.', 'error');
        googleBtn.innerHTML = orig;
        googleBtn.disabled = false;
      }
    });
  }

  // Forgot password
  const forgotForm = document.getElementById('forgot-password-form');
  const forgotLink = document.getElementById('forgot-password-link');
  const forgotPanel = document.getElementById('forgot-password-form');
  const backToLogin = document.getElementById('back-to-login');

  if (forgotLink && forgotPanel && loginForm) {
    forgotLink.addEventListener('click', e => {
      e.preventDefault();
      loginForm.style.display = 'none';
      if (signupForm) signupForm.style.display = 'none';
      forgotPanel.style.display = 'block';
      if (authTitle) authTitle.textContent = 'Reset Password';
      if (authSub) authSub.textContent = 'Enter your email for a reset link';
    });
  }

  if (backToLogin && forgotPanel && loginForm) {
    backToLogin.addEventListener('click', e => {
      e.preventDefault();
      forgotPanel.style.display = 'none';
      loginForm.style.display = 'block';
      if (authTitle) authTitle.textContent = 'Welcome Back';
      if (authSub) authSub.textContent = 'Sign in to your account';
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = forgotForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        await window.auth.resetPasswordForEmail(forgotForm.email.value);
        window.showToast('If an account exists, a reset link has been sent.', 'success');
      } catch (err) {
        window.showToast(err.message || 'Could not send reset link.', 'error');
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });
  }
}

// ============================================
// DASHBOARD DATA LOADER
// ============================================
async function initDashboard() {
  const user = await window.auth.getCurrentUser();

  if (!user) {
    // Not logged in — redirect to login
    const authCheck = document.getElementById('auth-check');
    if (authCheck) {
      authCheck.style.display = 'block';
      document.getElementById('dashboard-main').style.display = 'none';
    }
    return;
  }

  // Show user name
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = user.user_metadata?.name || user.email.split('@')[0];

  // Load bookings
  try {
    const bookings = await window.bookingApi.getMyBookings();
    renderBookings(bookings);
  } catch (e) { console.error(e); }

  // Load membership
  try {
    const membership = await window.membershipApi.getMyMembership();
    renderMembership(membership);
  } catch (e) { console.error(e); }
}

function renderBookings(bookings) {
  const tbody = document.getElementById('bookings-tbody');
  const count = document.getElementById('bookings-count');
  if (count) count.textContent = bookings.length;
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--gray);padding:32px">No bookings yet. <a href="booking.html" style="color:var(--gold)">Book your free trial!</a></td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${new Date(b.created_at).toLocaleDateString('en-IN')}</td>
      <td>${b.goal || '—'}</td>
      <td>${b.time_slot || '—'}</td>
      <td><span class="badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'cancelled' ? 'red' : 'gold'}">${b.status}</span></td>
    </tr>
  `).join('');
}

function renderMembership(membership) {
  const el = document.getElementById('membership-status');
  const planEl = document.getElementById('membership-plan');
  if (!el) return;

  if (!membership) {
    el.textContent = 'No Active Plan';
    el.className = 'badge badge-gray';
    if (planEl) planEl.innerHTML = `<a href="membership.html" class="btn btn-gold btn-sm">Get Membership</a>`;
    return;
  }

  const planNames = { monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Annual' };
  el.textContent = 'Active';
  el.className = 'badge badge-green';
  if (planEl) planEl.textContent = planNames[membership.plan] || membership.plan;

  const startEl = document.getElementById('membership-start');
  if (startEl) startEl.textContent = new Date(membership.start_date).toLocaleDateString('en-IN');
}

// ============================================
// ADMIN DASHBOARD
// ============================================
async function initAdminDashboard() {
  const user = await window.auth.getCurrentUser();
  if (!user) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (!window.auth.isAdmin(user)) {
    window.showToast('Access denied. Admin privileges required.', 'error');
    window.location.href = 'dashboard.html';
    return;
  }

  // Load all data
  loadAdminBookings();
  loadAdminUsers();
  loadAdminMemberships();
}

async function loadAdminBookings() {
  try {
    const bookings = await window.adminApi.getAllBookings();
    const tbody = document.getElementById('admin-bookings-tbody');
    const countEl = document.getElementById('admin-bookings-count');
    if (countEl) countEl.textContent = bookings.length;
    if (!tbody) return;

    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>${b.name}</td>
        <td>${b.phone}</td>
        <td>${b.goal || '—'}</td>
        <td>${b.time_slot || '—'}</td>
        <td><span class="badge badge-${b.status === 'confirmed' ? 'green' : b.status === 'cancelled' ? 'red' : 'gold'}">${b.status}</span></td>
        <td>
          <div style="display:flex;gap:8px">
            <button onclick="updateStatus('${b.id}','confirmed')" class="btn btn-sm btn-outline-gold">Confirm</button>
            <button onclick="updateStatus('${b.id}','cancelled')" class="btn btn-sm" style="background:var(--red);color:#fff;padding:10px 16px;font-size:11px;font-weight:700">Cancel</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (e) { console.error(e); }
}

async function loadAdminUsers() {
  try {
    const users = await window.adminApi.getAllUsers();
    const tbody = document.getElementById('admin-users-tbody');
    const countEl = document.getElementById('admin-users-count');
    if (countEl) countEl.textContent = users.length;
    if (!tbody) return;

    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.name || '—'}</td>
        <td>${u.email || '—'}</td>
        <td>${u.phone || '—'}</td>
        <td>${new Date(u.created_at).toLocaleDateString('en-IN')}</td>
      </tr>
    `).join('');
  } catch (e) { console.error(e); }
}

async function loadAdminMemberships() {
  try {
    const memberships = await window.adminApi.getAllMemberships();
    const countEl = document.getElementById('admin-memberships-count');
    if (countEl) countEl.textContent = memberships.filter(m => m.payment_status === 'paid').length;

    // Render table if tbody exists
    const tbody = document.getElementById('admin-memberships-tbody');
    const paid = memberships.filter(m => m.payment_status === 'paid');
    const countEl2 = document.getElementById('admin-memberships-count2');
    if (countEl2) countEl2.textContent = paid.length;

    if (!tbody) return;
    if (memberships.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:32px">No memberships yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = memberships.map(m => `
      <tr>
        <td>${m.users?.name || '—'}</td>
        <td>${m.users?.email || '—'}</td>
        <td><span class="badge badge-gold">${m.plan}</span></td>
        <td><span class="badge badge-${m.payment_status === 'paid' ? 'green' : 'gray'}">${m.payment_status}</span></td>
        <td>${m.start_date ? new Date(m.start_date).toLocaleDateString('en-IN') : '—'}</td>
      </tr>
    `).join('');
  } catch (e) { console.error(e); }
}

async function updateStatus(id, status) {
  try {
    await window.adminApi.updateBookingStatus(id, status);
    window.showToast(`Booking ${status}!`, 'success');
    loadAdminBookings();
  } catch (e) {
    window.showToast('Update failed', 'error');
  }
}

window.updateStatus = updateStatus;

// Sidebar navigation
function initSidebarNav() {
  const links = document.querySelectorAll('.sidebar-link[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  links.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.section;
      links.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.style.display = 'none');
      link.classList.add('active');
      const sec = document.getElementById(target);
      if (sec) sec.style.display = 'block';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthForms();
  initSidebarNav();

  const isDash = document.body.classList.contains('dashboard-page');
  const isAdmin = document.body.classList.contains('admin-page');
  if (isDash) initDashboard();
  if (isAdmin) initAdminDashboard();

  // Logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => window.auth.signOut());
  });
});
