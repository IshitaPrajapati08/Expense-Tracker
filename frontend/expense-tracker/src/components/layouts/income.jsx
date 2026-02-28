import React, { useState, useEffect } from "react";
import { FiX, FiCalendar } from "react-icons/fi";
import axios from "axios";

export const Income = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const LOCAL_KEY_CATS = "categories";
const [category, setCategory] = useState("All");
const [categories, setCategories] = useState([]);


  useEffect(() => {
  const stored = localStorage.getItem(LOCAL_KEY_CATS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // ✅ Only income-type categories
        const incomeCategories = parsed.filter((cat) => cat.type === "income");
        setCategories(incomeCategories);
      }
    } catch (e) {
      console.error("Error parsing stored categories:", e);
    }
  }
}, []);


  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category || !user?._id) return;

    try {
      await axios.post("http://localhost:5050/api/transactions/add", {
        type: "income",
        amount: parsedAmount,
        description: description.trim(),
        date,
        category,
        userId: user._id,
      });

      onClose();
      resetForm();
    } catch (err) {
      console.error("Error submitting income:", err);
    }
  };

  const resetForm = () => {
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

        <h2 className="text-lg font-semibold mb-6 text-center">Add Income</h2>

        <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
        <input
          type="number"
          placeholder="₹ 0.00"
          min="0"
          step="0.01"
          className="w-full border rounded px-3 py-2 mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <input
          type="text"
          placeholder="What's this income from?"
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
  className="border border-gray-300 rounded px-4 py-2"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">Select Income Category</option>
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
            className="px-4 py-2 bg-green-600 hover:bg-green-800 text-white rounded"
            onClick={handleSubmit}
          >
            Add Income
          </button>
        </div>
      </div>
    </div>
  );
};
