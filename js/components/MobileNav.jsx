const { useState, useEffect } = React;

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const links = [
    { name: 'Home', url: 'index.html' },
    { name: 'About', url: 'about.html' },
    { name: 'Programs', url: 'programs.html' },
    { name: 'Membership', url: 'membership.html' },
    { name: 'Book Free Trial', url: 'booking.html', highlight: true },
    { name: 'My Account', url: '/dashboard' } // Dashboard router usually handles /dashboard
  ];

  const overlayContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999, // Lower than navbar (1000) so hamburger remains clickable
        pointerEvents: isOpen ? 'all' : 'none',
      }}
    >
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        style={{
          position: 'absolute',
          top: 0, bottom: 0, right: 0,
          width: '85vw',
          maxWidth: '400px',
          background: 'var(--black)',
          borderLeft: '1px solid rgba(255, 215, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 24px 40px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
          boxShadow: isOpen ? '-10px 0 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link, index) => (
            <a 
              key={link.name}
              href={link.url}
              onClick={() => setIsOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                color: link.highlight ? 'var(--gold)' : 'var(--white)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '16px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                opacity: isOpen ? 1 : 0,
                transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + (index * 0.05)}s`,
                display: 'block'
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Floating Contact/Social at bottom of menu */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          gap: '24px',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.4s ease 0.4s'
        }}>
          <a href="https://wa.me/916382973619" style={{ color: 'var(--gray)', fontSize: '16px', textDecoration: 'none', padding: '12px 0' }}>WhatsApp</a>
          <a href="tel:6382973619" style={{ color: 'var(--gray)', fontSize: '16px', textDecoration: 'none', padding: '12px 0' }}>Call Us</a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className={`react-hamburger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '30px',
          height: '21px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          zIndex: 1100, // Higher than navbar contents to ensure it is clickable inside the nav
          position: 'relative'
        }}
      >
        <span style={{ 
          width: '100%', height: '2px', background: 'var(--white)', borderRadius: '2px',
          transition: 'all 0.3s ease', transformOrigin: 'left center',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'
        }}></span>
        <span style={{ 
          width: '70%', height: '2px', background: 'var(--gold)', borderRadius: '2px',
          transition: 'all 0.3s ease', opacity: isOpen ? 0 : 1, alignSelf: 'flex-end'
        }}></span>
        <span style={{ 
          width: '100%', height: '2px', background: 'var(--white)', borderRadius: '2px',
          transition: 'all 0.3s ease', transformOrigin: 'left center',
          transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)'
        }}></span>
      </button>

      {/* Full Screen Overlay - Portaled to document.body */}
      {ReactDOM.createPortal(overlayContent, document.body)}
    </>
  );
}

const domNode = document.getElementById('react-mobile-nav-root');
if (domNode) {
  const root = ReactDOM.createRoot(domNode);
  root.render(<MobileNav />);
}
