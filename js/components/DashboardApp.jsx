const { useState, useEffect } = React;

// --- AUTH COMPONENT ---
function AuthView({ setSessionUser }) {
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!window.auth) throw new Error("Auth service unavailable");
      
      let user;
      if (view === 'signup') {
        user = await window.auth.signUp(formData.email, formData.password, {
          full_name: formData.name,
          phone: formData.phone
        });
      } else {
        user = await window.auth.signIn(formData.email, formData.password);
      }
      
      if (user) {
        setSessionUser(user);
        if (window.showToast) window.showToast(`Welcome back!`, 'success');
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
      if (window.showToast) window.showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.auth) window.auth.signInWithGoogle();
  };

  return (
    <div className="auth-wrap" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      <div className="auth-card">
        <div className="auth-logo">7 <span style={{color:'var(--white)'}}>MUSCLE</span></div>
        <div className="auth-subtitle text-display-md">
          {view === 'login' ? 'Welcome Back' : 'Create Account'}
        </div>
        <p className="auth-subtitle">
          {view === 'login' ? 'Sign in to your account' : 'Start your fitness journey'}
        </p>

        {error && (
          <div style={{ background: 'rgba(255,59,59,0.1)', color: 'var(--red)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {view === 'signup' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>

          <button type="submit" className="btn btn-gold btn-full" style={{ marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button onClick={handleGoogleSignIn} className="btn btn-white btn-full" style={{ marginBottom: '24px', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', border: '1px solid #ddd' }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width:'18px', height:'18px'}} />
          Continue with Google
        </button>

        <div className="auth-toggle">
          {view === 'login' ? (
            <>New to 7 Muscle? <a href="#" onClick={(e)=>{e.preventDefault(); setView('signup');}}>Create account</a></>
          ) : (
            <>Already a member? <a href="#" onClick={(e)=>{e.preventDefault(); setView('login');}}>Sign in</a></>
          )}
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
function DashboardView({ user, setSessionUser }) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    if (window.auth) {
      await window.auth.signOut();
      setSessionUser(null);
    }
  };

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'bookings', icon: '📅', label: 'My Bookings' },
    { id: 'membership', icon: '🏆', label: 'Membership' },
    { id: 'programs', icon: '💪', label: 'Programs' }
  ];

  return (
    <div className="dashboard-layout" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">7 MUSCLE</div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span> {item.label}
            </div>
          ))}
          <div className="sidebar-link" onClick={handleSignOut} style={{ marginTop: 'auto', color: 'var(--red)' }}>
            <span className="sidebar-icon">🚪</span> Sign Out
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dash-section">
            <div className="dash-header">
              <div>
                <div style={{fontSize:'13px', color:'var(--gray)', marginBottom:'4px'}}>Welcome back,</div>
                <h1 className="dash-title">Hey, <span className="text-gold">{user?.user_metadata?.full_name || 'Member'}</span> 👋</h1>
              </div>
              <a href="booking.html" className="btn btn-gold">+ Book Session</a>
            </div>

            <div className="dash-cards">
              <div className="dash-card">
                <div className="dash-card-icon">📅</div>
                <div className="dash-card-val">—</div>
                <div className="dash-card-label">Total Bookings</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon">🏆</div>
                <div className="dash-card-val">
                  <span className="badge badge-gray">Free</span>
                </div>
                <div className="dash-card-label">Membership</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon">⭐</div>
                <div className="dash-card-val text-gold">4.9</div>
                <div className="dash-card-label">Our Rating</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon">📞</div>
                <div className="dash-card-val" style={{fontSize:'18px', lineHeight:'1.3'}}>
                  <a href="tel:6382973619" style={{color:'var(--gold)'}}>Call Us</a>
                </div>
                <div className="dash-card-label">Need Help?</div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
              <div className="feature-card" style={{cursor:'pointer'}} onClick={() => setActiveTab('bookings')}>
                <div className="feature-icon">📅</div>
                <h3>My Bookings</h3>
                <p>View all your past and upcoming trial sessions.</p>
              </div>
              <div className="feature-card" style={{cursor:'pointer'}} onClick={() => setActiveTab('membership')}>
                <div className="feature-icon">🏆</div>
                <h3>My Membership</h3>
                <p>View your current plan, billing, and upgrade options.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="dash-section">
            <div className="dash-header">
              <h2 className="dash-title">My <span className="text-gold">Bookings</span></h2>
              <a href="booking.html" className="btn btn-gold btn-sm">+ New Booking</a>
            </div>
            <div className="table-wrap">
              <div className="table-header">
                <div className="table-title">Trial Sessions</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Goal</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan="4" style={{textAlign:'center', color:'var(--gray)', padding:'32px'}}>Loading bookings...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'membership' && (
          <div className="dash-section">
            <div className="dash-header">
              <h2 className="dash-title">My <span className="text-gold">Membership</span></h2>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'32px'}}>
              <div className="dash-card">
                <div className="dash-card-icon">📋</div>
                <div className="dash-card-label" style={{marginBottom:'6px'}}>Current Plan</div>
                <div style={{fontSize:'15px', fontWeight:'600'}}>Free Trial User</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon">📅</div>
                <div className="dash-card-label" style={{marginBottom:'6px'}}>Member Since</div>
                <div style={{fontSize:'15px', fontWeight:'600'}}>{new Date(user?.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="feature-card">
              <h3 style={{fontFamily:'var(--font-body)', fontSize:'15px', fontWeight:'700', color:'var(--gold)', marginBottom:'12px'}}>Upgrade or Renew</h3>
              <p style={{fontSize:'14px', color:'var(--gray)', marginBottom:'16px'}}>Upgrade your plan to unlock more PT sessions, nutrition planning, and VIP access.</p>
              <a href="membership.html" className="btn btn-gold">View Plans</a>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="dash-section">
            <div className="dash-header">
              <h2 className="dash-title">Training <span className="text-gold">Programs</span></h2>
            </div>
            <div className="programs-grid">
              <a href="programs.html#weight-loss" className="program-card" style={{display:'block'}}>
                <div className="program-card-img">🔥</div>
                <div className="program-card-body">
                  <div className="program-card-title">Weight Loss</div>
                  <p className="program-card-desc">Burn fat, reveal your best self.</p>
                </div>
              </a>
              <a href="programs.html#muscle-building" className="program-card" style={{display:'block'}}>
                <div className="program-card-img">💪</div>
                <div className="program-card-body">
                  <div className="program-card-title">Muscle Building</div>
                  <p className="program-card-desc">Pack on lean muscle and strength.</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function DashboardApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        if (window.auth) {
          const currentUser = await window.auth.getCurrentUser();
          setUser(currentUser);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--gray)' }}>Authenticating...</div>;
  }

  return (
    <>
      {user ? (
        <DashboardView user={user} setSessionUser={setUser} />
      ) : (
        <AuthView setSessionUser={setUser} />
      )}
    </>
  );
}

// Render the component
const domNode = document.getElementById('react-dashboard-root');
if (domNode) {
  const root = ReactDOM.createRoot(domNode);
  root.render(<DashboardApp />);
}
