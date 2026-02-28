import React, { useState, useEffect } from "react";
import { FiX, FiCalendar } from "react-icons/fi";
import axios from "axios";

export const AddTransactionModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const LOCAL_KEY_CATS = "categories";

  // ✅ Fetch categories from localStorage and filter by type
   useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY_CATS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      } catch (e) {
        console.error("Error parsing stored categories:", e);
      }
    }
    }, []);

  const handleSubmit = async () => {
    if (!user || !user._id) {
      alert("User not logged in");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category) return;

    try {
      await axios.post("http://localhost:5050/api/transactions/add", {
        type,
        amount: parsedAmount,
        description: description.trim(),
        date,
        category,
        userId: user._id,
      });

      onSubmit?.();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error submitting transaction:", err.response?.data || err.message);
      alert("Failed to add transaction: " + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setType("expense");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative p-6">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <FiX size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-6 text-center">Add New Transaction</h2>

        <div className="flex mb-6 border rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-medium ${type === "expense" ? "bg-red-100 text-red-600" : "bg-white text-gray-600"}`}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium border-l ${type === "income" ? "bg-green-100 text-green-600" : "bg-white text-gray-600"}`}
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>

        <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
        <input
          type="number"
          placeholder="₹ 0.00"
          className="w-full border rounded px-3 py-2 mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <input
          type="text"
          placeholder="What was this transaction for?"
          className="w-full border rounded px-3 py-2 mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
        <div className="relative mb-4">
          <input
            type="date"
            className="w-full border rounded px-3 py-2 pr-10"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <FiCalendar className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
        <select
          className="w-full border rounded px-3 py-2 mb-6"
          value={category}
         onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
  {categories.map((cat) => (
    <option key={cat.name} value={cat.name}>
      {cat.name}
    </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded"
            onClick={handleSubmit}
          >
            Add {type === "income" ? "Income" : "Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};
