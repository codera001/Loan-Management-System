/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#071A4A",
          blue: "#2563EB",
          light: "#E8F0FF",
        },

        dashboard: {
          background: "#F7F8FA",
          white: "#FFFFFF",
          text: "#20242C",
          muted: "#737983",
          border: "#E8E9ED",
        },

        card: {
          blue: "#E8F0FF",
          green: "#E5FBE1",
          red: "#FDE3E5",
          yellow: "#FFFBE0",
        },

        status: {
          success: "#22C55E",
          danger: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
      },
    },
  },

  plugins: [],
};