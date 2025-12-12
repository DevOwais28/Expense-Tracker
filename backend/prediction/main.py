from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import os
import uvicorn  # <-- add this

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:5173"), "http://localhost:3000"],
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


@app.post("/predict")
def predict(expenses: List[ExpenseInput]):
    df = pd.DataFrame([e.dict() for e in expenses])
    predictions = model.predict(df)
    output = [float(p) for p in predictions]
    return {"predictions": output}


@app.options("/predict")
def options_predict():
    return {"message": "CORS preflight successful"}


# ---------------------------
# Railway-compatible entry
# ---------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Railway sets this
    uvicorn.run("main:app", host="0.0.0.0", port=port)
