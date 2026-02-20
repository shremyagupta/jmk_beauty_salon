const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simple in-memory cache to avoid hitting Google API rate limits
let reviewsCache = {
  data: null,
  fetchedAt: 0
};
const CACHE_TTL = parseInt(process.env.REVIEWS_CACHE_TTL || '300', 10); // seconds

// Helper to fetch reviews from Google Places (Place Details)
async function fetchGoogleReviews() {
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_PLACE_ID) {
    throw new Error('GOOGLE_API_KEY and GOOGLE_PLACE_ID must be set in environment');
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.GOOGLE_PLACE_ID}&fields=name,rating,reviews,formatted_address,formatted_phone_number,website&key=${process.env.GOOGLE_API_KEY}`;
  const resp = await axios.get(url, { timeout: 5000 });
  if (resp.data && resp.data.result) {
    return resp.data.result;
  }
  throw new Error('Invalid response from Google Places API');
}

// GET /api/reviews - returns cached reviews or fresh from Google
router.get('/', async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    if (reviewsCache.data && (now - reviewsCache.fetchedAt) < CACHE_TTL) {
      return res.json({ source: 'cache', data: reviewsCache.data });
    }

    const result = await fetchGoogleReviews();
    // Normalize reviews for frontend
    const normalized = {
      name: result.name,
      address: result.formatted_address,
      phone: result.formatted_phone_number,
      website: result.website,
      rating: result.rating,
      reviews: (result.reviews || []).map(r => ({
        author_name: r.author_name,
        rating: r.rating,
        time: r.time,
        text: r.text,
        relative_time_description: r.relative_time_description
      }))
    };

    reviewsCache = { data: normalized, fetchedAt: now };
    res.json({ source: 'google', data: normalized });
  } catch (error) {
    console.error('Failed to fetch reviews:', error.message);
    if (reviewsCache.data) {
      return res.json({ source: 'cache', data: reviewsCache.data, warn: 'Google fetch failed, returning cached data' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
