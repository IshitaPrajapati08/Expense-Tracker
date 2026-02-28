import React, { useEffect, useMemo, useState } from "react";
import {
  FiLogOut,
  FiHome,
  FiList,
  FiTag,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AddTransactionModal } from "../../components/layouts/Addtransaction";

/* ---------- Helpers ---------- */
const fmt = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
const ym = (dateStr) => new Date(dateStr).toISOString().slice(0, 7);

/* ---------- Components ---------- */
const NavItem = ({ icon, label, path, active }) => (
  <Link
    to={path}
    className={`flex items-center gap-3 text-sm px-4 py-2 rounded-md transition-all duration-200 ${
      active ? "bg-blue-700 text-white" : "text-white hover:bg-blue-800"
    }`}
    style={{ textDecoration: "none" }}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const SummaryCard = ({ title, value }) => (
  <div className="bg-white border rounded-lg p-4 shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-lg font-bold text-blue-600">{value}</p>
  </div>
);

export const Reports = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [range, setRange] = useState("3"); // Default: 3 months
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/transactions?userId=${user._id}`);
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, [navigate, user]);

  // Filter by range (3, 6, or YTD)
  const filteredTx = useMemo(() => {
    if (range === "ytd") {
      const year = new Date().getFullYear();
      return transactions.filter((t) => new Date(t.date).getFullYear() === year);
    }

    const months = Number(range);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months + 1);
    cutoff.setDate(1);
    return transactions.filter((t) => new Date(t.date) >= cutoff);
  }, [transactions, range]);

  // Aggregate per month
  const chartData = useMemo(() => {
    const map = {};
    filteredTx.forEach((t) => {
      const key = ym(t.date);
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][t.type] += parseFloat(t.amount);
    });

    return Object.entries(map)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, val]) => ({
        month: new Date(key + "-01").toLocaleString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        income: val.income,
        expense: val.expense,
      }));
  }, [filteredTx]);

  const totals = useMemo(() => {
    let income = 0,
      expense = 0;
    filteredTx.forEach((t) =>
      t.type === "income" ? (income += parseFloat(t.amount)) : (expense += parseFloat(t.amount))
    );
    return { income, expense, net: income - expense };
  }, [filteredTx]);

  const handleTransactionSubmit = async (tx) => {
    try {
      await fetch("http://localhost:5050/api/transactions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tx, userId: user._id }),
      });
      const res = await fetch(`http://localhost:5050/api/transactions?userId=${user._id}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          $ ExpenseTracker
        </div>

        <div className="p-4 border-b border-blue-700">
          <div className="text-sm">{user.name || "User"}</div>
          <div className="text-xs text-blue-200">{user.email || "example@example.com"}</div>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <NavItem icon={<FiHome />} label="Dashboard" path="/dashboard" />
          <NavItem icon={<FiList />} label="Transaction" path="/transaction" />
          <NavItem icon={<FiTag />} label="Categories" path="/categories" />
          <NavItem icon={<FiBarChart2 />} label="Reports" path="/reports" active />
          <NavItem icon={<FiSettings />} label="Settings" path="/settings" />
        </nav>

        <div className="p-4 border-t border-blue-700">
          <button
            className="flex items-center gap-2 text-sm text-blue-200 hover:text-white"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Transaction
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Income vs Expenses</h2>
            <select
              className="border rounded px-3 py-1 text-sm"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="ytd">This year (YTD)</option>
            </select>
          </div>

          {chartData.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No data for this period</p>
          ) : (
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Total Income" value={fmt(totals.income)} />
          <SummaryCard title="Total Expenses" value={fmt(totals.expense)} />
          <SummaryCard title="Net Balance" value={fmt(totals.net)} />
        </div>
      </main>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTransactionSubmit}
        user={user}
      />
    </div>
  );
};

