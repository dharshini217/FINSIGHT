const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction } = require('../controllers/transactionController');

router.route('/')
    .get(getTransactions)
    .post(addTransaction);

module.exports = router;