// Service Recommendations
document.addEventListener('DOMContentLoaded', function() {
    // Service Recommendations Data
    const services = [
        {
            id: 1,
            name: 'Haircut & Styling',
            category: 'hair',
            description: 'Professional haircut and styling to suit your face shape and personal style.',
            price: '₹800',
            duration: '45 min',
            image: 'images/services/haircut.jpg'
        },
        {
            id: 2,
            name: 'Hair Coloring',
            category: 'hair',
            description: 'Transform your look with our professional hair coloring services.',
            price: '₹2500',
            duration: '2 hours',
            image: 'images/services/hair-color.jpg'
        },
        {
            id: 3,
            name: 'Facial Treatment',
            category: 'skin',
            description: 'Rejuvenate your skin with our luxurious facial treatments.',
            price: '₹1500',
            duration: '1 hour',
            image: 'images/services/facial.jpg'
        },
        {
            id: 4,
            name: 'Manicure & Pedicure',
            category: 'nails',
            description: 'Pamper your hands and feet with our manicure and pedicure services.',
            price: '₹1200',
            duration: '1.5 hours',
            image: 'images/services/manicure.jpg'
        },
        {
            id: 5,
            name: 'Full Body Massage',
            category: 'spa',
            description: 'Relax and unwind with our therapeutic full body massage.',
            price: '₹2000',
            duration: '1.5 hours',
            image: 'images/services/massage.jpg'
        },
        {
            id: 6,
            name: 'Bridal Makeup',
            category: 'makeup',
            description: 'Look stunning on your special day with our professional bridal makeup.',
            price: '₹5000',
            duration: '2 hours',
            image: 'images/services/bridal-makeup.jpg'
        }
    ];

    // Initialize Service Recommendations
    function initServiceRecommendations() {
        const filterButtons = document.querySelectorAll('.recommendation-filter .filter-btn');
        const recommendationsGrid = document.querySelector('.recommendations-grid');

        // Render all services initially
        renderServices(services);

        // Add event listeners to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter services
                const category = button.getAttribute('data-category');
                const filteredServices = category === 'all' 
                    ? services 
                    : services.filter(service => service.category === category);

                // Render filtered services
                renderServices(filteredServices);
            });
        });

        // Render services function
        function renderServices(servicesToRender) {
            recommendationsGrid.innerHTML = servicesToRender.map(service => `
                <div class="service-card" data-category="${service.category}">
                    <div class="service-image">
                        <img src="${service.image}" alt="${service.name}" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="service-content">
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                        <div class="service-meta">
                            <span class="service-price">${service.price}</span>
                            <span class="service-duration">${service.duration}</span>
                        </div>
                        <button class="btn btn-primary book-service" data-service="${service.name}" data-price="${service.price}">
                            Book Now
                        </button>
                    </div>
                </div>
            `).join('');

            // Add event listeners to book buttons
            document.querySelectorAll('.book-service').forEach(button => {
                button.addEventListener('click', function() {
                    const service = this.getAttribute('data-service');
                    const price = this.getAttribute('data-price');
                    openBookingModal(service, price);
                });
            });
        }
    }

    // Virtual Try-On
    function initVirtualTryOn() {
        const startTryOnBtn = document.getElementById('startTryOn');
        const tryOnPreview = document.querySelector('.tryon-preview');
        const tryOnPlaceholder = document.querySelector('.tryon-placeholder');
        
        if (startTryOnBtn) {
            startTryOnBtn.addEventListener('click', function() {
                // In a real implementation, this would open the device camera
                // For demo purposes, we'll show a message
                tryOnPlaceholder.innerHTML = `
                    <i class="fas fa-camera"></i>
                    <span>Camera access required for virtual try-on</span>
                    <p class="mt-3">Allow camera access to try on different hairstyles and colors.</p>
                    <button class="btn btn-outline mt-2">Allow Camera</button>
                `;
                
                // Simulate camera access
                setTimeout(() => {
                    tryOnPlaceholder.innerHTML = `
                        <div class="tryon-options">
                            <h4>Choose a Style</h4>
                            <div class="style-options">
                                <button class="style-option" data-style="long">Long Hair</button>
                                <button class="style-option" data-style="short">Short Hair</button>
                                <button class="style-option" data-style="curly">Curly</button>
                                <button class="style-option" data-style="updo">Updo</button>
                            </div>
                            <div class="color-options mt-3">
                                <h5>Hair Color</h5>
                                <div class="color-swatches">
                                    <span class="color-swatch" style="background: #000000;"></span>
                                    <span class="color-swatch" style="background: #4A3520;"></span>
                                    <span class="color-swatch" style="background: #8B4513;"></span>
                                    <span class="color-swatch" style="background: #A0522D;"></span>
                                    <span class="color-swatch" style="background: #D2B48C;"></span>
                                    <span class="color-swatch" style="background: #F5DEB3;"></span>
                                    <span class="color-swatch" style="background: #FFD700;"></span>
                                    <span class="color-swatch" style="background: #FF4500;"></span>
                                    <span class="color-swatch" style="background: #FF1493;"></span>
                                    <span class="color-swatch" style="background: #9400D3;"></span>
                                </div>
                            </div>
                        </div>
                    `;
                }, 1000);
            });
        }
    }

    // Real-time Availability Checker
    function initAvailabilityChecker() {
        const serviceSelect = document.getElementById('serviceSelect');
        const dateSelect = document.getElementById('dateSelect');
        const checkAvailabilityBtn = document.getElementById('checkAvailability');
        const timeSlotsContainer = document.getElementById('timeSlots');
        
        // Set minimum date to today
        if (dateSelect) {
            const today = new Date().toISOString().split('T')[0];
            dateSelect.setAttribute('min', today);
            
            // Set default date to today
            dateSelect.value = today;
        }
        
        // Generate time slots (in a real app, this would come from an API)
        function generateTimeSlots(date) {
            const slots = [];
            const hours = [10, 11, 12, 14, 15, 16, 17, 18]; // 10 AM to 6 PM with 1-hour break
            
            // In a real app, you would check against booked slots from the server
            hours.forEach(hour => {
                // Randomly mark some slots as booked for demo purposes
                const isBooked = Math.random() > 0.7;
                const timeString = `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                
                slots.push({
                    time: timeString,
                    isBooked: isBooked
                });
            });
            
            return slots;
        }
        
        // Render time slots
        function renderTimeSlots(slots) {
            if (!timeSlotsContainer) return;
            
            if (slots.length === 0) {
                timeSlotsContainer.innerHTML = '<p>No available time slots for the selected date. Please choose another date.</p>';
                return;
            }
            
            timeSlotsContainer.innerHTML = slots.map(slot => `
                <div class="time-slot ${slot.isBooked ? 'booked' : ''}" ${slot.isBooked ? 'disabled' : ''}>
                    ${slot.time}
                </div>
            `).join('');
            
            // Add event listeners to time slots
            document.querySelectorAll('.time-slot:not(.booked)').forEach(slot => {
                slot.addEventListener('click', function() {
                    // Remove selected class from all slots
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    // Add selected class to clicked slot
                    this.classList.add('selected');
                    
                    // In a real app, you would proceed to booking or show a confirmation button
                    console.log('Selected time:', this.textContent.trim());
                    
                    // Show a message or enable booking button
                    const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'selected service';
                    const date = dateSelect ? dateSelect.value : 'selected date';
                    
                    // You could show a confirmation button here or directly open booking modal
                });
            });
        }
        
        // Check availability button click handler
        if (checkAvailabilityBtn) {
            checkAvailabilityBtn.addEventListener('click', function() {
                const serviceId = serviceSelect ? serviceSelect.value : '';
                const date = dateSelect ? dateSelect.value : '';
                
                if (!serviceId) {
                    alert('Please select a service');
                    return;
                }
                
                if (!date) {
                    alert('Please select a date');
                    return;
                }
                
                // In a real app, you would make an API call here to get available slots
                // For demo, we'll generate some random slots
                const slots = generateTimeSlots(date);
                renderTimeSlots(slots);
            });
        }
        
        // Initial load of time slots if date is already selected
        if (dateSelect && dateSelect.value) {
            const slots = generateTimeSlots(dateSelect.value);
            renderTimeSlots(slots);
        }
    }
    
    // Open booking modal
    function openBookingModal(service, price) {
        // In a real app, you would open a modal with a booking form
        alert(`Booking ${service} for ${price}. This would open a booking form in a real implementation.`);
    }

    // Initialize all features
    initServiceRecommendations();
    initVirtualTryOn();
    initAvailabilityChecker();
});
