import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AddTransactionModal } from "../../components/layouts/Addtransaction";
import {
  FiHome,
  FiList,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
   FiTrash2 

} from "react-icons/fi";

/* ─────────────────────────────────────────── */

const LOCAL_KEY_TX   = "transactions";
const LOCAL_KEY_CATS = "categories";

/* Quick currency formatter */
const fmt = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

/* ─────────────────────────────────────────── */

export const Categories = () => {
  /* ---------- state ---------- */
  const [categoryName,  setCategoryName]  = useState("");
  const [categoryColor, setCategoryColor] = useState("#6366f1");
  const [categories,    setCategories]    = useState([]);
  const [transactions,  setTransactions]  = useState([]);
  const [isModalOpen,   setIsModalOpen]   = useState(false);

  const rawUser = JSON.parse(localStorage.getItem("user")) || {};
const user = {
  _id: rawUser._id || rawUser.id || "demo-id", // fallback for old login structure
  name: rawUser.name || "Demo User",
  email: rawUser.email || "demo@example.com",
};


  /* ---------- load once from localStorage ---------- */
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:5050/api/categories?userId=${user._id}`);
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
        localStorage.setItem(LOCAL_KEY_CATS, JSON.stringify(data.categories || []));
      } else {
        console.error("Failed to fetch categories:", data.error);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const savedTransactions = JSON.parse(localStorage.getItem(LOCAL_KEY_TX) || "[]");
  setTransactions(savedTransactions);
  
  fetchCategories();
}, []);
const handleDeleteCategory = async (id) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    const res = await fetch(`http://localhost:5050/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete category");
      return;
    }

    // Remove from local state
    setCategories((prev) => prev.filter((cat) => cat._id !== id));
  } catch (err) {
    console.error("Error deleting category:", err);
    alert("Something went wrong while deleting the category.");
  }
};

  /* ---------- persist when cats / tx change ---------- */
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_CATS, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  /* ---------- derived stats per category ---------- */
  const stats = useMemo(() => {
    const map = {}; // { catName: { count: n, total: sum } }
    transactions.forEach((t) => {
      const key = t.category?.toLowerCase?.() || "uncategorised";
      if (!map[key]) map[key] = { count: 0, total: 0 };
      map[key].count += 1;
      // treat expenses as +ve, income as -ve so “Total Spent” shows real outflow
      map[key].total += t.type === "income" ? -t.amount : t.amount;
    });
    return map;
  }, [transactions]);

  /* ---------- handlers ---------- */
const handleAddCategory = async () => {
  if (!categoryName.trim()) return;
   console.log("Sending category:", {
  name: categoryName,
  color: categoryColor,
  userId: user._id,
});

  try {
    const res = await fetch('http://localhost:5050/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryName,
        color: categoryColor,
        userId: user._id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add category.");
      return;
    }

    setCategories((prev) => [...prev, data.category]); // append new category from DB
    setCategoryName("");
    setCategoryColor("#6366f1");
  } catch (error) {
    console.error("Error adding category:", error);
    alert("Something went wrong while adding the category.");
  }
};

  const handleTransactionSubmit = (tx) => {
    const withId = { id: Date.now(), ...tx };
    const nextTx = [...transactions, withId];
    setTransactions(nextTx);

    /* auto-add the category if user used a new one */
    const catExists = categories.some(
      (c) => c.name.toLowerCase() === tx.category.toLowerCase()
    );
    if (!catExists && tx.category) {
      setCategories((prev) => [
        ...prev,
        { name: tx.category, color: "#6366f1" },
      ]);
    }
  };

  /* ---------- renderer helpers ---------- */
  const catStat = (cat) =>
    stats[cat.name.toLowerCase()] || { count: 0, total: 0 };

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
           ExpenseTracker
        </div>
        <div className="p-4 border-b border-blue-700">
          <div className="text-sm">{user.name}</div>
          <div className="text-xs text-blue-200">{user.email}</div>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavItem icon={<FiHome />} label="Dashboard"  path="/dashboard"   />
          <NavItem icon={<FiList />} label="Transaction" path="/transaction" />
          <NavItem icon={<FiTag />}  label="Categories"  path="/categories" active />
          <NavItem icon={<FiBarChart2 />} label="Reports" path="/reports"   />
          <NavItem icon={<FiSettings />} label="Settings" path="/settings"  />
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button className="flex items-center gap-2 text-sm text-blue-200 hover:text-white">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Categories</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Transaction
          </button>
        </div>

        {/* Add Category Form */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <input
              type="color"
              value={categoryColor}
              onChange={(e) => setCategoryColor(e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Category Cards */}
        {categories.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-400">
            <p className="font-medium">No categories found</p>
            <p className="text-sm">Add a new category using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => {
              const { count, total } = catStat(cat);
              return (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow border flex flex-col gap-2"
                >
                  {/* coloured avatar */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {count} transaction{count !== 1 && "s"}
                      </p>
                    </div>
                  </div>

                  {/* totals */}
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="text-sm text-gray-400">Total Spent</p>
                      <p className="font-bold text-md text-gray-800">
                        {fmt(total)}
                      </p>
                    </div>
                    {/* edit / delete icons unchanged */}
                    <div className="flex gap-3 w-15 h-8 text-gray-500 cursor-pointer">
                      <FiTrash2
                      title="Delete Category"
                      onClick={() => handleDeleteCategory(cat._id)}
                           className="hover:text-red-600 transition"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Transaction modal (shares storage with the rest of the app) */}
      <AddTransactionModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleTransactionSubmit}
  user={user}
  categories={categories} // ✅ Pass categories here
/>

    </div>
  );
};

/* Sidebar link */
const NavItem = ({ icon, label, path, active }) => (
  <Link
    to={path}
    className={`flex items-center gap-3 text-sm px-4 py-2 rounded-md transition-all duration-200 ${
      active ? "bg-blue-700 text-white" : "text-white hover:bg-blue-800"
    } no-underline`}
    style={{ textDecoration: "none" }}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);
