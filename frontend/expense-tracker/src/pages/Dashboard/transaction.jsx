import React, { useState, useEffect, useMemo } from "react";
import {
  FiLogOut,
  FiHome,
  FiList,
  FiTag,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { AddTransactionModal } from "../../components/layouts/Addtransaction";
import { Categories } from "./category";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
   const loggedInUser = JSON.parse(localStorage.getItem("user"));
const LOCAL_KEY_CATS = "categories";
  const [categories, setCategories] = useState([]);

  // 🔁 Fetch transactions from backend
  const fetchTransactions = async () => {
    if (!loggedInUser?._id) return;
    try {
      const res = await axios.get(`http://localhost:5050/api/transactions?userId=${loggedInUser._id}`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };
  const handleAddTransaction = async (transactionData) => {
  try {
    await axios.post("http://localhost:5050/api/transactions/add", transactionData);
    await fetchTransactions(); // Refresh after adding
    setIsModalOpen(false);
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
};


  // 🚀 Initial fetch
  useEffect(() => {
    fetchTransactions();
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

  // 🔍 Filtered data
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        type === "All" ? true : t.type?.toLowerCase() === type.toLowerCase();

      const matchesCategory =
        category === "All" ? true : t.category?.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, type, category]);

  const formatAmount = (t) =>
    `${t.type === "income" ? "+" : "-"} ₹${parseFloat(t.amount).toFixed(2)}`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          $ ExpenseTracker
        </div>
        <div className="p-4 border-b border-blue-700 ">
          <div className="text-sm">{loggedInUser?.name || "User"}</div>
          <div className="text-xs text-blue-200">{loggedInUser?.email || "example@example.com"}</div>
        </div>
        <nav className="flex-1 p-4 space-y-4 ">
          <NavItem icon={<FiHome />} label="Dashboard" path="/Dashboard" />
          <NavItem icon={<FiList />} label="Transaction" path="/Transaction" />
          <NavItem icon={<FiTag />} label="Categories" path="/categories" />
          <NavItem icon={<FiBarChart2 />} label="Reports" path="/reports" />
          <NavItem icon={<FiSettings />} label="Settings" path="/settings" />
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button className="flex items-center gap-2 text-sm text-blue-200 hover:text-white">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Filter</h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search description or category…"
              className="w-full sm:w-1/3 border border-gray-300 rounded px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded px-4 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select
  className="border border-gray-300 rounded px-4 py-2"
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

          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="font-medium">No transactions found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or add a new transaction
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t._id || t.id} className="border-b">
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{t.description || "—"}</td>
                      <td className="px-4 py-2 capitalize">{t.category}</td>
                      <td className={`px-4 py-2 font-medium ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {formatAmount(t)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction} 
        user={loggedInUser}      
        category={Categories}
      />
    </div>
  );
};

const NavItem = ({ icon, label, path }) => (
  <Link
    to={path}
    className="flex items-center gap-3 text-sm px-4 py-2 rounded-md transition-all duration-200 text-white hover:bg-blue-800 hover:no-underline no-underline"
    style={{ textDecoration: "none" }} // Fallback for edge cases
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

