const express = require('express');
const { transferMoney, getTransactionHistory } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/transfer', protect, transferMoney);
router.get('/history', protect, getTransactionHistory);

module.exports = router;