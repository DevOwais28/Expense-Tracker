import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, BarChart3, Calendar, TrendingUp, Brain } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiRequest } from "../../api.js";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useOutletContext() || {};
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [predictionLoading, setPredictionLoading] = useState(false);

  const categoryOptions = ["Food", "Transportation", "Bills", "Shopping", "Healthcare", "Entertainment", "Other"];

  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Other",
    amount: "",
    date: "",
  });

  // ---------------------------
  // Prevent background scroll when modal opens
  // ---------------------------
  useEffect(() => {
    document.body.style.overflow = showAddExpense ? "hidden" : "auto";
  }, [showAddExpense]);

  // Load expenses only (user data comes from DashboardLayout)
  useEffect(() => {
    async function fetchExpenses() {
      try {
        // Debug user data
        console.log('User data in dashboard:', user);
        console.log('User avatar:', user?.avatar);
        
        const res = await apiRequest("GET", "expenses/expense");
        const responseData = res.data;
        console.log('API Response:', responseData);
        
        // Handle the actual API response structure
        if (responseData && responseData.success && responseData.myExpense) {
          setExpenses(Array.isArray(responseData.myExpense) ? responseData.myExpense : []);
        } else if (Array.isArray(responseData)) {
          setExpenses(responseData);
        } else {
          console.warn("Unexpected API response structure:", responseData);
          setExpenses([]);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, [user]);

  // Generate predictions when expenses change
  useEffect(() => {
    if (expenses.length >= 3) {
      generatePredictions();
    }
  }, [expenses]);

  // Generate predictions using ML model
  const generatePredictions = async () => {
    setPredictionLoading(true);
    try {
      // Check if we have enough expenses for meaningful predictions
      if (expenses.length < 3) {
        console.log("Not enough expenses for predictions");
        setPredictionLoading(false);
        return;
      }

      // Prepare data for prediction
      const currentDate = new Date();
      const predictionData = expenses.map(expense => {
        const expenseDate = new Date(expense.date);
        return {
          title: expense.title,
          category: expense.category,
          paymentMethod: expense.paymentMethod || 'cash',
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate()
        };
      });

      console.log("Sending prediction data:", predictionData);

      // Call backend prediction API instead of direct FastAPI
      const response = await apiRequest("POST", "prediction/predict-expense", predictionData);
      console.log("Prediction API response:", response.data);
      
      if (response.data && response.data.predictions) {
        setPredictions(response.data.predictions);
        toast.success("AI predictions generated successfully!");
      } else {
        console.warn("No predictions in response:", response.data);
        setPredictions([]);
        toast.error("No predictions received from AI model");
      }
    } catch (error) {
      console.error("Error generating predictions:", error);
      // Set empty predictions to show "not available" state
      setPredictions([]);
      toast.error("Failed to generate AI predictions. Please try again.");
    } finally {
      setPredictionLoading(false);
    }
  };

  // Handle input updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    return (
      newExpense.title.trim() !== "" &&
      newExpense.category.trim() !== "" &&
      newExpense.amount.trim() !== "" &&
      newExpense.date.trim() !== ""
    );
  };

  const addExpense = async () => {
    if (!validateForm()) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await apiRequest("POST", "expenses/expense", newExpense);
      console.log('Add expense response:', response.data);
      
      // Handle the response structure correctly
      if (response.data && response.data.newExpense) {
        setExpenses((prev) => [...prev, response.data.newExpense]);
      } else {
        // Fallback for unexpected response
        setExpenses((prev) => [...prev, { ...newExpense, _id: Date.now().toString() }]);
      }
      
      toast.success("Expense added successfully!");
      setNewExpense({ title: "", category: "", amount: "", date: "" });
      setShowAddExpense(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];
  const randomColor = () =>
    COLORS[Math.floor(Math.random() * COLORS.length)];

  // Top Category
  const categoryTotals = expenses?.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {}) || {};
  console.log('Category totals:', categoryTotals);
  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
      : "No Category Yet";

  // Calculate total predicted amount
  const totalPredictedAmount = predictions.reduce((sum, pred) => sum + pred, 0);
  const averagePrediction = predictions.length > 0 ? totalPredictedAmount / predictions.length : 0;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 overflow-x-hidden">

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 px-4">
          <Loader2 className="animate-spin h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-center">Loading your expenses...</p>
        </div>
      ) : (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Transactions</h2>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {expenses?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">Total records</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Top Category</h2>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {topCategory}
              </p>
              <p className="text-sm text-gray-500 mt-2">Most spent</p>
            </motion.div>

            {/* AI Prediction Card */}
            <motion.div
              className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">AI Prediction</h2>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {predictionLoading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Brain className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                ${averagePrediction.toFixed(2)}
              </p>
              <p className="text-sm text-white/80 mt-2">Next expense prediction</p>
              {predictionLoading ? (
                <p className="text-xs text-white/60 mt-1">Calculating...</p>
              ) : predictions.length > 0 ? (
                <p className="text-xs text-white/60 mt-1">
                  Based on {predictions.length} predictions
                </p>
              ) : (
                <p className="text-xs text-white/60 mt-1">
                  Need 3+ expenses to activate
                </p>
              )}
            </motion.div>
          </div>

          {/* Add Expense Button */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Expenses</h2>
            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Expense
            </button>
          </div>

          {/* Expenses Table */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px] sm:min-w-[500px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 text-xs sm:text-sm">Title</th>
                      <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Category</th>
                      <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                      <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses?.map((exp, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-2 sm:p-3 font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[120px]">{exp.title}</td>
                        <td className="p-2 sm:p-3 hidden sm:table-cell">
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">
                          ${exp.amount}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-600 text-xs sm:text-sm hidden md:table-cell">{exp.date}</td>
                      </tr>
                    )) || []}
                  </tbody>
                </table>
                {expenses?.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No expenses yet. Add your first expense!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <PieChart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600" />
                </div>
                <span className="text-gray-900 text-xs sm:text-sm lg:text-base">Category Distribution</span>
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Object.entries(categoryTotals || {}).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    cornerRadius={8}
                    label={({ name, percent }) => {
                      return window.innerWidth >= 640 ? `${name} ${(percent * 100).toFixed(0)}%` : '';
                    }}
                    labelLine={false}
                  >
                    {Object.keys(categoryTotals || {}).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ color: '#111827' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600" />
                </div>
                <span className="text-gray-900 text-xs sm:text-sm lg:text-base">Expense Overview</span>
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={expenses?.map((exp) => ({
                    name: exp.title,
                    amount: Number(exp.amount),
                  })) || []}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ color: '#111827' }}
                  />
                  <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Predictions Panel */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-xl shadow-sm border border-purple-200">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <span className="text-gray-900 text-sm sm:text-base">AI Insights</span>
              </h2>
              
              {predictionLoading ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                  <p className="text-sm text-gray-600">Analyzing your spending patterns...</p>
                </div>
              ) : predictions.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Next Month Forecast</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      ${totalPredictedAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total predicted spending
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Average Expense</h3>
                    <p className="text-xl font-bold text-gray-900">
                      ${averagePrediction.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Per transaction prediction
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Confidence Level</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">85%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on your spending history
                    </p>
                  </div>

                  <button
                    onClick={generatePredictions}
                    className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Refresh Predictions
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Brain className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">AI Insights Available Soon</p>
                  <p className="text-xs text-gray-500">Add at least 3 expenses to unlock AI predictions</p>
                  <div className="mt-3 text-xs text-purple-600 font-medium">
                    {expenses.length === 0 ? "Add 3 more expenses" : 
                     expenses.length === 1 ? "Add 2 more expenses" : 
                     expenses.length === 2 ? "Add 1 more expense" : ""}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Dialog */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative z-[10000] bg-white text-gray-900 rounded-xl p-6 sm:p-8 w-full max-w-md border border-gray-200 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Add New Expense</h2>

            <input
              type="text"
              name="title"
              placeholder="Expense title"
              value={newExpense.title}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
            />

            <select
              name="category"
              value={newExpense.category}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl mb-4 text-gray-900 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
            >
              <option value="" className="bg-white">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat} className="bg-white">
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount ($)"
              value={newExpense.amount}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
            />

            <input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl mb-6 text-gray-900 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddExpense(false)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-gray-700 text-sm sm:text-base">
                Cancel
              </button>

              <button
                onClick={addExpense}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium text-sm sm:text-base">
                Add Expense
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
