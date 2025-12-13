import { Expense } from "../models/expense.js";

const createExpense = async (req, res) => {
    try {
        console.log('Creating expense with data:', req.body);
        console.log('User ID:', req.session.userId || (req.user && req.user._id));
        
        const { title, amount, category, paymentMethod, date } = req.body
        
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Provide title of expense"
            });
        }

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Provide amount of expense"
            });
        }

        // Check for both session-based and passport-based authentication
        const userId = req.session.userId || (req.user && req.user._id);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "login to continue"
            });
        }
        
        const newExpense = new Expense({
            userId: userId,
            title,
            amount,
            category,
            paymentMethod: paymentMethod || 'cash',
            date
        });

        console.log('Saving expense:', newExpense);
        await newExpense.validate();
        await newExpense.save();
        console.log('Expense saved successfully');

        return res.status(201).json({
            success: true,
            message: "new Expense Created Successfully",
            newExpense
        })
    } catch (err) {
        console.error('Error creating expense:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }

}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params
        const expense = await Expense.findById(id)

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            })
        }

        const userId = req.session.userId || (req.user && req.user._id);
        const userRole = req.session.role || (req.user && req.user.role);
        
        if (userRole !== "admin" && expense.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }


        await Expense.deleteOne({ _id: id })
        return res.status(200).json({
            success: true,
            message: "Expense Deleted Successfully",
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

const editExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, paymentMethod, date } = req.body;


        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const userId = req.session.userId || (req.user && req.user._id);
        const userRole = req.session.role || (req.user && req.user.role);
        
        if (userRole !== "admin" && expense.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        expense.title = title || expense.title;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.paymentMethod = paymentMethod || expense.paymentMethod;
        expense.date = date || expense.date

        await expense.save();

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

const getExpense = async (req, res) => {
    try {
        const userId = req.session.userId || (req.user && req.user._id);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "login to continue"
            });
        }
        const myExpense = await Expense.find({ userId: userId })
        return res.status(200).json({
            success: true,
            message: "Expense fetched Successfully",
            myExpense
        })
    } catch (err) {
        console.error('Error in getExpense:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const userRole = req.session.role || (req.user && req.user.role);
        
        if (userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const allExpenses = await Expense.find().populate("userId", "name email"); // optional: populate user info
        return res.status(200).json({
            success: true,
            message: "All expenses fetched successfully",
            expenses: allExpenses
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

export { createExpense , editExpense , deleteExpense , getAllExpenses , getExpense }