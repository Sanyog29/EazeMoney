const User = require('../models/User');

// Transfer money
exports.transferMoney = async (req, res) => {
  try {
    const { recipientAccountNumber, amount, description } = req.body;
    const senderId = req.user._id;

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid amount'
      });
    }

    // Find sender
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    // Find recipient
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
    if (!recipient) {
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

    // Update balances and add transactions
    sender.balance -= amount;
    sender.transactions.unshift(senderTransaction);
    await sender.save();

    recipient.balance += amount;
    recipient.transactions.unshift(recipientTransaction);
    await recipient.save();

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
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
};