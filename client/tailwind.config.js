/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1a1a1a',
          light: '#2a2a2a',
          lighter: '#3a3a3a',
        },
        ivory: {
          DEFAULT: '#faf9f6',
          dark: '#f0efe9',
        },
        'warm-white': '#fefdfb',
        muted: {
          DEFAULT: '#6b6b6b',
          light: '#999999',
        },
        accent: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        border: {
          DEFAULT: '#e5e2db',
          dark: '#333333',
        },
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        book: '0 25px 60px rgba(0, 0, 0, 0.4), 0 10px 25px rgba(0, 0, 0, 0.2)',
        page: 'inset 0 0 30px rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        elevated: '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
