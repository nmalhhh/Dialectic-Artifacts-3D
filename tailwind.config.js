/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0f',
        surface: '#12121a',
        'surface-2': '#1a1a28',
        cyan: {
          DEFAULT: '#00f5ff',
          dark: '#00b8d9',
          glow: 'rgba(0,245,255,0.15)',
        },
        amber: {
          DEFAULT: '#ffb800',
          dark: '#ff8c00',
          glow: 'rgba(255,184,0,0.15)',
        },
        crimson: {
          DEFAULT: '#ff2d55',
          dark: '#cc2244',
          glow: 'rgba(255,45,85,0.15)',
        },
        violet: {
          DEFAULT: '#c084fc',
          dark: '#9333ea',
          glow: 'rgba(192,132,252,0.15)',
        },
      },
      fontFamily: {
        orbitron: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
        inter:    ['Inter', 'Be Vietnam Pro', 'sans-serif'],
        mono:     ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,245,255,0.3)',
        'glow-amber': '0 0 20px rgba(255,184,0,0.3)',
        'glow-crimson': '0 0 20px rgba(255,45,85,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
