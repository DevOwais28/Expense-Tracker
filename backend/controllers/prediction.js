
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
      response = await axios.post("expense-tracker-production-c1dc.up.railway.app/predict", dataToSend);
    }
    return response.data; // returns { predictions: [...] }
  } catch (error) {
    console.error("Error calling FastAPI:", error.message);
    // Generate realistic fallback predictions based on actual spending patterns
    const fallbackPredictions = [];
    
    if (Array.isArray(expenseData) && expenseData.length > 0) {
      // Calculate realistic monthly predictions based on actual spending amounts
      const totalMonthlySpending = expenseData.reduce((sum, item) => {
        return sum + (item.currentAmount || 0);
      }, 0);
      
      // Generate predictions that are realistic (90-110% of current spending for next month)
      const variationFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
      const predictedTotal = totalMonthlySpending * variationFactor;
      
      // Distribute predicted total across categories based on their current proportions
      expenseData.forEach(item => {
        const currentAmount = item.currentAmount || 0;
        const proportion = totalMonthlySpending > 0 ? currentAmount / totalMonthlySpending : 1 / expenseData.length;
        // Add some variation per category (80-120% of their proportional share)
        const categoryVariation = 0.8 + (Math.random() * 0.4);
        const prediction = Math.round(predictedTotal * proportion * categoryVariation);
        fallbackPredictions.push(Math.max(prediction, 50)); // Minimum $50 per category
      });
    } else {
      // Single category fallback - estimate based on typical spending
      fallbackPredictions.push(500);
    }
    
    return { 
      predictions: fallbackPredictions,
      fallback: true,
      message: "Using realistic fallback prediction based on your spending patterns"
    };
  }
}






