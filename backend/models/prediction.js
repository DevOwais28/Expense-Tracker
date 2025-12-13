const predictionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    inputData: Object,    // expenses summary sent to Flask
    prediction: Object,   // Flask AI's result (number or category-wise)
    
    predictedForMonth: String, // e.g. "2025-02"
    createdAt: { type: Date, default: Date.now }
});

export const Prediction = mongoose.model("Prediction", predictionSchema);