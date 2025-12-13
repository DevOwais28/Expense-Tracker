import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { apiRequest } from "../../api.js";
import { Loader2 } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await apiRequest("GET", "expenses/expense");
      const responseData = res.data;
      
      if (responseData && responseData.success && responseData.myExpense) {
        setTransactions(Array.isArray(responseData.myExpense) ? responseData.myExpense : []);
      } else if (Array.isArray(responseData)) {
        setTransactions(responseData);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "all" || transaction.category === filterCategory)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "amount") return Number(b.amount) - Number(a.amount);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const categories = [...new Set(transactions.map(t => t.category))];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="animate-spin h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Recent Transactions</h1>
        <p className="text-gray-600 text-sm sm:text-base">View and manage all your expense transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Amount</h3>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">{filteredTransactions.length} transactions</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
          <p className="text-sm text-gray-500 mt-2">Different categories</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Average</h3>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${filteredTransactions.length > 0 ? (totalAmount / filteredTransactions.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Per transaction</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-gray-500 focus:bg-white transition-all"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="title">Sort by Title</option>
          </select>

          <button
            onClick={fetchTransactions}
            className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Date</th>
                <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Title</th>
                <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Category</th>
                <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 sm:p-4 text-gray-600 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="p-3 sm:p-4 font-medium text-gray-900 text-sm">{transaction.title}</td>
                  <td className="p-3 sm:p-4">
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 font-semibold text-gray-900 text-sm">${transaction.amount}</td>
                  <td className="p-3 sm:p-4 text-gray-600 text-sm">{transaction.paymentMethod || 'cash'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
