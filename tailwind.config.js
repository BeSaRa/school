/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8e1837",
        secondary: "#c23b4e",
        tertiary: "#221f20",
        quaternary: "#57585b",
        quinary: "#d1d2d4",
        chat: {
          user: {
            bg: "#eef2ff",
            text: "#1e40af",
          },
          assistant: {
            bg: "#f8fafc",
            text: "#0f172a",
          },
          system: {
            bg: "rgb(254, 249, 195)",
            text: "rgb(133, 77, 14)",
          },
          tool: {
            bg: "rgb(243, 232, 255)",
            text: "rgb(107, 33, 168)",
          },
          developer: {
            bg: "rgb(252, 231, 243)",
            text: "rgb(157, 23, 77)",
          },
          button: {
            primary: {
              bg: "rgb(37, 99, 235)",
              hover: "rgb(29, 78, 216)",
              focus: "rgb(59, 130, 246)",
              text: "rgb(255, 255, 255)",
              disabled: "rgb(156, 163, 175)",
            },
            secondary: {
              bg: "rgb(75, 85, 99)",
              hover: "rgb(55, 65, 81)",
              focus: "rgb(107, 114, 128)",
              text: "rgb(255, 255, 255)",
            },
          },
        },
        accent: {
          yellow: "#FCD34D",
        },
        dark: {
          bg: "#1a1a1a",
          surface: "#2d2d2d",
          text: "#e5e5e5",
          muted: "#737373",
        },
      },
    },
  },
  plugins: [],
};
