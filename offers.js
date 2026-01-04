// Special Offers Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timers
    initCountdownTimers();
    
    // Set up event listeners for booking buttons
    setupBookingButtons();
    
    // Initialize gift card options
    initGiftCardOptions();
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Initialize countdown timers for special offers
function initCountdownTimers() {
    const timers = document.querySelectorAll('.offer-timer');
    
    timers.forEach(timer => {
        const endTime = timer.getAttribute('data-end');
        if (!endTime) return;
        
        const countDownDate = new Date(endTime).getTime();
        
        // Update the countdown every second
        const countdown = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            
            // If the countdown is over, clear it
            if (distance < 0) {
                clearInterval(countdown);
                timer.innerHTML = "<span>Offer Expired</span>";
                return;
            }
            
            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update the timer display
            timer.innerHTML = `
                <span>Ends in: </span>
                <span class="days">${days.toString().padStart(2, '0')}</span>d 
                <span class="hours">${hours.toString().padStart(2, '0')}</span>h 
                <span class="minutes">${minutes.toString().padStart(2, '0')}</span>m 
                <span class="seconds">${seconds.toString().padStart(2, '0')}</span>s
            `;
        }, 1000);
    });
}

// Set up event listeners for booking buttons
function setupBookingButtons() {
    // Add click event to all book now buttons
    document.querySelectorAll('.btn-book').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageName = this.closest('.offer-card').querySelector('h3').textContent;
            openBookingModal(packageName);
        });
    });
}

// Initialize gift card options
function initGiftCardOptions() {
    const giftOptions = document.querySelectorAll('.gift-option');
    
    giftOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            giftOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // If custom amount option is clicked, show input field
            if (this.classList.contains('custom')) {
                const customInput = document.createElement('div');
                customInput.className = 'custom-amount-input';
                customInput.innerHTML = `
                    <div class="form-group" style="margin-top: 1rem;">
                        <label for="customAmount">Enter Amount (₹)</label>
                        <input type="number" id="customAmount" min="500" step="500" class="form-control" placeholder="Enter amount in ₹">
                    </div>
                `;
                
                // Remove existing custom input if any
                const existingInput = document.querySelector('.custom-amount-input');
                if (existingInput) {
                    existingInput.remove();
                }
                
                this.appendChild(customInput);
            } else {
                // Remove custom input if another option is selected
                const existingInput = document.querySelector('.custom-amount-input');
                if (existingInput) {
                    existingInput.remove();
                }
            }
        });
    });
}

// Open gift card modal
function openGiftCardModal(amount = '') {
    let modal = document.getElementById('giftCardModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'giftCardModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Purchase Gift Card</h2>
                <form id="giftCardForm">
                    <div class="form-group">
                        <label for="giftAmount">Gift Amount (₹)</label>
                        <input type="number" id="giftAmount" name="amount" min="500" step="500" value="${amount}" required>
                    </div>
                    <div class="form-group">
                        <label for="recipientName">Recipient's Name *</label>
                        <input type="text" id="recipientName" name="recipientName" required>
                    </div>
                    <div class="form-group">
                        <label for="recipientEmail">Recipient's Email *</label>
                        <input type="email" id="recipientEmail" name="recipientEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="senderName">Your Name *</label>
                        <input type="text" id="senderName" name="senderName" required>
                    </div>
                    <div class="form-group">
                        <label for="giftMessage">Gift Message</label>
                        <textarea id="giftMessage" name="giftMessage" rows="3" placeholder="Add a personal message..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Purchase Gift Card</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close functionality
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        
        // Handle form submission
        const form = document.getElementById('giftCardForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const formDataObj = Object.fromEntries(formData.entries());
                
                // For demo purposes, just show an alert
                alert(`Thank you for your gift card purchase!\n\nA gift card for ₹${formDataObj.amount} has been sent to ${formDataObj.recipientEmail}.`);
                
                // Close the modal
                closeModal();
                
                // Reset the form
                form.reset();
            });
        }
    }
    
    // Show the modal
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
}

