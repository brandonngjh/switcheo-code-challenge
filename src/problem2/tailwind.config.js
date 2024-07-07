/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#fffffe",
        text: "#2b2c34",
        button: "#6246ea",
        secondary: "#f0f0f0",
        select: "#d1d1e9",
        dark_bg: "#16161a",
        dark_text: "#fffffe",
        dark_button: "#7f5af0",
        dark_secondary: "#1f1f24",
        dark_select: "#3b3b58",
      },
    },
  },
  plugins: [],
};
