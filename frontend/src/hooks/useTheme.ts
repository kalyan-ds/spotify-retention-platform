import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  return { theme, setTheme, toggleTheme };
}
