// ============================================
// SUPABASE CONFIGURATION
// 7 Muscle Fitness Studio
// ============================================

// ⚠️ Replace these with your actual Supabase project credentials
// Get them from: https://app.supabase.com → Project Settings → API
const SUPABASE_URL = 'https://vcfdcavjpcypgnnbkhjl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZmRjYXZqcGN5cGdubmJraGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDU2NjgsImV4cCI6MjA5MTcyMTY2OH0.k1bYVLeD3yqSMhuLkx9JGPxM0kY4s6Tc33CCMQgQl8I';

// Load Supabase client from CDN (loaded in HTML)
const { createClient } = supabase;

/**
 * Create Supabase client with chosen session storage.
 * rememberMe=true  → localStorage (persists across browser restarts)
 * rememberMe=false → sessionStorage (cleared when tab closes)
 */
function createDbClient(storage) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: storage || window.localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let db = createDbClient(window.localStorage);

// ============================================
// ROLE HELPERS
// ============================================

function getUserRole(user) {
  if (!user) return 'user';
  const appRole = user.app_metadata?.role;
  if (appRole === 'admin' || appRole === 'user') return appRole;
  const metaRole = user.user_metadata?.role;
  if (metaRole === 'admin' || metaRole === 'user') return metaRole;
  return 'user';
}

function isAdmin(user) {
  return getUserRole(user) === 'admin';
}

// ============================================
// AUTH HELPERS
// ============================================

async function signUp(email, password, name, phone) {
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { name, phone } }
  });
  if (error) throw error;

  // Insert into users table
  if (data.user) {
    await db.from('users').insert([{
      id: data.user.id,
      name,
      phone,
      email
    }]);
  }
  return data;
}

async function signIn(email, password, rememberMe = true) {
  // Switch storage before sign-in so session lands in the correct store
  db = createDbClient(rememberMe ? window.localStorage : window.sessionStorage);
  window.db = db;
  rebindAuthExports();

  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await db.auth.signOut();
  if (error) throw error;
  window.location.href = 'index.html';
}

async function signInWithGoogle() {
  const { data, error } = await db.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html'
    }
  });
  if (error) throw error;
  return data;
}

async function getCurrentUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

async function resetPasswordForEmail(email) {
  const redirectTo = window.location.origin + '/dashboard.html';
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

async function updatePassword(newPassword) {
  const { error } = await db.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

function rebindAuthExports() {
  window.db = db;
  window.auth = {
    signUp, signIn, signOut, getCurrentUser, signInWithGoogle,
    getUserRole, isAdmin, resetPasswordForEmail, updatePassword
  };
}

// ============================================
// BOOKING HELPERS
// ============================================

async function submitBooking(bookingData) {
  const user = await getCurrentUser();
  const payload = {
    name: bookingData.name,
    phone: bookingData.phone,
    goal: bookingData.goal,
    time_slot: bookingData.time_slot,
    status: 'pending'
  };
  if (user) payload.user_id = user.id;

  const { data, error } = await db.from('bookings').insert([payload]);
  if (error) throw error;
  return data;
}

async function getMyBookings() {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await db
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ============================================
// MEMBERSHIP HELPERS
// ============================================

async function getMyMembership() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await db
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function createMembership(plan, paymentId) {
  // Deprecated for client use — memberships are created server-side after payment verification.
  // Kept for API compatibility; RLS blocks direct client inserts in production.
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await db.from('memberships').insert([{
    user_id: user.id,
    plan,
    payment_status: 'paid',
    payment_id: paymentId
  }]).select();
  if (error) throw error;
  return data;
}

// ============================================
// ADMIN HELPERS
// ============================================

async function getAllBookings() {
  const { data, error } = await db
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function updateBookingStatus(id, status) {
  const { error } = await db
    .from('bookings')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

async function getAllUsers() {
  const { data, error } = await db
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function getAllMemberships() {
  const { data, error } = await db
    .from('memberships')
    .select('*, users(name, email, phone)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Export for use in other files
rebindAuthExports();
window.bookingApi = {
  submitBooking, getMyBookings
};
window.membershipApi = {
  getMyMembership, createMembership
};
window.adminApi = {
  getAllBookings, updateBookingStatus, getAllUsers, getAllMemberships
};
