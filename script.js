// Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinksArray = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }

    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}.`);
    
    // Reset form
    contactForm.reset();
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Portfolio Item Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe portfolio items
portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Service Cards Animation
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 100);
});

// Initialize portfolio items display
portfolioItems.forEach(item => {
    item.style.display = 'block';
    item.style.opacity = '1';
    item.style.transform = 'scale(1)';
});

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxContent = document.querySelector('.lightbox-content');
const portfolioImages = document.querySelectorAll('.portfolio-image');
let currentImageIndex = 0;
let visiblePortfolioItems = [];
let isVideo = false;
let isFullscreen = false;

// Open lightbox when clicking on portfolio item
portfolioImages.forEach((image, index) => {
    image.style.cursor = 'pointer';
    image.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = index;
        updateVisibleItems();
        openLightbox(index);
    });
});

// Toggle fullscreen
lightboxContent.addEventListener('dblclick', toggleFullscreen);

// Close lightbox when clicking outside the content
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        lightboxContent.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        isFullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            isFullscreen = false;
        }
    }
}

// Handle fullscreen change event
document.addEventListener('fullscreenchange', () => {
    isFullscreen = !!document.fullscreenElement;
});

function openLightbox(index) {
    if (index < 0 || index >= visiblePortfolioItems.length) return;
    
    const imageElement = visiblePortfolioItems[index].querySelector('.portfolio-image');
    if (!imageElement) return;
    
    const title = imageElement.getAttribute('data-title') || 'Portfolio Item';
    const description = imageElement.getAttribute('data-description') || 'Description';
    const videoSrc = imageElement.getAttribute('data-video');
    
    // Check if it's a video
    isVideo = !!videoSrc || imageElement.querySelector('video');
    
    // Show loading state
    lightboxImage.innerHTML = '<div class="loading">Loading...</div>';
    lightboxVideo.style.display = 'none';
    
    if (isVideo) {
        // Handle video
        lightboxVideo.src = videoSrc;
        lightboxVideo.style.display = 'block';
        lightboxImage.style.display = 'none';
        lightboxVideo.play();
    } else {
        // Show image
        const imageContent = imageElement.querySelector('.portfolio-img, .video-thumbnail img');
        if (imageContent) {
            const clonedContent = imageContent.cloneNode(true);
            lightboxImage.innerHTML = '';
            lightboxImage.appendChild(clonedContent);
        } else {
            // Fallback to placeholder
            lightboxImage.innerHTML = '<div class="image-placeholder portfolio-img"><span>Portfolio Item</span></div>';
        }
        lightboxVideo.style.display = 'none';
        lightboxImage.style.display = 'block';
        lightboxVideo.pause();
        lightboxVideo.src = '';
    }
    
    // Update caption
    lightboxCaption.querySelector('h4').textContent = title;
    lightboxCaption.querySelector('p').textContent = description;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update visible items array based on current filter
    updateVisibleItems();
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Pause video when closing
    if (isVideo) {
        const video = lightboxVideo.querySelector('video');
        if (video) {
            video.pause();
        }
    }
    
    // Exit fullscreen when closing lightbox
    if (isFullscreen && document.exitFullscreen) {
        document.exitFullscreen();
        isFullscreen = false;
    }
}

function showNextImage() {
    if (visiblePortfolioItems.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % visiblePortfolioItems.length;
    openLightbox(currentImageIndex);
}

function showPrevImage() {
    if (visiblePortfolioItems.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + visiblePortfolioItems.length) % visiblePortfolioItems.length;
    openLightbox(currentImageIndex);
}

function updateVisibleItems() {
    visiblePortfolioItems = Array.from(portfolioItems).filter(item => 
        window.getComputedStyle(item).display !== 'none' && 
        window.getComputedStyle(item).opacity !== '0' &&
        window.getComputedStyle(item).visibility !== 'hidden'
    );
    
    // Update current index if it's out of bounds
    if (currentImageIndex >= visiblePortfolioItems.length) {
        currentImageIndex = visiblePortfolioItems.length - 1;
    }
    if (currentImageIndex < 0 && visiblePortfolioItems.length > 0) {
        currentImageIndex = 0;
    }
}

// Event listeners for lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    }
});

// Close lightbox when clicking outside
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight' && !isVideo) {
            showNextImage();
        } else if (e.key === 'ArrowLeft' && !isVideo) {
            showPrevImage();
        }
    }
});

// Instagram Feed Setup
async function setupInstagramFeed(username) {
    const instagramFeed = document.getElementById('instagramFeedGrid');
    
    try {
        // In a production environment, you would make an API call to your backend
        // which would then call the Instagram Basic Display API with your access token
        // For now, we'll use a simple approach with a fallback
        
        // Clear the loading state
        instagramFeed.innerHTML = '';
        
        // Create a grid container for the Instagram posts
        const grid = document.createElement('div');
        grid.className = 'instagram-posts-grid';
        
        // Create a loading indicator
        const loading = document.createElement('div');
        loading.className = 'instagram-loading';
        loading.textContent = 'Loading Instagram feed...';
        instagramFeed.appendChild(loading);
        
        // In a real implementation, you would fetch the actual Instagram posts here
        // For now, we'll show a message with a link to the Instagram profile
        setTimeout(() => {
            loading.remove();
            grid.innerHTML = `
                <div class="instagram-fallback">
                    <p>📸 Follow us on Instagram to see our latest work!</p>
                    <p class="instagram-note">Visit <a href="https://instagram.com/${username}" target="_blank">@${username}</a> for daily updates and behind-the-scenes content</p>
                    <div class="instagram-cta">
                        <a href="https://www.instagram.com/${username}/" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            <span>📷</span> Follow @${username}
                        </a>
                    </div>
                </div>
            `;
            instagramFeed.appendChild(grid);
        }, 1000);
        
    } catch (error) {
        console.error('Error loading Instagram feed:', error);
        instagramFeed.innerHTML = `
            <div class="instagram-error">
                <p>Unable to load Instagram feed. Please visit our <a href="https://instagram.com/${username}" target="_blank">Instagram profile</a>.</p>
            </div>
        `;
            // Show fallback if widget fails to load
            const fallback = document.querySelector('.instagram-fallback');
            if (fallback) {
                fallback.style.display = 'block';
                snapWidget.style.display = 'none';
            }
        };
    }
}

// Initialize Instagram feed with username
setupInstagramFeed('jmk_beauty_salon');

// Testimonials Animation
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

testimonialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    testimonialObserver.observe(card);
});

