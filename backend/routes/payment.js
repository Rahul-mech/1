const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Middleware to verify JWT (reuse from user.js)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/add-balance
router.post('/add-balance', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
    res.json({ orderId: order.id, amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/verify-payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require('crypto');
  const User = require('../models/User');

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      const user = await User.findById(req.userId);
      const order = await razorpay.orders.fetch(razorpay_order_id);
      user.walletBalance += order.amount / 100; // Convert paise to INR
      await user.save();
      res.json({ message: 'Payment verified and balance updated' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
