// Google Reviews Integration for JMK Beauty Salon

// Google Maps Place ID for JMK Beauty Salon
const PLACE_ID = 'YOUR_GOOGLE_PLACE_ID'; // Replace with actual Google Place ID
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API key

// Function to fetch Google reviews
async function fetchGoogleReviews() {
    try {
        // First, get place details to get the reviews
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,user_ratings_total,rating&key=${API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.result.reviews) {
            return data.result.reviews;
        } else {
            console.error('Error fetching reviews:', data.status);
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Function to create star rating HTML
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '★';
        } else if (i === fullStars && hasHalfStar) {
            stars += '½';
        } else {
            stars += '☆';
        }
    }
    
    return `<span class="testimonial-rating">${stars}</span>`;
}

// Function to update the testimonials section
async function updateTestimonials() {
    const reviews = await fetchGoogleReviews();
    const testimonialsContainer = document.querySelector('.testimonials-grid');
    
    if (!reviews.length || !testimonialsContainer) return;
    
    // Clear existing testimonials if you want to replace them
    // testimonialsContainer.innerHTML = '';
    
    // Add new reviews
    reviews.forEach(review => {
        const reviewDate = new Date(review.time * 1000).toLocaleDateString();
        const reviewElement = document.createElement('div');
        reviewElement.className = 'testimonial-card';
        reviewElement.innerHTML = `
            ${createStarRating(review.rating)}
            <p class="testimonial-text">${review.text}</p>
            <div class="testimonial-author">
                <div class="author-avatar">${review.author_name.charAt(0)}</div>
                <div class="author-info">
                    <h4>${review.author_name}</h4>
                    <p>${reviewDate}</p>
                </div>
                <div class="google-logo">
                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C8.21 0 4.78 1.88 2.52 4.72 1.12 6.7.29 9.21.29 12c0 2.28.7 4.55 2.04 6.48.2.29.23.66.04.96l-2.1 3.59c-.2.34-.07.78.27.98l3.8 2.22c.32.19.72.12.97-.15.88-.94 1.8-1.82 2.77-2.64.19-.16.28-.4.26-.64-.17-1.34-.17-2.69 0-4.03.02-.24-.07-.48-.26-.64-1.12-.96-2.15-2-3.1-3.13-.21-.24-.3-.56-.24-.88.2-1.1.3-2.2.3-3.31 0-1.2.2-2.4.59-3.54.13-.39.5-.65.92-.65h7.01c.41 0 .75.34.75.75s-.34.75-.75.75h-5.5c-.41 0-.75.34-.75.75s.34.75.75.75h5.5c.41 0 .75.34.75.75s-.34.75-.75.75h-5.5c-.41 0-.75.34-.75.75s.34.75.75.75h5.5c.41 0 .75.34.75.75s-.34.75-.75.75h-5.5c-.41 0-.75.34-.75.75s.34.75.75.75h5.5c.41 0 .75.34.75.75s-.34.75-.75.75z"/>
                    </svg>
                </div>
            </div>
        `;
        
        testimonialsContainer.prepend(reviewElement);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', updateTestimonials);
