const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Transfer money
router.post('/transfer', protect, async (req, res) => {
  try {
    const { recipientAccountNumber, amount, description } = req.body;
    const senderId = req.user._id;

    console.log('Transfer request:', { recipientAccountNumber, amount, description });
    
    // Find sender (already in req.user)
    const sender = req.user;

    // Find recipient
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
    
    if (!recipient) {
      console.log('Recipient not found for account number:', recipientAccountNumber);
      return res.status(404).json({
        success: false,
        message: 'Recipient account not found'
      });
    }

    // Check if sender has enough balance
    if (sender.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }

    // Create transaction objects
    const senderTransaction = {
      description: description || `Transfer to ${recipient.fullName}`,
      amount,
      type: 'transfer',
      date: new Date()
    };

    const recipientTransaction = {
      description: description || `Transfer from ${sender.fullName}`,
      amount,
      type: 'deposit',
      date: new Date()
    };

    // Update sender in database
    sender.balance -= parseFloat(amount);
    sender.transactions.unshift(senderTransaction);
    await sender.save();

    // Update recipient in database
    recipient.balance += parseFloat(amount);
    recipient.transactions.unshift(recipientTransaction);
    await recipient.save();
    
    // Log the updated balances for verification
    console.log(`Updated sender balance: ₹${sender.balance}`);
    console.log(`Updated recipient balance: ₹${recipient.balance}`);

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      user: {
        id: sender._id,
        fullName: sender.fullName,
        email: sender.email,
        accountNumber: sender.accountNumber,
        balance: sender.balance,
        transactions: sender.transactions
      }
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get transaction history
router.get('/history', protect, async (req, res) => {
  try {
    // Get fresh user data from database
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      transactions: user.transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;