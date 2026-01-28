/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B74FF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      // IMPORTANT: Tailwind doesn't support adding fontWeight tokens like this.
      // Use classes: font-medium / font-semibold
    },
  },
  plugins: [],
};
