/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#E8630A',
          hover: '#FF7A1A',
          muted: '#A34507',
        },
        surface: {
          DEFAULT: '#0F0F0F',
          100: '#1A1A1A',
          200: '#242424',
          300: '#2E2E2E',
          400: '#3A3A3A',
        },
        status: {
          ok: '#22C55E',
          warn: '#EAB308',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}