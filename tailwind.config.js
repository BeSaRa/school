/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#cbd5e1",
        tertiary: "#1e293b",
        chat: {
          user: {
            bg: "#1e40af",
            text: "#e0f2fe",
          },
          assistant: {
            bg: "#1e293b",
            text: "#f1f5f9",
          },
          system: {
            bg: "#fef08a",
            text: "#78350f",
          },
          tool: {
            bg: "#e9d5ff",
            text: "#6b21a8",
          },
          developer: {
            bg: "#ffe4e6",
            text: "#9d174d",
          },
          button: {
            primary: {
              bg: "#0ea5e9",
              hover: "#0284c7",
              focus: "#38bdf8",
              text: "#ffffff",
              disabled: "#64748b",
            },
            secondary: {
              bg: "#334155",
              hover: "#1e293b",
              focus: "#475569",
              text: "#f8fafc",
            },
          },
        },
        accent: {
          yellow: "#facc15",
        },
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      flexDirection: ["dir"],
    },
  },
};
