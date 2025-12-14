import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from datetime import datetime
import joblib
import os

# Load data
data = pd.read_csv("backend/prediction/expense_data_1.csv")

# Select relevant columns
data = data[["Category","Amount","Date","Account.1"]].copy()

# Convert amount to numeric
data["amount"] = pd.to_numeric(data["Amount"], errors="coerce").fillna(0)

# Category mapping
allowed_categories = ["food", "travel", "bills", "shopping", "health", "entertainment", "other"]
data["category"] = data["Category"].str.lower().apply(lambda x: x if x in allowed_categories else "other")

# Payment method mapping
payment_map = {
    "bank": "bank",
    "card": "card",
    "jazzcash": "jazzcash",
    "easypaisa": "easypaisa",
}
data["paymentMethod"] = data["Account.1"].astype(str).str.lower().map(payment_map).fillna("cash")

# Convert date to numerical features
data["date"] = pd.to_datetime(data["Date"], errors="coerce").fillna(datetime.now())
data["year"] = data["date"].dt.year
data["month"] = data["date"].dt.month
data["day"] = data["date"].dt.day
data = data[["category", "paymentMethod", "year", "month", "day", "amount"]]

# Define X and y
X = data.drop("amount", axis=1)
y = data["amount"]

# Preprocessing for categorical features
categorical_features = ["category", "paymentMethod"]
preprocessor = ColumnTransformer(
    transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)]
)

# Pipeline with RandomForest
model = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit model
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Mean Squared Error:", mean_squared_error(y_test, y_pred))
print("R^2:", r2_score(y_test, y_pred))

# Save model
os.makedirs("backend/prediction", exist_ok=True)
joblib.dump(model, "backend/prediction/expense_amount_model.pkl")
print("Model saved as expense_amount_model.pkl")
