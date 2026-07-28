'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="rounded-lg border border-white/20 px-3 py-2 text-sm text-will-light/70 transition hover:border-white/40 hover:text-will-light"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
