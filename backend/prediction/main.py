from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load model
model_path = os.path.join(os.path.dirname(__file__), "expense_amount_model.pkl")
model = joblib.load(model_path)

class ExpenseInput(BaseModel):
    title: str
    category: str
    paymentMethod: str
    year: int
    month: int
    day: int


@app.get("/")
def root():
    return {"message": "Expense Prediction API Running"}


# --------------------------
# 🔥 Best Version — Handles Single and Multiple Together
# --------------------------
@app.post("/predict")
def predict(expenses: List[ExpenseInput]):

    # Convert list of Pydantic objects → DataFrame
    df = pd.DataFrame([e.dict() for e in expenses])

    # Predict using your ML model
    predictions = model.predict(df)

    # Convert to float because NumPy types cause issues in JSON
    output = [float(p) for p in predictions]

    return {"predictions": output}

@app.options("/predict")
def options_predict():
    return {"message": "CORS preflight successful"}
