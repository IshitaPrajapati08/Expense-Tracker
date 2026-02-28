import React, { useEffect, useState, useMemo } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiLogOut,
  FiHome,
  FiList,
  FiTag,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AddTransactionModal } from "../../components/layouts/Addtransaction";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const id = params.get("id");

    let currentUser = null;

    if (name && email && id) {
      currentUser = { name, email, _id: id };
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      const stored = localStorage.getItem("user");
      if (stored) {
        currentUser = JSON.parse(stored);
      } else {
        navigate("/Login");
        return;
      }
    }

    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const fetchTransactions = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`http://localhost:5050/api/transactions?userId=${user._id}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTransactions();
  }, [user]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#DC143C"];

  const expenseChartData = useMemo(() => {
    const categoryTotals = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        const cat = t.category || "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(t.amount);
      }
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          $ ExpenseTracker
        </div>
        <div className="p-4 border-b border-blue-700">
          <div className="text-sm">{user?.name || "User"}</div>
          <div className="text-xs text-blue-200">{user?.email || "example@example.com"}</div>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavItem icon={<FiHome />} label="Dashboard" path="/Dashboard" active={location.pathname === "/Dashboard"} />
          <NavItem icon={<FiList />} label="Transaction" path="/Transaction" active={location.pathname === "/Transaction"} />
          <NavItem icon={<FiTag />} label="Categories" path="/categories" active={location.pathname === "/categories"} />
          <NavItem icon={<FiBarChart2 />} label="Reports" path="/reports" active={location.pathname === "/reports"} />
          <NavItem icon={<FiSettings />} label="Settings" path="/settings" active={location.pathname === "/Settings"}/>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button
            className="flex items-center gap-2 text-sm text-blue-200 hover:text-white"
            onClick={() => {
              localStorage.clear();
              navigate("/Login");
            }}
          >
            <FiLogOut /> 
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Transaction
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Total Income"
            value={`₹${totalIncome.toFixed(2)}`}
            icon={<FiTrendingUp />}
            iconColor="text-green-500"
          />
          <StatCard
            title="Total Expenses"
            value={`₹${totalExpenses.toFixed(2)}`}
            icon={<FiTrendingDown />}
            iconColor="text-red-500"
          />
          <StatCard
            title="Current Balance"
            value={`₹${balance.toFixed(2)}`}
            icon={<FiCreditCard />}
            iconColor="text-blue-500"
          />
        </div>

        {/* Charts + Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart Panel */}
          <Panel title="Expense Breakdown">
            {expenseChartData.length === 0 ? (
              <>
                <p className="text-gray-500">No expense data available</p>
                <p className="text-sm text-gray-400">
                  Add some expenses to see your spending breakdown
                </p>
              </>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {expenseChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Panel>

          {/* Recent Transactions Panel */}
          <Panel title="Recent Transactions">
            {transactions.length === 0 ? (
              <>
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400">
                  Add your first transaction using the button in the top right
                </p>
              </>
            ) : (
              <ul className="divide-y">
                {transactions.slice(0, 5).map((t) => (
  <li key={t._id} className="py-2 flex justify-between text-sm items-center">
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 capitalize">
        {t.category || "Uncategorized"}
      </span>
    </div>
    <span
      className={`${
        t.type === "income" ? "text-green-600" : "text-red-600"
      } font-medium`}
    >
      {t.type === "income" ? "+" : "-"} ₹{parseFloat(t.amount).toFixed(2)}
    </span>
  </li>
))}

              </ul>
            )}
          </Panel>
        </div>
      </main>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await fetch("http://localhost:5050/api/transactions/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            fetchTransactions();
            setIsModalOpen(false);
          } catch (e) {
            console.error("Failed to add transaction:", e);
          }
        }}
        user={user}
      />
    </div>
  );
};

// 🔹 NavItem
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

// 🔹 StatCard
const StatCard = ({ title, value, icon, iconColor }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-sm text-gray-500">{title}</h2>
        <p className="text-xl font-semibold text-blue-800">{value}</p>
      </div>
      <div className={`text-2xl ${iconColor}`}>{icon}</div>
    </div>
  </div>
);

// 🔹 Panel
const Panel = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <h3 className="text-lg font-medium text-blue-800 mb-2">{title}</h3>
    {children}
  </div>
);
