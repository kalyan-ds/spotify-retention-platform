import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
      title={`Current Theme: ${theme.toUpperCase()}. Click to switch.`}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : theme === 'light' ? (
        <Moon className="w-5 h-5 text-indigo-400" />
      ) : (
        <Laptop className="w-5 h-5 text-neutral-400" />
      )}
    </button>
  );
};
