import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-105 transition-all duration-300"
    >
      {isDarkMode ? (
        <>
          <Sun className="w-4 h-4 text-yellow-400" /> Light
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-400" /> Dark
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
