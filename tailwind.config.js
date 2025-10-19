/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        glass: "rgba(255, 255, 255, 0.15)",
        "glass-dark": "rgba(17, 25, 40, 0.75)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionProperty: {
        colors: "background-color, border-color, color, fill, stroke",
      },
    },
  },
  plugins: [],
};
