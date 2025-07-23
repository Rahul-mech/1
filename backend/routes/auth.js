const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const User = require('../models/User');
const router = express.Router();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// POST /api/login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber: phone });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    const user = await User.findOne({ phoneNumber: phone });
    if (user) return res.status(400).json({ error: 'Phone number already registered' });

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    await User.updateOne(
      { phoneNumber: phone },
      { $set: { otp, otpExpires } },
      { upsert: true }
    );

    res.json({ message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phoneNumber: phone });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/register
router.post('/register', async (req, res) => {
  const { phone, city, state, country, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber: phone });
    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'OTP verification required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.city = city;
    user.state = state;
    user.country = country;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
