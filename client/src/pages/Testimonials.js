import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Testimonials.css';
import Reviews from '../components/Reviews';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
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

    fetchTestimonials();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitting(true);
    try {
      await axios.post('/api/testimonials', {
        name,
        role,
        rating: Number(rating),
        text,
      });
      setSubmitMessage('Thank you! Your review has been submitted and will appear after approval.');
      setName('');
      setRole('');
      setRating(5);
      setText('');
    } catch (error) {
      setSubmitMessage('Sorry, we could not submit your review. Please try again later.');
    } finally {
      setSubmitting(false);
    }
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

        <div className="testimonial-form-wrapper">
          <h3 className="testimonial-form-title">Share Your Experience</h3>
          <p className="testimonial-form-subtitle">Rate our services and leave a short review.</p>
          <form className="testimonial-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Your role (e.g. Bride, Regular Client)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label className="rating-label">
                Rating:
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </label>
            </div>
            <textarea
              rows="3"
              placeholder="Write a short review..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button type="submit" className="testimonial-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            {submitMessage && <p className="testimonial-form-message">{submitMessage}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;




