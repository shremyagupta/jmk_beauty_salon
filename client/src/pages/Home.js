import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to JMK Beauty Salon</h1>
          <p className="hero-subtitle">Beauty, Cosmetic & Personal Care</p>
          <p className="hero-description">Specializing in Bridal Makeup, Hair Styling, Mehndi Design & Skincare</p>
          <Link to="/contact" className="btn btn-primary">Book Appointment</Link>
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

