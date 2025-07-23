const express = require('express');
const User = require('../models/User');
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

// POST /api/invest
router.post('/invest', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  if (amount !== 500) return res.status(400).json({ error: 'Invalid investment amount' });

  try {
    const user = await User.findById(req.userId);
    if (user.walletBalance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    user.walletBalance -= amount;
    user.investments.push({
      amount,
      date: new Date(),
      status: 'active',
      maturityDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    res.json({ message: 'Investment successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/withdraw
router.post('/withdraw', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (user.walletBalance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    user.withdrawals.push({
      amount,
      status: 'pending',
      date: new Date()
    });
    await user.save();

    res.json({ message: 'Withdrawal request submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
