// Virtual Try-On System
class VirtualTryOn {
  constructor() {
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.stream = null;
    this.isWebcamActive = false;
    this.currentColor = null;
    this.currentStyle = null;
    this.intensity = 0.5;
    this.faceDetection = null;
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadFaceDetectionAPI();
  }

  setupElements() {
    this.video = document.getElementById('webcam');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Control buttons
    this.startBtn = document.getElementById('startWebcam');
    this.stopBtn = document.getElementById('stopWebcam');
    this.captureBtn = document.getElementById('capturePhoto');
    
    // Options
    this.colorOptions = document.querySelectorAll('.color-option');
    this.styleOptions = document.querySelectorAll('.style-option');
    this.intensitySlider = document.getElementById('intensitySlider');
    
    // Quiz elements
    this.quizForm = document.getElementById('beautyQuizForm');
    this.submitQuizBtn = document.getElementById('submitQuiz');
    this.recommendationsPanel = document.getElementById('recommendationsPanel');
  }

  setupEventListeners() {
    // Webcam controls
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startWebcam());
    }
    
    if (this.stopBtn) {
      this.stopBtn.addEventListener('click', () => this.stopWebcam());
    }
    
    if (this.captureBtn) {
      this.captureBtn.addEventListener('click', () => this.capturePhoto());
    }

    // Color options
    this.colorOptions.forEach(option => {
      option.addEventListener('click', (e) => this.selectColor(e.target));
    });

    // Style options
    this.styleOptions.forEach(option => {
      option.addEventListener('click', (e) => this.selectStyle(e.target));
    });

    // Intensity slider
    if (this.intensitySlider) {
      this.intensitySlider.addEventListener('input', (e) => {
        this.intensity = e.target.value / 100;
        this.applyMakeup();
      });
    }

    // Quiz form
    if (this.submitQuizBtn) {
      this.submitQuizBtn.addEventListener('click', () => this.submitBeautyQuiz());
    }

    // Checkbox and radio interactions
    this.setupFormInteractions();
  }

  setupFormInteractions() {
    // Checkbox styling
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const item = e.target.closest('.checkbox-item');
        if (e.target.checked) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    });

    // Radio styling
    const radios = document.querySelectorAll('.radio-item input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const name = e.target.name;
        document.querySelectorAll(`.radio-item input[name="${name}"]`).forEach(r => {
          r.closest('.radio-item').classList.remove('selected');
        });
        e.target.closest('.radio-item').classList.add('selected');
      });
    });
  }

  async loadFaceDetectionAPI() {
    // Load face detection library (using face-api.js or similar)
    try {
      // In a real implementation, you would load a face detection library
      // For now, we'll simulate face detection
      console.log('Face detection API loaded');
    } catch (error) {
      console.error('Error loading face detection API:', error);
    }
  }

  async startWebcam() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      this.video.srcObject = this.stream;
      this.video.play();
      
      this.video.onloadedmetadata = () => {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.isWebcamActive = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.captureBtn.disabled = false;
        
        // Start makeup rendering loop
        this.renderMakeup();
      };
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please ensure you have granted camera permissions.');
    }
  }

  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.video.srcObject = null;
      this.isWebcamActive = false;
      this.startBtn.disabled = false;
      this.stopBtn.disabled = true;
      this.captureBtn.disabled = true;
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  renderMakeup() {
    if (!this.isWebcamActive) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw video frame
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    
    // Apply makeup overlays
    if (this.currentColor || this.currentStyle) {
      this.applyMakeup();
    }
    
    // Continue rendering
    requestAnimationFrame(() => this.renderMakeup());
  }

  selectColor(colorElement) {
    // Remove active class from all color options
    this.colorOptions.forEach(option => option.classList.remove('active'));
    
    // Add active class to selected color
    colorElement.classList.add('active');
    
    // Store selected color
    this.currentColor = colorElement.style.backgroundColor;
    
    // Apply makeup
    this.applyMakeup();
  }

  selectStyle(styleElement) {
    // Remove active class from all style options
    this.styleOptions.forEach(option => option.classList.remove('active'));
    
    // Add active class to selected style
    styleElement.classList.add('active');
    
    // Store selected style
    this.currentStyle = styleElement.dataset.style;
    
    // Apply makeup
    this.applyMakeup();
  }

  applyMakeup() {
    if (!this.isWebcamActive || !this.ctx) return;

    // Get face landmarks (simulated)
    const faceLandmarks = this.detectFaceLandmarks();
    
    if (faceLandmarks) {
      // Apply lipstick
      if (this.currentColor && this.currentStyle?.includes('lip')) {
        this.applyLipstick(faceLandmarks.lips, this.currentColor);
      }
      
      // Apply eyeshadow
      if (this.currentColor && this.currentStyle?.includes('eye')) {
        this.applyEyeshadow(faceLandmarks.eyes, this.currentColor);
      }
      
      // Apply blush
      if (this.currentColor && this.currentStyle?.includes('blush')) {
        this.applyBlush(faceLandmarks.cheeks, this.currentColor);
      }
    }
  }

  detectFaceLandmarks() {
    // Simulated face detection - in real implementation, use face-api.js or similar
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    return {
      lips: {
        x: width * 0.5,
        y: height * 0.75,
        width: width * 0.15,
        height: height * 0.05
      },
      eyes: {
        left: { x: width * 0.35, y: height * 0.4, width: width * 0.08, height: height * 0.04 },
        right: { x: width * 0.65, y: height * 0.4, width: width * 0.08, height: height * 0.04 }
      },
      cheeks: {
        left: { x: width * 0.25, y: height * 0.55, radius: width * 0.06 },
        right: { x: width * 0.75, y: height * 0.55, radius: width * 0.06 }
      }
    };
  }

  applyLipstick(lips, color) {
    this.ctx.save();
    this.ctx.globalAlpha = this.intensity * 0.8;
    this.ctx.fillStyle = color;
    
    // Create lip shape (simplified)
    this.ctx.beginPath();
    this.ctx.ellipse(lips.x, lips.y, lips.width/2, lips.height/2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add lip gloss effect
    if (this.intensity > 0.5) {
      this.ctx.globalAlpha = this.intensity * 0.3;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.beginPath();
      this.ctx.ellipse(lips.x - lips.width/4, lips.y - lips.height/4, lips.width/6, lips.height/6, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  applyEyeshadow(eyes, color) {
    this.ctx.save();
    this.ctx.globalAlpha = this.intensity * 0.4;
    this.ctx.fillStyle = color;
    
    // Apply to both eyes
    [eyes.left, eyes.right].forEach(eye => {
      this.ctx.beginPath();
      this.ctx.ellipse(eye.x, eye.y - eye.height/2, eye.width/2, eye.height, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }

  applyBlush(cheeks, color) {
    this.ctx.save();
    this.ctx.globalAlpha = this.intensity * 0.3;
    this.ctx.fillStyle = color;
    
    // Apply to both cheeks
    [cheeks.left, cheeks.right].forEach(cheek => {
      const gradient = this.ctx.createRadialGradient(
        cheek.x, cheek.y, 0,
        cheek.x, cheek.y, cheek.radius
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(cheek.x, cheek.y, cheek.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }

  capturePhoto() {
    if (!this.isWebcamActive) return;
    
    // Create a temporary canvas for the photo
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = this.canvas.width;
    photoCanvas.height = this.canvas.height;
    const photoCtx = photoCanvas.getContext('2d');
    
    // Draw the current frame with makeup
    photoCtx.drawImage(this.canvas, 0, 0);
    
    // Convert to blob and download
    photoCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jmk-virtual-tryon-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  async submitBeautyQuiz() {
    if (!this.quizForm) return;
    
    const submitBtn = document.getElementById('submitQuiz');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
      // Collect form data
      const formData = new FormData(this.quizForm);
      const consultationData = {
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        skinType: formData.get('skinType'),
        skinConcerns: formData.getAll('skinConcerns'),
        preferredStyle: formData.get('preferredStyle'),
        budgetRange: formData.get('budgetRange'),
        allergies: formData.get('allergies')?.split(',').map(a => a.trim()) || [],
        previousTreatments: formData.get('previousTreatments')?.split(',').map(t => t.trim()) || []
      };
      
      // Send to backend
      const response = await fetch('/api/beauty-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit consultation');
      }
      
      const result = await response.json();
      
      // Display recommendations
      this.displayRecommendations(result);
      
      // Show success message
      this.showNotification('Beauty consultation submitted successfully!', 'success');
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      this.showNotification('Error submitting consultation. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  displayRecommendations(consultation) {
    if (!this.recommendationsPanel) return;
    
    const recommendationsContainer = document.getElementById('recommendationsList');
    if (!recommendationsContainer) return;
    
    // Clear existing recommendations
    recommendationsContainer.innerHTML = '';
    
    // Add new recommendations
    consultation.recommendations.forEach(rec => {
      const recElement = document.createElement('div');
      recElement.className = 'recommendation-item';
      recElement.innerHTML = `
        <div class="recommendation-priority priority-${rec.priority}">${rec.priority}</div>
        <div class="recommendation-content">
          <h4>${rec.product}</h4>
          <p>${rec.reason}</p>
        </div>
      `;
      recommendationsContainer.appendChild(recElement);
    });
    
    // Show recommendations panel
    this.recommendationsPanel.classList.add('active');
    
    // Scroll to recommendations
    this.recommendationsPanel.scrollIntoView({ behavior: 'smooth' });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    if (type === 'success') {
      notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#f44336';
    } else {
      notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize Virtual Try-On when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.virtualTryOn = new VirtualTryOn();
});
