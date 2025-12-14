from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import os
import uvicorn

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:5173"), "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load trained model
model_path = os.path.join(os.path.dirname(__file__), "backend/prediction/expense_amount_model.pkl")
model = joblib.load(model_path)

# Input schema
class ExpenseInput(BaseModel):
    category: str
    paymentMethod: str
    year: int
    month: int
    day: int

@app.get("/")
def root():
    return {"message": "Expense Prediction API Running"}

@app.post("/predict")
def predict(expenses: List[ExpenseInput]):
    # Convert input to DataFrame
    df = pd.DataFrame([e.dict() for e in expenses])
    # Lowercase to match training
    df["category"] = df["category"].str.lower()
    df["paymentMethod"] = df["paymentMethod"].str.lower()
    # Predict
    predictions = model.predict(df)
    output = [float(p) for p in predictions]
    return {"predictions": output}

@app.options("/predict")
def options_predict():
    return {"message": "CORS preflight successful"}

# Railway or local run
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
