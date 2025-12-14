/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        mafia: {
          light: '#dc2626',
          DEFAULT: '#991b1b',
          dark: '#7f1d1d',
        },
        citizen: {
          light: '#3b82f6',
          DEFAULT: '#1e40af',
          dark: '#1e3a8a',
        },
        solo: {
          light: '#eab308',
          DEFAULT: '#a16207',
          dark: '#713f12',
        },
      },
    },
  },
  plugins: [],
}
