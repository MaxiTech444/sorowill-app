import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'will-purple': '#4F46E5',
        'will-dark': '#1E1B4B',
        'will-light': '#EEF2FF',
      },
      backgroundColor: {
        'light-bg-primary': '#f8fafc',
        'light-bg-secondary': '#f1f5f9',
      },
      textColor: {
        'light-text-primary': '#1e293b',
        'light-text-secondary': '#475569',
      },
      borderColor: {
        'light-border': 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [],
};

export default config;
