import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to default services if API fails
      setServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultServices = () => [
    {
      name: 'Bridal Makeup',
      category: 'makeup',
      description: 'Stunning bridal makeup for your special day with traditional and modern styles',
      services: ['Bridal Makeup', 'Pre-Bridal Packages', 'Bridal Hair Styling', 'Complete Bridal Look'],
      icon: '💄'
    },
    {
      name: 'Hair Services',
      category: 'hair',
      description: 'Professional hair styling, tutorials, and treatments for all occasions',
      services: ['Hair Tutorials', 'Hair Styling', 'Hair Coloring', 'Hair Treatments'],
      icon: '💇'
    },
    {
      name: 'Mehndi Design',
      category: 'spa',
      description: 'Beautiful and intricate mehndi designs for hands and feet',
      services: ['Bridal Mehndi', 'Party Mehndi', 'Arabic Designs', 'Traditional Patterns'],
      icon: '🎨'
    },
    {
      name: 'Skincare',
      category: 'facial',
      description: 'Professional skincare treatments and beauty routines',
      services: ['Facial Treatments', 'Skin Care Routines', 'Anti-Aging Solutions', 'Hydrating Masks'],
      icon: '✨'
    },
    {
      name: 'Makeup Services',
      category: 'makeup',
      description: 'Professional makeup for all occasions and events',
      services: ['Party Makeup', 'Editorial Makeup', 'Makeup Artist Services', 'Makeup Tutorials'],
      icon: '💋'
    },
    {
      name: 'Beauty & Cosmetics',
      category: 'spa',
      description: 'Complete beauty and cosmetic services for personal care',
      services: ['Beauty Consultations', 'Cosmetic Products', 'Beauty Packages', 'Personal Care'],
      icon: '🌸'
    }
  ];

  if (loading) {
    return (
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Comprehensive beauty and wellness solutions</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon || '✨'}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <ul>
                {service.services && service.services.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

