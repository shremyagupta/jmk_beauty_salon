document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('feedback-name').value;
            const serviceType = document.getElementById('service-type').value;
            const rating = document.querySelector('input[name="rating"]:checked')?.value || 3;
            const message = document.getElementById('feedback-message').value;
            const allowTestimonial = document.getElementById('allow-testimonial').checked;
            
            // Create feedback object
            const feedback = {
                name,
                serviceType,
                rating: parseInt(rating),
                message,
                allowTestimonial,
                date: new Date().toISOString()
            };
            
            // In a real application, you would send this to your server
            console.log('Feedback submitted:', feedback);
            
            // Show success message
            showFeedbackSuccess();
            
            // Reset form
            feedbackForm.reset();
        });
    }
    
    // Function to show success message
    function showFeedbackSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'feedback-success';
        successMsg.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>Thank You for Your Feedback!</h4>
                <p>We appreciate you taking the time to share your experience with us.</p>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .feedback-success {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                max-width: 350px;
            }
            
            .success-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .feedback-success i {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            
            .feedback-success h4 {
                margin: 5px 0;
                font-size: 1.2rem;
            }
            
            .feedback-success p {
                margin: 5px 0 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(successMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successMsg.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                successMsg.remove();
            }, 500);
        }, 5000);
    }
});
