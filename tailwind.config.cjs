/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9', // sky-500
        secondary: '#0369A1', // sky-700
      },
    },
  },
  plugins: [],
}

