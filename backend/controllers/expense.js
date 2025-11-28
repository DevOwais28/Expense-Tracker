import { Expense } from "../models/expense";

const createExpense = async (req, res) => {
    try {
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

        if (!req.session._id) {
            return res.status(401).json({
                success: false,
                message: "login to continue"
            });
        }
        const newExpense = new Expense({
            userId: req.session._id,
            title,
            amount,
            category,
            paymentMethod,
            date
        })

        await newExpense.validate()
        await newExpense.save()

        return res.status(201).json({
            success: true,
            message: "new Expense Created Successfully",
            newExpense
        })
    } catch (err) {
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

        if (req.session.role !== "admin" && expense.userId.toString() !== req.session._id) {
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

        if (req.session.role !== "admin" && expense.userId.toString() !== req.session._id) {
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
        if (!req.session._id) {
            return res.status(401).json({
                success: false,
                message: "login to continue"
            });
        }
        const myExpense = await Expense.find({ userId: req.session._id })
        return res.status(200).json({
            success: true,
            message: "Expense fetched Successfully",
            myExpense
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

const getAllExpenses = async (req, res) => {
    try {
        if (req.session.role !== "admin") {
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