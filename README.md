# FinSight AI 🚀

FinSight AI is a modern, full-stack personal finance application that goes beyond simple expense tracking. It leverages Machine Learning to automatically categorize your transactions and uses time-series forecasting to predict your future spending habits.

## ✨ Features
- **Secure Authentication**: User registration and login protected via JSON Web Tokens (JWT).
- **Multi-tenant Architecture**: Each user's financial data is strictly separated and secure.
- **Smart Categorization (NLP)**: Type in what you bought (e.g., "Starbucks"), and a Python-powered Random Forest model will automatically categorize it as "FOOD & DRINKS".
- **AI Forecasting**: Uses Facebook Prophet to analyze your spending history and accurately estimate your total spend for the next 30 days.
- **Dynamic Visuals**: Beautiful transaction breakdown using Recharts pie charts.
- **Dark Mode**: Seamlessly integrated UI toggle between light and dark modes.

## 🛠️ Tech Stack
- **Frontend (Client)**: React.js, Vite, Recharts, Lucide-React
- **Backend (Server)**: Node.js, Express.js, MongoDB (Mongoose)
- **Machine Learning (ML Service)**: Python, Flask, Pandas, Scikit-Learn (RandomForest), Prophet

---

## 🚀 Getting Started

To run this project locally, you will need to run all three services (Client, Server, and ML Service) concurrently.

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- MongoDB (Running locally or a MongoDB Atlas URI)

### 1. Configure Environment Variables
Create a `.env` file in the **root directory** (for the Node server):
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Create a `.env` file in the **`client/`** directory (for the React frontend):
```env
VITE_API_URL=http://localhost:5000
VITE_ML_URL=http://127.0.0.1:8000
```

### 2. Start the Node.js Server
Open a new terminal:
```bash
cd server
npm install
node index.js
```
*The server will run on port 5000.*

### 3. Start the Machine Learning Service
Open a second terminal:
```bash
cd ml_service
pip install -r requirements.txt
python app.py
```
*The ML API will run on port 8000.*

### 4. Start the React Frontend
Open a third terminal:
```bash
cd client
npm install
npm run dev
```
*The frontend will run on port 5173 (usually).*

### 5. Access the App
Open your browser and navigate to `http://localhost:5173`. Create an account and start logging your transactions!