// Open loyalty program modal
function openLoyaltyModal() {
    let modal = document.getElementById('loyaltyModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loyaltyModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="loyalty-header">
                    <i class="fas fa-crown"></i>
                    <h2>Join Our Loyalty Program</h2>
                    <p>Earn points with every visit and enjoy exclusive benefits!</p>
                </div>
                <div class="loyalty-benefits">
                    <div class="benefit">
                        <i class="fas fa-coins"></i>
                        <h4>Earn Points</h4>
                        <p>1 point for every ₹100 spent</p>
                    </div>
                    <div class="benefit">
                        <i class="fas fa-gift"></i>
                        <h4>Redeem Rewards</h4>
                        <p>100 points = ₹500 off</p>
                    </div>
                    <div class="benefit">
                        <i class="fas fa-star"></i>
                        <h4>Exclusive Perks</h4>
                        <p>Member-only events & offers</p>
                    </div>
                </div>
                <form id="loyaltyForm">
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="birthdate">Birthdate</label>
                        <input type="date" id="birthdate" name="birthdate">
                        <small>Get a special treat on your birthday!</small>
                    </div>
                    <button type="submit" class="btn btn-primary">Join Now</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close functionality
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        
        // Handle form submission
        const form = document.getElementById('loyaltyForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const formDataObj = Object.fromEntries(formData.entries());
                
                // For demo purposes, just show an alert
                alert(`Thank you for joining our Loyalty Program, ${formDataObj.fullName}!\n\nYour membership details have been sent to ${formDataObj.email}.`);
                
                // Close the modal
                closeModal();
                
                // Reset the form
                form.reset();
            });
        }
    }
    
    // Show the modal
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
}

// Open booking modal with pre-filled package name
function openBookingModal(packageName) {
    // Check if the modal exists
    let modal = document.getElementById('bookingModal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bookingModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Book Your Appointment</h2>
                <form id="bookingForm">
                    <div class="form-group">
                        <label for="package">Package</label>
                        <input type="text" id="package" name="package" readonly>
                    </div>
                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email">
                    </div>
                    <div class="form-group">
                        <label for="date">Preferred Date *</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="time">Preferred Time *</label>
                        <select id="time" name="time" required>
                            <option value="">Select a time</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="01:00 PM">01:00 PM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="05:00 PM">05:00 PM</option>
                            <option value="06:00 PM">06:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="message">Special Requests</label>
                        <textarea id="message" name="message" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Book Now</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                overflow-y: auto;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .modal-content {
                background: white;
                margin: 5% auto;
                padding: 30px;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                position: relative;
                box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
                animation: modalFadeIn 0.3s ease-out;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(-50px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 28px;
                font-weight: bold;
                color: #666;
                cursor: pointer;
                transition: color 0.3s;
            }
            
            .close-modal:hover {
                color: #000;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }
            
            .form-group input[type="text"],
            .form-group input[type="email"],
            .form-group input[type="tel"],
            .form-group input[type="date"],
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(255, 77, 141, 0.2);
                outline: none;
            }
            
            .btn-primary {
                background: var(--gradient);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 77, 141, 0.3);
            }
        `;
        document.head.appendChild(style);
        
        // Add close functionality
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Handle form submission
        const form = document.getElementById('bookingForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Here you would typically send the form data to your server
                const formData = new FormData(form);
                const formDataObj = Object.fromEntries(formData.entries());
                
                // For demo purposes, just show an alert
                alert(`Thank you for your booking request!\n\nWe've received your request for ${formDataObj.package} on ${formDataObj.date} at ${formDataObj.time}. We'll contact you shortly to confirm your appointment.`);
                
                // Close the modal
                closeModal();
                
                // Reset the form
                form.reset();
            });
        }
    }
    
    // Set the package name in the form
    const packageInput = modal.querySelector('#package');
    if (packageInput) {
        packageInput.value = packageName;
    }
    
    // Show the modal
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = modal.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.min = today;
    }
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
