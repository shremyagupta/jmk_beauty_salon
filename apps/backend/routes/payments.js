const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Initialize Razorpay only if keys are provided. Otherwise expose stub endpoints.
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
} else {
    console.warn('Razorpay keys not found in environment. Payment routes will return stub responses.');
}

// Create Razorpay order
router.post('/create-order', async (req, res) => {
    if (!razorpay) {
        return res.status(501).json({ error: 'Razorpay not configured on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
    }
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: receipt || `order_${Date.now()}`,
        payment_capture: 1 // Auto capture payment
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
    if (!razorpay) {
        return res.status(501).json({ error: 'Razorpay not configured on server.' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create hash
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment is successful
        // Here you can save the payment details to your database
        // and update your order status
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
    if (!razorpay) {
        return res.status(501).json({ error: 'Razorpay not configured on server.' });
    }
    try {
        const payment = await razorpay.payments.fetch(req.params.paymentId);
        res.json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ error: 'Error fetching payment details' });
    }
});

module.exports = router;
