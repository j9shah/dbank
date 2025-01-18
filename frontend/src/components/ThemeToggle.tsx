import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center px-1 transition-all duration-300 z-50 hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white dark:bg-black shadow-md transform ${
          theme === 'dark' ? 'translate-x-6' : ''
        } transition-transform duration-300`}
      />
      <span className="absolute left-1 top-1 w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300">
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;