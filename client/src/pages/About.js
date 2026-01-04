import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Us</h2>
          <p className="section-subtitle">Your trusted beauty destination</p>
        </div>
        <div className="about-content">
          <div className="about-text">
            <h3>Experience Luxury & Excellence</h3>
            <p>At JMK Beauty Salon, we specialize in Beauty, Cosmetic & Personal Care services. Our expert team is dedicated to making you look and feel absolutely stunning for your special occasions, especially bridal makeup and traditional ceremonies.</p>
            <p>We offer comprehensive beauty services including bridal makeup, hair styling, skincare, mehndi design, and professional beauty treatments. With a focus on traditional and modern beauty techniques, we create stunning looks that celebrate your unique beauty.</p>
            <div className="about-stats">
              <div className="stat-item">
                <h4>404+</h4>
                <p>Followers</p>
              </div>
              <div className="stat-item">
                <h4>96+</h4>
                <p>Portfolio Posts</p>
              </div>
              <div className="stat-item">
                <h4>35+</h4>
                <p>Active Collaborations</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img
              src="/images/portfolio/salon-interior.jpg"
              alt="Salon Interior"
              className="about-salon-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

