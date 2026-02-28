import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="theme-toggle inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-300"
    >
      <span className={`icon ${theme === 'dark' ? 'dark' : 'light'}`} />
      <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;
