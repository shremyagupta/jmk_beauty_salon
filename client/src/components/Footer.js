import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JMK Beauty</h3>
            <p>Professional makeup, hair, mehndi and skincare services.</p>
            <p style={{marginTop: '12px', fontSize: '0.95rem'}}>
              <strong>Address:</strong> Pandeypur, Azamgarh Road, Varanasi
            </p>
            <p style={{marginTop: '8px', fontSize: '0.9rem'}}>
              <a
                href="https://maps.app.goo.gl/3Kzm2rwaaJPqUcfJA"
                target="_blank"
                rel="noopener noreferrer"
                style={{color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none'}}
              >📍 Open in Google Maps</a>
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services">Bridal Makeup</Link></li>
              <li><Link to="/services">Hair Services</Link></li>
              <li><Link to="/services">Mehndi Design</Link></li>
              <li><Link to="/services">Skincare</Link></li>
              <li><Link to="/services">Beauty & Cosmetics</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://instagram.com/jmk_beauty_salon" target="_blank" rel="noopener noreferrer" className="social-link">Instagram @jmk_beauty_salon</a>
              <a href="https://www.youtube.com/@JMKBeautysalon" target="_blank" rel="noopener noreferrer" className="social-link">YouTube Channel</a>
              <a href="https://instagram.com/jmk_cosmetic" target="_blank" rel="noopener noreferrer" className="social-link">Cosmetics @jmk_cosmetic</a>
            </div>
            <div style={{marginTop: '12px'}}>
              <p style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem'}}>📞 <a href="tel:9369505408" style={{color: 'var(--primary-color)', textDecoration: 'none'}}>9369505408</a></p>
              <p style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginTop: '6px'}}>Hours: Mon–Sun 09:00 — 20:00</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 JMK Beauty Salon and Spa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

