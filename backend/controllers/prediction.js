
import axios from "axios";

// --- Function to call FastAPI ---
export async function callFastAPI(expenseData) {
  try {
    // Handle array of expenses from frontend - send first one for prediction
    let dataToSend = expenseData;
    if (Array.isArray(expenseData) && expenseData.length > 0) {
      dataToSend = expenseData[0]; // Send first expense for single prediction
    }
    
    // Try local FastAPI first, then fallback to Railway
    let response;
    try {
      response = await axios.post("http://localhost:8000/predict", dataToSend);
    } catch (localError) {
      // If local fails, try Railway
      response = await axios.post("https://expense-tracker-production-40e9.up.railway.app/predict", dataToSend);
    }
    return response.data; // returns { predictions: [...] }
  } catch (error) {
    console.error("Error calling FastAPI:", error.message);
    // Simple fallback prediction based on category averages
    const categoryAverages = {
      food: 50,
      travel: 200,
      bills: 150,
      shopping: 100,
      health: 80,
      entertainment: 60,
      other: 75
    };
    
    let category = 'other';
    if (Array.isArray(expenseData) && expenseData.length > 0) {
      category = expenseData[0].category?.toLowerCase() || 'other';
    } else {
      category = expenseData.category?.toLowerCase() || 'other';
    }
    
    const fallbackPrediction = categoryAverages[category] || 75;
    
    return { 
      predictions: [fallbackPrediction],
      fallback: true,
      message: "Using fallback prediction - FastAPI unavailable"
    };
  }
}




