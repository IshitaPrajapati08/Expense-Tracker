import React, { useState } from "react";
import {
	FiHome,
	FiList,
	FiTag,
	FiBarChart2,
	FiSettings,
	FiLogOut,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";

const Settings = () => {
	const { theme, setTheme } = useTheme();
	const [local, setLocal] = useState(theme);
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex">
			<aside className="w-64 bg-blue-900 text-white flex flex-col">
				<div className="p-6 text-2xl font-bold border-b border-blue-700">$ ExpenseTracker</div>
				<div className="p-4 border-b border-blue-700">
					<div className="text-sm">User</div>
					<div className="text-xs text-blue-200">user@example.com</div>
				</div>
				<nav className="flex-1 p-4 space-y-4">
					<NavItem icon={<FiHome />} label="Dashboard" path="/Dashboard" active={location.pathname === "/Dashboard"} />
					<NavItem icon={<FiList />} label="Transaction" path="/Transaction" active={location.pathname === "/Transaction"} />
					<NavItem icon={<FiTag />} label="Categories" path="/categories" active={location.pathname === "/categories"} />
					<NavItem icon={<FiBarChart2 />} label="Reports" path="/reports" active={location.pathname === "/reports"} />
					<NavItem icon={<FiSettings />} label="Settings" path="/settings" active={location.pathname === "/settings"} />
				</nav>
				<div className="p-4 border-t border-blue-700">
					<button
						className="flex items-center gap-2 text-sm text-blue-200 hover:text-white"
						onClick={() => {
							localStorage.clear();
							navigate('/Login');
						}}
					>
						<FiLogOut /> Logout
					</button>
				</div>
			</aside>

			<main className="flex-1 p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-blue-800">Settings</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<h3 className="text-lg font-medium mb-2">Appearance</h3>
						<p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Choose light or dark theme for the app.</p>
						<div className="flex items-center gap-3">
							<ModeButton active={local === 'light'} onClick={() => setLocal('light')}>Light</ModeButton>
							<ModeButton active={local === 'dark'} onClick={() => setLocal('dark')}>Dark</ModeButton>
						</div>
						<div className="mt-4">
							<button
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
								onClick={() => {
									setTheme(local);
									toast.success('Theme saved');
								}}
							>
								Save
							</button>
						</div>
					</Card>

					<Card>
						<h3 className="text-lg font-medium mb-2">Account</h3>
						<p className="text-sm text-gray-500 dark:text-gray-300">Manage account preferences and connected services.</p>
					</Card>
				</div>
				<Toaster />
			</main>
		</div>
	);
};

const Card = ({ children }) => (
	<div className="bg-white rounded-lg shadow p-6 dark:bg-neutral-900 transition-all">{children}</div>
);

const ModeButton = ({ children, active, onClick }) => (
	<button
		onClick={onClick}
		className={`px-3 py-2 rounded-md transition-all duration-200 border ${
			active ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-700 dark:text-gray-200 border-gray-200/20'
		}`}
	>
		{children}
	</button>
);

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

export default Settings;
