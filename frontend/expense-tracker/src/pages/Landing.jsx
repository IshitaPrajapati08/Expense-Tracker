import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white">

      {/* ================= NAVBAR ================= */}
      <div className="fixed top-0 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center font-bold">
              $
            </div>
            <h2 className="font-semibold text-lg">Expense Tracker</h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/Login")}
              className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/SignUp")}
              className="px-5 py-2 rounded-lg border border-white/20 hover:bg-white hover:text-black transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="flex items-center justify-center min-h-screen pt-24 px-6">

        {/* subtle gradient border */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-r from-blue-500/40 via-indigo-500/30 to-cyan-400/40">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl w-full rounded-3xl bg-[#111827]/80 backdrop-blur-xl border border-white/10 flex overflow-hidden"
          >

            {/* ================= LEFT SIDE ================= */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">

              <h1 className="text-5xl font-extrabold leading-tight mb-6 text-gray-100">
                Smart Way to <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Manage Money
                </span>
              </h1>

              <p className="text-gray-400 mb-10">
                Track expenses, analyze spending patterns and control your
                finances with beautiful analytics and real-time insights.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/Login")}
                className="w-48 py-3 rounded-xl font-semibold
                bg-gradient-to-r from-blue-500 to-cyan-400
                shadow-[0_0_25px_rgba(59,130,246,0.45)]"
              >
                Login
              </motion.button>

            </div>

            {/* ================= RIGHT DASHBOARD ================= */}
            <div className="hidden md:flex w-1/2 items-center justify-center p-10">

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-80 h-[480px] bg-[#F8FAFC]
                rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                p-6 text-gray-800"
              >
                <h3 className="font-bold text-blue-700 mb-6 text-lg">
                  Monthly Overview
                </h3>

                {/* chart bars */}
                <div className="space-y-4">
                  <div className="h-3 bg-blue-200 rounded"></div>
                  <div className="h-3 bg-blue-400 rounded w-3/4"></div>
                  <div className="h-3 bg-indigo-500 rounded w-1/2"></div>
                </div>

                {/* income expense cards */}
                <div className="mt-10 grid grid-cols-2 gap-4">

                  <div className="bg-blue-100 p-4 rounded-xl shadow hover:scale-105 transition">
                    <p className="text-sm text-blue-900 font-medium">
                      Income
                    </p>
                    <h4 className="font-extrabold text-blue-700 text-xl">
                      ₹12,450
                    </h4>
                  </div>

                  <div className="bg-red-100 p-4 rounded-xl shadow hover:scale-105 transition">
                    <p className="text-sm text-red-900 font-medium">
                      Expenses
                    </p>
                    <h4 className="font-extrabold text-red-600 text-xl">
                      ₹4,320
                    </h4>
                  </div>

                </div>
              </motion.div>

            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;