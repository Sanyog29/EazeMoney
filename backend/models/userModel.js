const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'transfer', 'withdrawal']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const loginRecordSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
});

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema],
  loginRecords: [loginRecordSchema]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;