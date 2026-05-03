/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald
          light: '#34D399',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Amber/Gold
          light: '#FBBF24',
          dark: '#D97706',
        },
        accent: '#3B82F6',       // Blue
        success: '#10B981',      // Emerald Green
        danger: '#EF4444',       // Rose Red
        warning: '#F59E0B',      // Amber
        dark: '#0F172A',         // Slate 900
        surface: '#1E293B',      // Slate 800
        'surface-light': '#334155', // Slate 700
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        glow: 'glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 5px #F59E0B, 0 0 10px #F59E0B' },
          '50%': { boxShadow: '0 0 20px #F59E0B, 0 0 30px #F59E0B' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #10B981, 0 0 10px #10B981' },
          '50%': { boxShadow: '0 0 20px #10B981, 0 0 30px #10B981' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
