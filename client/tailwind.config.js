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
        forest: {
          950: '#0B221C',
          900: '#123C32', // Deep Forest Green
          800: '#155244',
          700: '#176B50', // Primary Green
          600: '#1E8263',
          500: '#2A9D79',
          400: '#52BE9B',
          300: '#8CD8BF',
          200: '#B8EADB',
          100: '#DDF3E8', // Fresh Mint
          50: '#F0F9F5',
        },
        charcoal: {
          950: '#111513',
          900: '#1A211D',
          800: '#202824', // Charcoal
          700: '#323E38',
          600: '#4D5D55',
          500: '#78837D', // Muted Grey
          400: '#9DA8A2',
          300: '#C2CCC7',
          200: '#E1E6E3',
          100: '#F0F3F1',
        },
        gold: {
          DEFAULT: '#D6AD62',
          light: '#E7C88C',
          dark: '#B0883E',
        },
        ivory: '#F8F7F2',
        borderLight: '#E8ECE8',
        borderDark: '#2C3831',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(18, 60, 50, 0.06)',
        'elevated': '0 10px 30px -4px rgba(18, 60, 50, 0.12)',
        'glow': '0 0 25px -5px rgba(42, 157, 121, 0.35)',
      }
    },
  },
  plugins: [],
}
