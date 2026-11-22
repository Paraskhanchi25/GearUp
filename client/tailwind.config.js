/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AC Motorsport Inspired Minimal Automotive Luxury Palette
        warmIvory: '#F7F5EF',     // Primary architectural canvas
        pureWhite: '#FFFFFF',     // Clean elevated surfaces & cards
        softSand: '#E9E3D8',      // Hairline dividers & soft telemetry chips
        mutedSage: '#A4AD98',     // Muted technical accents & verification
        deepForest: '#35483C',    // High-impact racing green & dark elements
        charcoal: '#242622',      // Deep automotive typography & borders
        mutedGrey: '#85857E',     // Secondary specs & technical metadata

        // Compatible mappings
        cream: '#F7F5EF',
        surface: '#FFFFFF',
        ivory: '#F7F5EF',
        sand: {
          light: '#F7F5EF',
          DEFAULT: '#E9E3D8',
          muted: '#E9E3D8',
          border: '#E9E3D8',
        },
        sage: {
          light: '#BCC4B2',
          DEFAULT: '#A4AD98',
          dark: '#35483C',
          forest: '#35483C',
        },
        ink: {
          DEFAULT: '#242622',
          muted: '#85857E',
          light: '#A4AD98',
        },
        borderLight: '#E9E3D8',

        // Backward compatibility mappings
        forest: {
          50: '#F7F8F7',
          100: '#E9E3D8',
          200: '#E9E3D8',
          300: '#A4AD98',
          400: '#35483C',
          500: '#35483C',
          600: '#242622',
          700: '#35483C',
          800: '#242622',
          900: '#E9E3D8',
          950: '#F7F5EF',
        },
        gold: {
          light: '#A4AD98',
          DEFAULT: '#35483C',
          dark: '#242622',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['Syne', '"Space Grotesk"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        editorial: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
