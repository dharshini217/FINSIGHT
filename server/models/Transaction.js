const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Please add a description']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    category: {
        type: String,
        default: 'Uncategorized' // Our AI will change this later!
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);