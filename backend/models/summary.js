const summarySchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,

    month: String,   // "2025-01"
    totalExpense: Number,
    categoryTotals: Object, // { food: 3000, travel: 1200, bills: 5000 }
    highestCategory: String,
    
    createdAt: { type: Date, default: Date.now }
});

export const Summary = mongoose.model("Summary", summarySchema);