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
        // --- NEW GLOBAL AUTOMOTIVE PALETTE ---
        deepBlack: '#10120F',
        charcoal: {
          DEFAULT: '#191C18',
          950: '#10120F',
          900: '#141713',
          800: '#191C18',
          700: '#232722',
          600: '#2E332D',
          500: '#3D443C',
          400: '#525B50',
          300: '#6C776A',
          200: '#8E998B',
          100: '#B6BEB4',
        },
        darkSage: '#39483D',
        sage: {
          DEFAULT: '#879783',
          dark: '#39483D',
          muted: '#A5B29B',
          light: '#C5CFC2',
          950: '#121613',
          900: '#1B221D',
          800: '#263029',
          700: '#39483D', // Dark Sage
          600: '#57685B',
          500: '#879783', // Sage Green
          400: '#A5B29B', // Muted Sage
          300: '#C5CFC2',
          200: '#DEE4DC',
          100: '#EFF2EE',
          50: '#F7F9F7',
        },
        sand: {
          DEFAULT: '#D8CBB5',
          warm: '#D8CBB5',
          light: '#E9E0D1',
          offWhite: '#F3F0E8',
          950: '#1C1812',
          900: '#2D271E',
          800: '#463D30',
          700: '#685C49',
          600: '#8F7F67',
          500: '#B2A187',
          400: '#C4B49C',
          300: '#D8CBB5', // Warm Sand
          200: '#E9E0D1', // Light Sand
          100: '#F3F0E8', // Off White
          50: '#FAF8F5',
        },
        // Backward-compatible mappings
        forest: {
          950: '#10120F',
          900: '#191C18',
          800: '#263029',
          700: '#39483D',
          600: '#57685B',
          500: '#879783',
          400: '#A5B29B',
          300: '#C5CFC2',
          200: '#E9E0D1',
          100: '#F3F0E8',
          50: '#FAF8F5',
        },
        gold: {
          DEFAULT: '#D8CBB5',
          light: '#E9E0D1',
          dark: '#B2A187',
        },
        ivory: '#F3F0E8',
        borderLight: '#D8CBB5',
        borderDark: '#263029',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(16, 18, 15, 0.4)',
        'elevated': '0 12px 36px -4px rgba(16, 18, 15, 0.6)',
        'glow': '0 0 30px -5px rgba(135, 151, 131, 0.25)',
        'glow-sand': '0 0 30px -5px rgba(216, 203, 181, 0.22)',
      }
    },
  },
  plugins: [],
}
