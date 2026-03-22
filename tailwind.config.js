/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#1a1a2e",
          200: "#16213e",
          300: "#0f3460",
        },
      },
    },
  },
  plugins: [],
}