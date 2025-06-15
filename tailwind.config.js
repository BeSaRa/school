/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        secondary: "#D3D3D3",
        tertiary: "#2D2D2D",
        quaternary: "#757575",
        quinary: "#B0B0B0",
        chat: {
          user: {
            bg: "#E0E7FF",
            text: "#1E3A8A",
          },
          assistant: {
            bg: "#E5E7EB",
            text: "#1F2937",
          },
          system: {
            bg: "#FEF3C7",
            text: "#92400E",
          },
          tool: {
            bg: "#F5E6FF",
            text: "#6B21A8",
          },
          developer: {
            bg: "#FEE2E9",
            text: "#9D174D",
          },
          button: {
            primary: {
              bg: "#3B82F6",
              hover: "#2563EB",
              focus: "#60A5FA",
              text: "#FFFFFF",
              disabled: "#9CA3AF",
            },
            secondary: {
              bg: "#4B5563",
              hover: "#374151",
              focus: "#6B7280",
              text: "#FFFFFF",
            },
          },
        },
        accent: {
          yellow: "#FBBF24",
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
