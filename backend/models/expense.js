import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ["Food", "Transportation", "Bills", "Shopping", "Healthcare", "Entertainment", "Other"],
        default: "Other"
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "bank", "jazzcash", "easypaisa"],
        default: "cash"
    },
    note: String,
    date: { type: Date, default: Date.now },   // chart ke liye perfect
    createdAt: { type: Date, default: Date.now }
});

export const Expense = mongoose.model("Expense", expenseSchema);