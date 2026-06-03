const { useState } = React;

function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    goal: '',
    time_slot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.goal || !formData.time_slot) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Use the existing booking API from app_v4.js / supabase_v4.js
      if (window.bookingApi) {
        await window.bookingApi.submitBooking(formData);
      } else {
        throw new Error('Booking API not found.');
      }
      
      setIsSuccess(true);
      if (window.showToast) {
        window.showToast("Free trial booked! We'll call you soon 🏋️", 'success');
      }
    } catch (err) {
      setError(err.message || 'Please try again or call us!');
      if (window.showToast) {
        window.showToast(`Booking failed: ${err.message}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px', animation: 'fadeInUp 0.5s ease forwards' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
        <h3 className="text-display-md">Trial Booked!</h3>
        <p style={{ fontSize: '14px', color: 'var(--gray)' }}>We'll call you within 2 hours to confirm your slot. See you at 7 Muscle!</p>
        <a href="https://wa.me/916382973619" target="_blank" className="btn btn-gold" style={{ marginTop: '16px', display: 'inline-flex' }}>💬 Chat on WhatsApp</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      {error && (
        <div style={{ background: 'rgba(255,59,59,0.1)', color: 'var(--red)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label" htmlFor="fname">Full Name *</label>
        <input type="text" id="fname" name="name" className="form-control" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="fphone">Phone Number *</label>
        <input type="tel" id="fphone" name="phone" className="form-control" placeholder="10-digit mobile number" pattern="[0-9]{10}" value={formData.phone} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="fgoal">Your Fitness Goal *</label>
        <select id="fgoal" name="goal" className="form-control" value={formData.goal} onChange={handleChange} required>
          <option value="" disabled>Select your primary goal</option>
          <option value="Weight Loss">Weight Loss 🔥</option>
          <option value="Muscle Building">Muscle Building 💪</option>
          <option value="Body Toning">Body Toning ✨</option>
          <option value="General Fitness">General Fitness 🏃</option>
          <option value="Women's Fitness">Women's Fitness 👩</option>
          <option value="Personal Training">Personal Training 🎯</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="fslot">Preferred Time Slot *</label>
        <select id="fslot" name="time_slot" className="form-control" value={formData.time_slot} onChange={handleChange} required>
          <option value="" disabled>Select your preferred time</option>
          <option value="5AM - 7AM">Early Morning: 5AM – 7AM</option>
          <option value="7AM - 9AM">Morning: 7AM – 9AM</option>
          <option value="9AM - 11AM">Late Morning: 9AM – 11AM</option>
          <option value="4PM - 6PM">Evening: 4PM – 6PM</option>
          <option value="6PM - 8PM">Prime Evening: 6PM – 8PM</option>
          <option value="8PM - 10PM">Night: 8PM – 10PM</option>
        </select>
      </div>
      
      <div style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 'var(--radius)', padding: '14px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6' }}>
          ✅ <strong style={{ color: 'var(--white)' }}>Completely Free</strong> — no payment required<br />
          ✅ <strong style={{ color: 'var(--white)' }}>No Commitment</strong> — zero pressure to join<br />
          ✅ <strong style={{ color: 'var(--white)' }}>We'll Call You</strong> — within 2 hours to confirm
        </p>
      </div>
      
      <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={isSubmitting}>
        {isSubmitting ? '⏳ Booking...' : '💪 Book My Free Trial Session'}
      </button>
    </form>
  );
}

// Render the component
const domNode = document.getElementById('react-booking-root');
if (domNode) {
  const root = ReactDOM.createRoot(domNode);
  root.render(<BookingForm />);
}
