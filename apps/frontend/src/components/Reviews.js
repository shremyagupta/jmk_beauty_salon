import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reviews.css';

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/reviews');
        if (!mounted) return;
        setReviewsData(res.data.data || null);
      } catch (err) {
        console.error('Error fetching reviews:', err.message || err);
        if (!mounted) return;
        setError('Unable to load reviews');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="reviews-loading">Loading reviews...</div>;
  if (error || !reviewsData) return <div className="reviews-error">{error || 'No reviews available'}</div>;

  return (
    <section className="google-reviews">
      <div className="reviews-header">
        <h3>From Google Reviews</h3>
        <div className="rating-summary">{reviewsData.rating ? `${reviewsData.rating} ★` : ''}</div>
      </div>
      <div className="reviews-list">
        {reviewsData.reviews && reviewsData.reviews.length ? (
          reviewsData.reviews.map((r, idx) => (
            <article key={idx} className="review-card">
              <div className="review-author">
                <div className="author-initial">{(r.author_name || 'G').charAt(0)}</div>
                <div>
                  <strong className="author-name">{r.author_name}</strong>
                  <div className="review-time">{r.relative_time_description || new Date((r.time || 0) * 1000).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="review-rating">{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
              <p className="review-text">{r.text}</p>
            </article>
          ))
        ) : (
          <div className="no-reviews">No Google reviews yet.</div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
