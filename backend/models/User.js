const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  investments: [{
    amount: Number,
    date: Date,
    status: { type: String, enum: ['active', 'matured'], default: 'active' },
    maturityDate: Date
  }],
  withdrawals: [{
    amount: Number,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: Date
  }],
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
