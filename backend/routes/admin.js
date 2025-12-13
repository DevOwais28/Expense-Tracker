import express from "express";
import { User } from "../models/user.js";
import { Expense } from "../models/expense.js";

const router = express.Router();

// Helper function to check admin access
const checkAdminAccess = async (req) => {
  let isAdmin = false;
  
  if (req.session.role === 'admin') {
    isAdmin = true;
  } else if (req.session.passport && req.session.passport.user) {
    const user = await User.findById(req.session.passport.user);
    isAdmin = user && user.role === 'admin';
  }
  
  return isAdmin;
};

// Helper function to get current user ID
const getCurrentUserId = (req) => {
  return req.session.userId || req.session.passport?.user;
};

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    // Check if user is admin
    const isAdmin = await checkAdminAccess(req);
    if (!isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", async (req, res) => {
  try {
    // Check if user is admin
    const isAdmin = await checkAdminAccess(req);
    if (!isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    
    // Don't allow admin to delete themselves
    const currentUserId = getCurrentUserId(req);
    if (currentUserId === id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's expenses first
    await Expense.deleteMany({ userId: id });
    
    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Update user role (admin only)
router.patch("/users/:id/role", async (req, res) => {
  try {
    // Check if user is admin
    if (!req.session || req.session.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Don't allow admin to change their own role
    if (req.session.userId === id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: "Error updating user role" });
  }
});

// Get system statistics (admin only)
router.get("/stats", async (req, res) => {
  try {
    // Check if user is admin
    if (!req.session || req.session.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = totalUsers - adminUsers;
    const totalExpenses = await Expense.countDocuments();
    const totalExpenseAmount = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        totalExpenses,
        totalExpenseAmount: totalExpenseAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

export default router;
