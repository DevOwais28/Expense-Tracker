
import axios from "axios";

// --- Function to call FastAPI ---
export async function callFastAPI(expenseData) {
  try {
    // Handle array of category predictions from frontend - send all for multiple predictions
    let dataToSend = expenseData;
    if (Array.isArray(expenseData) && expenseData.length > 0) {
      dataToSend = expenseData; // Send all category predictions
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
    // Generate fallback predictions for multiple categories
    const categoryAverages = {
      food: 150,
      travel: 300,
      bills: 500,
      shopping: 200,
      healthcare: 100,
      entertainment: 150,
      other: 100
    };
    
    const fallbackPredictions = [];
    
    if (Array.isArray(expenseData) && expenseData.length > 0) {
      // Generate prediction for each category in the input
      expenseData.forEach(item => {
        const category = item.category?.toLowerCase() || 'other';
        const prediction = categoryAverages[category] || 100;
        fallbackPredictions.push(prediction);
      });
    } else {
      // Single category fallback
      const category = expenseData.category?.toLowerCase() || 'other';
      fallbackPredictions.push(categoryAverages[category] || 100);
    }
    
    return { 
      predictions: fallbackPredictions,
      fallback: true,
      message: "Using fallback prediction - FastAPI unavailable"
    };
  }
}




