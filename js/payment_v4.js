// ============================================
// RAZORPAY PAYMENT INTEGRATION (secure)
// 7 Muscle Fitness Studio
//
// Security model:
// - Amounts & orders created server-side (never trust client amounts)
// - Payment signature verified server-side before membership activation
// - Razorpay secret key NEVER loaded in browser
// ============================================

function getPaymentsApiBase() {
  const nav = window.AUTH_NAV || {};
  return nav.nextOrigin || '';
}

async function getAuthHeaders() {
  if (!window.db?.auth) {
    throw new Error('Auth not initialized');
  }
  const { data: { session } } = await window.db.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

function getLoginRedirectUrl() {
  const nav = window.AUTH_NAV || {};
  if (nav.useLegacyAuth) return 'dashboard.html';
  return `${nav.nextOrigin || ''}/login`;
}

function getDashboardRedirectUrl() {
  const nav = window.AUTH_NAV || {};
  if (nav.useLegacyAuth) return 'dashboard.html';
  return `${nav.nextOrigin || ''}/dashboard`;
}

// ============================================
// INITIATE PAYMENT
// ============================================
async function initiatePayment(planKey) {
  const user = await window.auth.getCurrentUser().catch(() => null);

  if (!user) {
    showToast('Please login or sign up to purchase a membership.', 'error');
    setTimeout(() => {
      window.location.href = getLoginRedirectUrl();
    }, 1500);
    return;
  }

  let orderData;
  try {
    const apiBase = getPaymentsApiBase();
    const res = await fetch(`${apiBase}/api/payments/create-order`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ plan: planKey }),
    });
    orderData = await res.json();
    if (!res.ok) {
      throw new Error(orderData.error || 'Could not start payment');
    }
  } catch (err) {
    showToast(err.message || 'Payment unavailable. Please try again later.', 'error');
    return;
  }

  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: '7 Muscle Fitness Studio',
    description: orderData.planDescription || 'Membership',
    image: window.location.origin + '/img/Fineshyt.png',
    prefill: {
      name: user.user_metadata?.name || '',
      email: user.email || '',
      contact: user.user_metadata?.phone || '',
    },
    theme: {
      color: '#FFD700',
      backdrop_color: '#0A0A0A',
    },
    modal: {
      confirm_close: true,
      escape: true,
      ondismiss: function () {
        showToast('Payment cancelled. Try again anytime!', 'error');
      },
    },
    handler: async function (response) {
      try {
        const apiBase = getPaymentsApiBase();
        const verifyRes = await fetch(`${apiBase}/api/payments/verify`, {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: JSON.stringify({
            plan: planKey,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || 'Payment verification failed');
        }

        showToast('Payment successful! Welcome to 7 Muscle!', 'success');
        setTimeout(() => {
          window.location.href = getDashboardRedirectUrl();
        }, 2000);
      } catch (err) {
        console.error('Payment verify error:', err);
        showToast(
          'Payment received but activation failed. Contact support with your payment ID.',
          'error',
        );
      }
    },
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function () {
      showToast('Payment failed. Please try again.', 'error');
    });
    rzp.open();
  } catch (e) {
    showToast('Payment gateway error. Please try again.', 'error');
    console.error(e);
  }
}

// ============================================
// TOAST NOTIFICATION (membership page only)
// ============================================
function showToast(message, type = 'success') {
  if (window.showToast && window.showToast !== showToast) {
    window.showToast(message, type);
    return;
  }

  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="margin-right:8px">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    ${message}
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

window.initiatePayment = initiatePayment;
// Only override showToast if not already defined by app_v4.js
if (!window.showToast) {
  window.showToast = showToast;
}
