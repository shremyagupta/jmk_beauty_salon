import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const calendlyUrl = 'https://calendly.com/shremyagupta/30min';

  const getDefaultServices = () => [
    { name: 'Bridal Makeup' },
    { name: 'Hair Services' },
    { name: 'Skincare' },
    { name: 'Mehndi Design' },
    { name: 'Party Makeup' },
    { name: 'Beauty & Spa Package' },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        const data = response.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices(getDefaultServices());
        }
      } catch (error) {
        console.error('Error loading services for booking form', error);
        setServices(getDefaultServices());
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setBookingError('');
    setBookingLoading(true);
    try {
      const payload = {
        ...form,
        requestedServices: form.service ? [form.service] : []
      };
      const res = await axios.post('/api/appointments', payload);
      setBookingMessage(res.data?.message || 'Appointment requested successfully!');
      setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', message: '' });
    } catch (error) {
      const msg = error.response?.data?.error || 'Could not book appointment. Please try again.';
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch to book your appointment</p>
          <div style={{ marginTop: '12px' }}>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Book Appointment Call
            </a>
          </div>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon"></div>
              <div className="info-text">
                <h4>Visit Us</h4>
                <p>
                  <a
                    href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}
                  >
                     View Location on Google Maps
                  </a>
                  <br />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Click to get directions to our salon
                  </span>
                </p>
              </div>
            </div>

            <div className="map-container" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  backgroundColor: 'var(--light-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #e0e0e0',
                }}
              >
                <a
                  href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'var(--primary-color)',
                    textAlign: 'center',
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}></div>
                  <div
                    style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '5px' }}
                  >
                    View Location on Google Maps
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Click to open interactive map
                  </div>
                </a>
              </div>
              <p style={{ textAlign: 'center', marginTop: '15px' }}>
                <a
                  href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                   Get Directions 
                </a>
              </p>
            </div>

            <div className="info-item">
              <div className="info-icon"></div>
              <div className="info-text">
                <h4>Phone</h4>
                <p>
                  <a
                    href="tel:9369505408"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    9369505408
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"></div>
              <div className="info-text">
                <h4>Social Media</h4>
                <p>
                  Instagram:{' '}
                  <a
                    href="https://instagram.com/jmk_beauty_salon"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                  >
                    @jmk_beauty_salon
                  </a>
                </p>
                <p>
                  YouTube:{' '}
                  <a
                    href="https://www.youtube.com/@JMKBeautysalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                  >
                    JMK Beauty Salon
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"></div>
              <div className="info-text">
                <h4>Hours</h4>
                <p>
                  Mon - Sat: 9:00 AM - 7:00 PM
                  <br />
                  Sunday: 10:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h3 className="contact-form-title">Quick Appointment Request</h3>
            <p className="contact-form-subtitle">
              Prefer a simple form? Tell us what you need and we&apos;ll confirm your slot.
            </p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (for confirmation)"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s._id || s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="message"
                rows="3"
                placeholder="Any special requests or notes"
                value={form.message}
                onChange={handleChange}
              />
              <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                {bookingLoading ? 'Sending request...' : 'Request Appointment'}
              </button>
              {bookingMessage && (
                <p className="contact-form-message success">{bookingMessage}</p>
              )}
              {bookingError && (
                <p className="contact-form-message error">{bookingError}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
