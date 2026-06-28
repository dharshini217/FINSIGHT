const Transaction = require('../models/Transaction');
const axios = require('axios'); // Use the tool we just installed

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        return res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

exports.addTransaction = async (req, res) => {
    try {
        const { text, amount } = req.body;

        // 🤖 CALL THE AI: Send the text to the Python server on port 8000
        let aiCategory = 'Uncategorized';
        try {
            const mlUrl = process.env.ML_URL || 'http://127.0.0.1:8000';
            const response = await axios.post(`${mlUrl}/predict`, { text });
            aiCategory = response.data.category; // This will be "AI Categorizing..."
        } catch (error) {
            console.log("AI Server (Python) is not responding.");
        }

        // 💾 SAVE TO DATABASE: Save the transaction with the AI's category
        const transaction = await Transaction.create({
            user: req.user.id,
            text,
            amount,
            category: aiCategory
        });

        return res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        return res.status(400).json({ success: false, error: 'Invalid Data' });
    }
}