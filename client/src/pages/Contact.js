import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import '../components/Reviews.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('/api/contact', formData);
      setSubmitMessage('Thank you for contacting us! We will get back to you soon.');
      // Show a stronger confirmation modal for booking-related submissions
      const isBooking = formData.subject && formData.subject.toLowerCase().includes('appointment');
      if (isBooking) {
        setConfirmationData({ ...formData });
        setShowConfirmation(true);
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    } catch (error) {
      setSubmitMessage('There was an error sending your message. Please try again.');
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch to book your appointment</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h4>Visit Us</h4>
                <p>
                  <a 
                    href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500'}}
                  >
                    📍 View Location on Google Maps
                  </a>
                  <br />
                  <span style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>Click to get directions to our salon</span>
                </p>
              </div>
            </div>
            <div className="map-container" style={{marginTop: '20px', marginBottom: '20px'}}>
              <div style={{
                width: '100%',
                height: '300px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                backgroundColor: 'var(--light-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #e0e0e0'
              }}>
                <a 
                  href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'var(--primary-color)',
                    textAlign: 'center',
                    padding: '20px'
                  }}
                >
                  <div style={{fontSize: '3rem', marginBottom: '10px'}}>📍</div>
                  <div style={{fontWeight: '600', fontSize: '1.1rem', marginBottom: '5px'}}>
                    View Location on Google Maps
                  </div>
                  <div style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>
                    Click to open interactive map
                  </div>
                </a>
              </div>
              <p style={{textAlign: 'center', marginTop: '15px'}}>
                <a 
                  href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500'}}
                >
                  🗺️ Get Directions →
                </a>
              </p>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h4>Phone</h4>
                <p><a href="tel:9369505408" style={{color: 'inherit', textDecoration: 'none'}}>9369505408</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-text">
                <h4>Social Media</h4>
                <p>Instagram: <a href="https://instagram.com/jmk_beauty_salon" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>@jmk_beauty_salon</a></p>
                <p>YouTube: <a href="https://www.youtube.com/@JMKBeautysalon" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>JMK Beauty Salon</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕒</div>
              <div className="info-text">
                <h4>Hours</h4>
                <p>Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: 10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {showConfirmation && confirmationData && (
            <div className="confirmation-modal" role="dialog" aria-modal="true">
              <div className="confirmation-card">
                <h3>Appointment Requested</h3>
                <p>Thank you, {confirmationData.name || 'Guest'} — we received your request for <strong>{confirmationData.subject}</strong>.</p>
                <ul className="confirmation-list">
                  {confirmationData.email && <li><strong>Email:</strong> {confirmationData.email}</li>}
                  {confirmationData.phone && <li><strong>Phone:</strong> {confirmationData.phone}</li>}
                  {confirmationData.message && <li><strong>Note:</strong> {confirmationData.message}</li>}
                </ul>
                <div className="confirmation-actions">
                  <button className="btn" onClick={() => setShowConfirmation(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;

