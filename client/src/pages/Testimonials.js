import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Testimonials.css';
import Reviews from '../components/Reviews';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('/api/testimonials');
      const data = response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(getDefaultTestimonials());
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(getDefaultTestimonials());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTestimonials = () => [
    {
      _id: '1',
      name: 'Sarah Johnson',
      role: 'Regular Client',
      rating: 5,
      text: "Absolutely amazing experience! The staff is professional, friendly, and truly talented. My hair has never looked better. Highly recommend JMK Beauty!",
      avatar: 'S'
    },
    {
      _id: '2',
      name: 'Maria Garcia',
      role: 'Spa Enthusiast',
      rating: 5,
      text: "The spa treatments here are incredible! I felt completely relaxed and rejuvenated. The facial was exactly what I needed. Will definitely be back!",
      avatar: 'M'
    },
    {
      _id: '3',
      name: 'Emily Chen',
      role: 'Bride',
      rating: 5,
      text: "Best bridal makeup I've ever had! The team made me feel like a princess on my special day. The attention to detail was outstanding. Thank you!",
      avatar: 'E'
    }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Real experiences from our valued customers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="testimonial-card">
              <div className="testimonial-rating">
                <span>{renderStars(testimonial.rating || 5)}</span>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.avatar || testimonial.name.charAt(0)}
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Google Reviews */}
        <Reviews />
      </div>
    </section>
  );
};

export default Testimonials;




