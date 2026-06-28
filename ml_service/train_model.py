import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
import pickle

# 1. This is the data we are teaching the AI
data = {
    'text': [
        'Monthly Salary', 'Freelance Payment', 'Yearly Bonus', 
        'Starbucks Coffee', 'Pizza Hut Dinner', 'Burger King Meal', 
        'Uber ride to home', 'Gas station fuel', 'Bus ticket',
        'Netflix subscription', 'Spotify premium', 'Movie tickets',
        'Electricity bill', 'Water bill', 'Internet recharge'
    ],
    'category': [
        'INCOME', 'INCOME', 'INCOME',
        'FOOD & DRINKS', 'FOOD & DRINKS', 'FOOD & DRINKS',
        'TRANSPORT', 'TRANSPORT', 'TRANSPORT',
        'ENTERTAINMENT', 'ENTERTAINMENT', 'ENTERTAINMENT',
        'BILLS', 'BILLS', 'BILLS'
    ]
}

# 2. Convert it into a table
df = pd.DataFrame(data)

# 3. Convert words into math (Numbers)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df['text'])
y = df['category']

# 4. Create and Train the "Random Forest" Model
print("🔨 Training the Random Forest model...")
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

# 5. Save the "Brain" (model) and "Dictionary" (vectorizer) to files
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("✅ DONE! model.pkl and vectorizer.pkl have been created.")