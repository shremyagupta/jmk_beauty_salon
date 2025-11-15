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
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const portfolioImages = document.querySelectorAll('.portfolio-image');
let currentImageIndex = 0;
let visiblePortfolioItems = Array.from(portfolioItems);

// Open lightbox when clicking on portfolio item
portfolioImages.forEach((image, index) => {
    image.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(index);
    });
});

function openLightbox(index) {
    const imageElement = portfolioImages[index];
    const title = imageElement.getAttribute('data-title') || 'Portfolio Item';
    const description = imageElement.getAttribute('data-description') || 'Description';
    
    // Clone the image content
    const imageContent = imageElement.querySelector('.portfolio-img').cloneNode(true);
    lightboxImage.innerHTML = '';
    lightboxImage.appendChild(imageContent);
    
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
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    updateVisibleItems();
    currentImageIndex = (currentImageIndex + 1) % visiblePortfolioItems.length;
    const itemIndex = Array.from(portfolioItems).indexOf(visiblePortfolioItems[currentImageIndex]);
    openLightbox(itemIndex);
}

function showPrevImage() {
    updateVisibleItems();
    currentImageIndex = (currentImageIndex - 1 + visiblePortfolioItems.length) % visiblePortfolioItems.length;
    const itemIndex = Array.from(portfolioItems).indexOf(visiblePortfolioItems[currentImageIndex]);
    openLightbox(itemIndex);
}

function updateVisibleItems() {
    visiblePortfolioItems = Array.from(portfolioItems).filter(item => {
        return item.style.display !== 'none';
    });
    // Update current index to match visible items
    const currentItem = portfolioItems[Array.from(portfolioImages).indexOf(portfolioImages[currentImageIndex])];
    currentImageIndex = visiblePortfolioItems.indexOf(currentItem);
    if (currentImageIndex === -1) currentImageIndex = 0;
}

// Event listeners for lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

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
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

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

