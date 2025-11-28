import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
import datetime as datetime
import joblib

data = pd.read_csv("backend/prediction/expense_data_1.csv")

data = data[["Account","Category","Amount","Date","Income/Expense","Note","Account.1"]].copy()

data["title"] = data["Note"].fillna(data["Account"])

data["amount"] = pd.to_numeric(data["Amount"], errors="coerce").fillna(0)

allowed_categories = ["food", "travel", "bills", "shopping", "health", "entertainment", "other"]

data["category"] = data["Category"].str.lower().apply(lambda x: x if x in allowed_categories else "other")

payment_map = {
    "bank": "bank",
    "card": "card",
    "jazzcash": "jazzcash",
    "easypaisa": "easypaisa",
}
data["paymentMethod"] = data["Account.1"].astype(str).str.lower().map(payment_map).fillna("cash")
data["date"] = pd.to_datetime(data["Date"], errors="coerce").fillna(datetime.now())
data = data[["title", "amount", "category", "paymentMethod", "date"]].copy()

# 3️⃣ Fill missing values if any
data["title"] = data["title"].fillna("unknown")
data["category"] = data["category"].fillna("other")
data["paymentMethod"] = data["paymentMethod"].fillna("cash")
data["date"] = pd.to_datetime(data["date"])

# 4️⃣ Feature engineering
# Convert date to numerical features (year, month, day)
data["year"] = data["date"].dt.year
data["month"] = data["date"].dt.month
data["day"] = data["date"].dt.day

# Drop original date
data = data.drop("date", axis=1)

# 5️⃣ Define X and y
X = data.drop("amount", axis=1)
y = data["amount"]

# 6️⃣ Preprocessing for categorical features
categorical_features = ["title", "category", "paymentMethod"]
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)

# 7️⃣ Create pipeline with regressor
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

# 8️⃣ Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 9️⃣ Fit the model
model.fit(X_train, y_train)

# 1️⃣0️⃣ Predict and evaluate
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print("Mean Squared Error:", mse)
print("r^2",r2_score)

# 1️⃣1️⃣ Save the trained model
# joblib.dump(model, "expense_amount_model.pkl")
# print("Model saved as expense_amount_model.pkl")