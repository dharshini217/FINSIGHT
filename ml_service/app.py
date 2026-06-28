from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
from prophet import Prophet

app = Flask(__name__)
CORS(app)

# Load the Random Forest model we trained earlier
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '')
    text_vectorized = vectorizer.transform([text])
    category = model.predict(text_vectorized)[0]
    return jsonify({"category": category})

# 🔮 NEW: AI TIME-SERIES FORECASTING
@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.get_json() # Get all transactions from Node.js
        if len(data) < 2:
            return jsonify({"next_month_estimate": 0, "status": "Need more data"})

        df = pd.DataFrame(data)
        
        # Format data for Prophet (Needs 'ds' for date and 'y' for value)
        df = df[['date', 'amount']]
        df['date'] = pd.to_datetime(df['date']).dt.tz_localize(None)
        df = df.rename(columns={'date': 'ds', 'amount': 'y'})
        df['y'] = df['y'].abs() # Predict based on expense volume

        # Train Prophet AI
        m = Prophet(interval_width=0.95)
        m.fit(df)

        # Predict 30 days into the future
        future = m.make_future_dataframe(periods=30)
        forecast_result = m.predict(future)

        # Get the predicted total for the end of next month
        prediction = forecast_result['yhat'].iloc[-1]

        return jsonify({
            "next_month_estimate": round(float(prediction), 2),
            "status": "Success"
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"next_month_estimate": 0, "error": str(e)})

if __name__ == '__main__':
    app.run(port=8000, debug=True)