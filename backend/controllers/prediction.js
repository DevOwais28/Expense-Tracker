
import axios from "axios";

// --- Function to call FastAPI ---
export async function callFastAPI(expenseData) {
  try {
    const response = await axios.post("https://expense-tracker-production-40e9.up.railway.app/predict", expenseData);
    return response.data; // returns { predicted_amount: ... }
  } catch (error) {
    console.error("Error calling FastAPI:", error.message);
    if (error.response) {
      throw new Error(JSON.stringify(error.response.data));
    } else {
      throw new Error("Failed to call FastAPI");
    }
  }
}



