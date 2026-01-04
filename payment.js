// Razorpay Integration
const API_BASE_URL = 'http://localhost:5000/api';
let RAZORPAY_KEY_ID = ''; // Will be fetched from backend
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Razorpay when the script loads
    initializeRazorpay();
    
    // Add click event listeners to all book buttons
    document.querySelectorAll('.btn-book').forEach(button => {
        button.addEventListener('click', handleBookNowClick);
    });
});

// Initialize Razorpay
function initializeRazorpay() {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
        console.log('Razorpay is already loaded');
        return;
    }
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
        console.log('Razorpay script loaded successfully');
        // Re-attach event listeners in case they weren't attached before
        document.querySelectorAll('.btn-book').forEach(button => {
            button.removeEventListener('click', handleBookNowClick);
            button.addEventListener('click', handleBookNowClick);
        });
    };
    script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        // Show error message to user
        showError('Failed to load payment system. Please refresh the page and try again.');
    };
    
    document.body.appendChild(script);
}

// Handle Book Now button click
async function handleBookNowClick(event) {
    const button = event.currentTarget;
    const serviceCard = button.closest('.service-card');
    const serviceName = serviceCard.querySelector('h3').textContent;
    const servicePrice = serviceCard.querySelector('.service-price').textContent;
    const amount = parseInt(servicePrice.replace(/\D/g, '')); // Extract numbers from price text
    
    // Disable button to prevent multiple clicks
    button.disabled = true;
    button.textContent = 'Processing...';
    
    try {
        await makePayment(serviceName, amount);
    } catch (error) {
        console.error('Payment error:', error);
        showError('An error occurred while processing your payment. Please try again.');
    } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = 'Book Now';
    }
}

// Function to handle payment
async function makePayment(serviceName, amount) {
    if (!window.Razorpay) {
        throw new Error('Payment system is not available. Please try again later.');
    }
    
    // Show loading state
    showLoading('Preparing your booking...');
    
    try {
        // Create order on our backend
        const orderResponse = await createOrder(serviceName, amount);
        
        // If we don't have the Razorpay key yet, try to get it from the order response
        if (!RAZORPAY_KEY_ID && orderResponse.key_id) {
            RAZORPAY_KEY_ID = orderResponse.key_id;
        }
        
        if (!RAZORPAY_KEY_ID) {
            throw new Error('Payment gateway configuration is missing. Please try again later.');
        }
        
        // Create Razorpay options
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: orderResponse.amount,
            currency: orderResponse.currency || 'INR',
            name: 'JMK Beauty Salon & Spa',
            description: serviceName,
            order_id: orderResponse.id,
            handler: function (response) {
                // Handle successful payment
                showSuccess('Payment successful! Your booking is confirmed.');
                console.log('Payment successful:', response);
                
                // In a real app, you would send this to your backend to verify the payment
                // and confirm the booking
                verifyPayment(response, orderResponse.id);
            },
            prefill: {
                // You can pre-fill customer details if available
                name: '', // Get from user input or profile
                email: '', // Get from user input or profile
                contact: '' // Get from user input or profile
            },
            notes: {
                service: serviceName,
                booking_reference: 'BK' + Date.now()
            },
            theme: {
                color: '#FF4D8D' // Match your brand color
            },
            modal: {
                ondismiss: function() {
                    // Handle when the payment modal is closed
                    console.log('Payment modal closed');
                }
            }
        };
        
        // Initialize Razorpay payment
        const rzp = new window.Razorpay(options);
        rzp.open();
        
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    } finally {
        // Hide loading state
        hideLoading();
    }
}

// Create an order via backend API
async function createOrder(serviceName, amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'INR',
                receipt: 'rcpt_' + Math.random().toString(36).substr(2, 9),
                notes: { service: serviceName }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }

        return await response.json();
    } catch (error) {
        console.error('Order creation error:', error);
        throw new Error('Failed to create payment order. Please try again.');
    }
}

// Verify payment with backend
async function verifyPayment(paymentResponse, orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/verify-payment`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: orderId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Payment verification failed');
        }

        const result = await response.json();
        
        if (result.success) {
            // Redirect to success page or update UI
            window.location.href = '/booking-success?payment_id=' + paymentResponse.razorpay_payment_id;
        } else {
            throw new Error('Payment verification failed');
        }
        
        return result;
    } catch (error) {
        console.error('Payment verification error:', error);
        showError('Payment verification failed. Please contact support if the amount was deducted.');
        throw error;
    }
}

// UI Helper Functions
function showLoading(message = 'Processing...') {
    // You can implement a loading overlay or spinner
    console.log('Loading:', message);
    // Example: document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    // Hide loading overlay
    // Example: document.getElementById('loading-overlay').style.display = 'none';
}

function showSuccess(message) {
    // Show success message to user
    alert('✅ ' + message);
    // You can replace this with a more elegant notification system
}

function showError(message) {
    // Show error message to user
    alert('❌ ' + message);
    // You can replace this with a more elegant error notification system
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    // Handle any cleanup if needed when user navigates away
});
