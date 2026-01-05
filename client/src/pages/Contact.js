import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch to book your appointment</p>
          <div style={{ marginTop: '12px' }}>
            <a
              href="https://calendly.com/shremyagupta/30min"
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
