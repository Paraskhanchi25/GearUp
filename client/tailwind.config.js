/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional, executive corporate palette
        brand: {
          950: '#0B132B',
          900: '#0F172A', // Deep Executive Slate
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#2563EB', // Muted Executive Blue Accent
          400: '#3B82F6',
          300: '#93C5FD',
          200: '#BFDBFE',
          100: '#EFF6FF',
          50: '#F8FAFC',
        },
        forest: {
          950: '#0F172A',
          900: '#1E293B',
          800: '#334155',
          700: '#1E3A8A',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          200: '#BFDBFE',
          100: '#EFF6FF',
          50: '#F8FAFC',
        },
        charcoal: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
        },
        gold: {
          DEFAULT: '#B45309', // Muted professional amber
          light: '#FDE68A',
          dark: '#92400E',
        },
        ivory: '#FFFFFF',
        borderLight: '#E2E8F0',
        borderDark: '#CBD5E1',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'elevated': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'glow': '0 0 20px -3px rgba(37, 99, 235, 0.15)',
      }
    },
  },
  plugins: [],
}
