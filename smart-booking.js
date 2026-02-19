// Smart Booking System - Professional Implementation
class SmartBookingSystem {
  constructor() {
    this.services = [];
    this.stylists = [];
    this.selectedService = null;
    this.selectedStylist = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.availableSlots = [];
    this.predictions = [];
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadServices();
    this.setMinDate();
  }

  setupElements() {
    // Form elements
    this.form = document.getElementById('smartBookingForm');
    this.customerNameInput = document.getElementById('customerName');
    this.emailInput = document.getElementById('email');
    this.phoneInput = document.getElementById('phone');
    this.serviceSelect = document.getElementById('service');
    this.dateInput = document.getElementById('date');
    this.timeSelect = document.getElementById('time');
    this.notesTextarea = document.getElementById('notes');
    
    // UI elements
    this.stylistGrid = document.getElementById('stylistGrid');
    this.timeSlotsGrid = document.getElementById('timeSlotsGrid');
    this.predictionsGrid = document.getElementById('predictionsGrid');
    this.bookingSummary = document.getElementById('bookingSummary');
    this.checkAvailabilityBtn = document.getElementById('checkAvailability');
    this.confirmBookingBtn = document.getElementById('confirmBooking');
    
    // Loading and notification elements
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.notificationToast = document.getElementById('notificationToast');
    
    // Availability indicator
    this.availabilityIndicator = document.getElementById('availabilityIndicator');
    this.availabilityText = document.getElementById('availabilityText');
    
    // Summary elements
    this.summaryService = document.getElementById('summaryService');
    this.summaryDuration = document.getElementById('summaryDuration');
    this.summaryPrice = document.getElementById('summaryPrice');
    this.summaryWaitTime = document.getElementById('summaryWaitTime');
    this.summaryTotal = document.getElementById('summaryTotal');
  }

  setupEventListeners() {
    // Form events
    this.serviceSelect.addEventListener('change', () => this.handleServiceChange());
    this.dateInput.addEventListener('change', () => this.handleDateChange());
    this.timeSelect.addEventListener('change', () => this.handleTimeChange());
    
    // Button events
    this.checkAvailabilityBtn.addEventListener('click', () => this.checkAvailability());
    this.form.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    
    // Real-time validation
    this.customerNameInput.addEventListener('input', () => this.validateForm());
    this.emailInput.addEventListener('input', () => this.validateForm());
    this.phoneInput.addEventListener('input', () => this.validateForm());
  }

  setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    this.dateInput.min = today;
  }

  async loadServices() {
    try {
      this.showLoading(true);
      const response = await fetch('/api/services');
      this.services = await response.json();
      
      this.populateServiceSelect();
      this.showLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      this.showNotification('Error loading services', 'error');
      this.showLoading(false);
    }
  }

  populateServiceSelect() {
    this.serviceSelect.innerHTML = '<option value="">Select a service</option>';
    
    this.services.forEach(service => {
      if (service.isActive) {
        const option = document.createElement('option');
        option.value = service._id;
        option.textContent = `${service.name} - ₹${service.price}`;
        option.dataset.duration = service.duration || 60;
        this.serviceSelect.appendChild(option);
      }
    });
  }

  async handleServiceChange() {
    const serviceId = this.serviceSelect.value;
    if (!serviceId) {
      this.selectedService = null;
      this.stylistGrid.innerHTML = '';
      return;
    }

    this.selectedService = this.services.find(s => s._id === serviceId);
    await this.loadStylists(serviceId);
    this.updateSummary();
  }

  async loadStylists(serviceId) {
    try {
      this.showLoading(true);
      const response = await fetch(`/api/smart-booking/stylists/${serviceId}`);
      const data = await response.json();
      this.stylists = data.stylists;
      
      this.populateStylistGrid();
      this.showLoading(false);
    } catch (error) {
      console.error('Error loading stylists:', error);
      this.showNotification('Error loading stylists', 'error');
      this.showLoading(false);
    }
  }

  populateStylistGrid() {
    this.stylistGrid.innerHTML = '';
    
    this.stylists.forEach(stylist => {
      const stylistCard = document.createElement('div');
      stylistCard.className = 'stylist-card';
      stylistCard.dataset.stylistId = stylist._id;
      
      stylistCard.innerHTML = `
        <div class="stylist-header">
          <div class="stylist-avatar">${stylist.name.charAt(0).toUpperCase()}</div>
          <div class="stylist-info">
            <h4>${stylist.name}</h4>
            <div class="stylist-rating">
              ${this.generateStars(stylist.rating)}
              <span>(${stylist.totalReviews || 0})</span>
            </div>
          </div>
        </div>
        <div class="stylist-specialties">
          ${stylist.specialties.map(spec => 
            `<span class="specialty-tag">${this.formatSpecialty(spec)}</span>`
          ).join('')}
        </div>
        <div class="stylist-stats">
          <div class="stat-item">
            <span>📅</span>
            <span>${stylist.experience} years</span>
          </div>
          <div class="stat-item">
            <span>✂️</span>
            <span>${stylist.completedAppointments || 0} services</span>
          </div>
        </div>
      `;
      
      stylistCard.addEventListener('click', () => this.selectStylist(stylist._id));
      this.stylistGrid.appendChild(stylistCard);
    });
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    if (hasHalfStar) {
      stars += '✨';
    }
    
    return stars;
  }

  formatSpecialty(specialty) {
    return specialty.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  selectStylist(stylistId) {
    // Remove previous selection
    document.querySelectorAll('.stylist-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-stylist-id="${stylistId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      this.selectedStylist = this.stylists.find(s => s._id === stylistId);
    }
  }

  async handleDateChange() {
    const selectedDate = this.dateInput.value;
    if (!selectedDate || !this.selectedService) return;
    
    this.selectedDate = selectedDate;
    await this.loadAvailability();
    await this.loadPredictions();
  }

  async loadAvailability() {
    if (!this.selectedDate || !this.selectedService) return;
    
    try {
      this.showLoading(true);
      const response = await fetch(
        `/api/smart-booking/availability/${this.selectedDate}/${this.selectedService._id}`
      );
      const data = await response.json();
      
      this.availableSlots = data.availableSlots || [];
      this.populateTimeSlots();
      this.updateAvailabilityIndicator();
      this.showLoading(false);
    } catch (error) {
      console.error('Error loading availability:', error);
      this.showNotification('Error loading availability', 'error');
      this.showLoading(false);
    }
  }

  populateTimeSlots() {
    this.timeSlotsGrid.innerHTML = '';
    
    if (this.availableSlots.length === 0) {
      this.timeSlotsGrid.innerHTML = '<p>No available slots for this date</p>';
      return;
    }
    
    this.availableSlots.forEach(slot => {
      const slotElement = document.createElement('div');
      slotElement.className = `time-slot ${!slot.available ? 'disabled' : ''}`;
      slotElement.textContent = slot.time;
      slotElement.dataset.time = slot.time;
      slotElement.dataset.available = slot.available;
      
      if (slot.available) {
        slotElement.addEventListener('click', () => this.selectTimeSlot(slot.time));
      }
      
      this.timeSlotsGrid.appendChild(slotElement);
    });
  }

  selectTimeSlot(time) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    // Add selection to clicked slot
    const selectedSlot = document.querySelector(`[data-time="${time}"]`);
    if (selectedSlot) {
      selectedSlot.classList.add('selected');
      this.selectedTime = time;
      this.timeSelect.value = time;
      this.updateSummary();
    }
  }

  async loadPredictions() {
    if (!this.selectedService) return;
    
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Next 7 days
      
      const response = await fetch(
        `/api/smart-booking/predictions/${this.selectedService._id}?startDate=${new Date().toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      
      this.predictions = data.predictions || [];
      this.populatePredictions();
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  }

  populatePredictions() {
    this.predictionsGrid.innerHTML = '';
    
    this.predictions.forEach(prediction => {
      const predictionCard = document.createElement('div');
      predictionCard.className = 'prediction-card';
      
      const availabilityLevel = this.getAvailabilityLevel(prediction.predictedAvailability);
      
      predictionCard.innerHTML = `
        <div class="prediction-day">${prediction.day}</div>
        <div class="prediction-availability availability-${availabilityLevel}">
          ${Math.round(prediction.predictedAvailability * 100)}%
        </div>
        <div class="prediction-recommendation">${prediction.recommendedAction}</div>
      `;
      
      this.predictionsGrid.appendChild(predictionCard);
    });
  }

  getAvailabilityLevel(availability) {
    if (availability >= 0.7) return 'high';
    if (availability >= 0.4) return 'medium';
    return 'low';
  }

  updateAvailabilityIndicator() {
    const availableSlots = this.availableSlots.filter(slot => slot.available).length;
    const totalSlots = this.availableSlots.length;
    const availabilityPercentage = totalSlots > 0 ? availableSlots / totalSlots : 0;
    
    this.availabilityIndicator.className = `indicator-dot ${this.getAvailabilityLevel(availabilityPercentage)}`;
    this.availabilityText.textContent = `${availableSlots} of ${totalSlots} slots available`;
  }

  updateSummary() {
    if (!this.selectedService) {
      this.bookingSummary.style.display = 'none';
      return;
    }
    
    this.bookingSummary.style.display = 'block';
    this.summaryService.textContent = this.selectedService.name;
    this.summaryDuration.textContent = `${this.selectedService.duration || 60} minutes`;
    this.summaryPrice.textContent = `₹${this.selectedService.price}`;
    
    // Calculate estimated wait time
    const estimatedWait = this.calculateEstimatedWaitTime();
    this.summaryWaitTime.textContent = estimatedWait ? `~${estimatedWait} min` : 'N/A';
    
    this.summaryTotal.textContent = `₹${this.selectedService.price}`;
  }

  calculateEstimatedWaitTime() {
    if (!this.selectedDate || !this.selectedTime) return null;
    
    // Simple heuristic based on time of day and day of week
    const bookingDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
    const hour = bookingDateTime.getHours();
    const dayOfWeek = bookingDateTime.getDay();
    
    // Weekend and evening appointments typically have longer waits
    let waitMultiplier = 1;
    if (dayOfWeek === 0 || dayOfWeek === 6) waitMultiplier += 0.3; // Weekend
    if (hour >= 16 || hour <= 10) waitMultiplier += 0.2; // Peak hours
    
    const baseWaitTime = 15; // 15 minutes base
    return Math.round(baseWaitTime * waitMultiplier);
  }

  async checkAvailability() {
    if (!this.validateForm()) {
      this.showNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    await this.loadAvailability();
    this.showNotification('Availability updated', 'success');
  }

  validateForm() {
    const isValid = 
      this.customerNameInput.value.trim() &&
      this.emailInput.value.trim() &&
      this.phoneInput.value.trim() &&
      this.selectedService &&
      this.selectedDate &&
      this.selectedTime;
    
    this.confirmBookingBtn.disabled = !isValid;
    return isValid;
  }

  async handleBookingSubmit(event) {
    event.preventDefault();
    
    if (!this.validateForm()) {
      this.showNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    const bookingData = {
      customerName: this.customerNameInput.value.trim(),
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
      service: this.selectedService._id,
      stylist: this.selectedStylist?._id || null,
      date: this.selectedDate,
      time: this.selectedTime,
      duration: this.selectedService.duration || 60,
      totalPrice: this.selectedService.price,
      notes: this.notesTextarea.value.trim(),
      priority: this.determinePriority()
    };
    
    try {
      this.showLoading(true);
      const response = await fetch('/api/smart-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Booking failed');
      }
      
      const booking = await response.json();
      this.showNotification('Booking confirmed successfully!', 'success');
      this.resetForm();
      this.sendConfirmationEmail(booking);
      
      this.showLoading(false);
    } catch (error) {
      console.error('Booking error:', error);
      this.showNotification(error.message, 'error');
      this.showLoading(false);
    }
  }

  determinePriority() {
    // Business logic for determining booking priority
    const bookingDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
    const daysUntilBooking = Math.ceil((bookingDateTime - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilBooking <= 1) return 'high';
    if (daysUntilBooking <= 7) return 'medium';
    return 'low';
  }

  resetForm() {
    this.form.reset();
    this.selectedService = null;
    this.selectedStylist = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.availableSlots = [];
    
    this.stylistGrid.innerHTML = '';
    this.timeSlotsGrid.innerHTML = '';
    this.predictionsGrid.innerHTML = '';
    this.bookingSummary.style.display = 'none';
    
    this.confirmBookingBtn.disabled = true;
  }

  sendConfirmationEmail(booking) {
    // In a real implementation, this would trigger an email
    // For now, we'll just log it
    console.log('Confirmation email sent for booking:', booking);
  }

  showLoading(show) {
    this.loadingOverlay.classList.toggle('active', show);
  }

  showNotification(message, type = 'info') {
    this.notificationToast.textContent = message;
    this.notificationToast.className = `notification-toast ${type}`;
    
    // Show notification
    setTimeout(() => {
      this.notificationToast.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      this.notificationToast.classList.remove('show');
    }, 3000);
  }

  handleTimeChange() {
    this.selectedTime = this.timeSelect.value;
    this.updateSummary();
  }
}

// Initialize the smart booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.smartBookingSystem = new SmartBookingSystem();
});
