import mongoose from 'mongoose';

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Groceries', 'Entertainment', 'Bills', 'Shopping', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  recipientId: {
    type: String,
    sparse: true
  }
});

// Create and export the model
export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);