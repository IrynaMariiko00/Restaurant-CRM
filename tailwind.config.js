/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
        "violet-blue": "var(--color-violet-blue)",
        "violet-blue-light": "var(--color-violet-blue-light)",
        "violet-blue-dark": "var(--color-violet-blue-dark)",
      },
      keyframes: {
        scan: {
          "0%, 100%": { top: "0%" },
          "50%": { top: "100%" },
        },
      },
      animation: {
        scan: "scan 3s infinite linear",
      },
    },
  },
  plugins: [],
};
