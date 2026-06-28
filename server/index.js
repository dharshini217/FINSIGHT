const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');



const transactions = require('./routes/transactions'); 

// This tells the server to find the .env file in the folder above
dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1/transactions', transactions);
app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 5000;

// Connect to the MongoDB database using the link in your .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.log("❌ DB Connection Error: ");
        console.error(err);
    });

// A simple route to check if the server is working
app.get('/', (req, res) => res.send("FinSight AI Server is live!"));