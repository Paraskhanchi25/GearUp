/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light, Warm & Luxury Editorial Palette (Inspired by The Vineyard Hotel on Awwwards)
        cream: '#F7F5EF',         // Primary page background
        surface: '#FFFFFF',       // Pure white cards & elevated surfaces
        ivory: '#F1EEE5',         // Warm ivory sections & soft contrast
        sand: {
          light: '#F1EEE5',
          DEFAULT: '#E5D9C7',     // Sand accent & section tint
          muted: '#D8C8B2',
          border: '#E5E1D7',
        },
        sage: {
          light: '#A3B39F',
          DEFAULT: '#879783',     // Primary sage button & interactive accent
          dark: '#596B59',        // Hover & deep active states
          forest: '#354638',      // Deep forest text & dark accents
        },
        deepForest: '#354638',
        ink: {
          DEFAULT: '#242923',     // Primary high-contrast text
          muted: '#77796F',       // Secondary muted text
          light: '#9E9F97',
        },
        borderLight: '#E5E1D7',

        // Backward compatibility mappings
        forest: {
          50: '#F7F8F7',
          100: '#EFEFEA',
          200: '#E5E1D7',
          300: '#879783',
          400: '#596B59',
          500: '#879783',
          600: '#596B59',
          700: '#354638',
          800: '#242923',
          900: '#F1EEE5',
          950: '#F7F5EF',
        },
        charcoal: '#242923',
        gold: {
          light: '#879783',
          DEFAULT: '#596B59',
          dark: '#354638',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(36, 41, 35, 0.04)',
        'elevated': '0 10px 30px -5px rgba(36, 41, 35, 0.08)',
        'luxury': '0 20px 40px -10px rgba(36, 41, 35, 0.12)',
      }
    },
  },
  plugins: [],
}
