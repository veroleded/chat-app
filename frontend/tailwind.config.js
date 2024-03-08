/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2400px'
      }
    },
  },
  plugins: [],
}