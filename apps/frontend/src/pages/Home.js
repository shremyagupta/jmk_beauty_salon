import React from 'react';
import './Home.css';

const Home = () => {
  const scrollToContact = (e) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      const yOffset = -80; // same offset as navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to JMK Beauty Salon</h1>
          <p className="hero-subtitle">Beauty, Cosmetic & Personal Care</p>
          <p className="hero-description">Specializing in Bridal Makeup, Hair Styling, Mehndi Design & Skincare</p>
          <a href="#contact" className="btn btn-primary" onClick={scrollToContact}>
            Book Appointment
          </a>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </section>
    </>
  );
};

export default Home;

