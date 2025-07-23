const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const investmentRoutes = require('./routes/investment');
const paymentRoutes = require('./routes/payment');
const User = require('./models/User');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', investmentRoutes);
app.use('/api', paymentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cron job to process matured investments (runs daily at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      for (const investment of user.investments) {
        if (investment.status === 'active' && new Date() >= investment.maturityDate) {
          investment.status = 'matured';
          user.walletBalance += 800; // Credit ₹800
          await user.save();
        }
      }
    }
    console.log('Matured investments processed');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
