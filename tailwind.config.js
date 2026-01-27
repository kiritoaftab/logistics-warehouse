// // tailwind.config.js
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#0B74FF",
//       },
//     },
//   },
//   plugins: [],
// };

export const theme = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontWeight: {
        medium: 500,
        semibold: 600,
      },
    },
  },
};
export const plugins = [];
