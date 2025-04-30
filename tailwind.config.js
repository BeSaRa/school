/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        chat: {
          user: {
            bg: "rgb(238, 242, 255)", // indigo-50
            text: "rgb(30, 58, 138)", // indigo-900
          },
          assistant: {
            bg: "rgb(248, 250, 252)", // slate-50
            text: "rgb(15, 23, 42)", // slate-900
          },
          system: {
            bg: "rgb(254, 249, 195)", // yellow-100
            text: "rgb(133, 77, 14)", // yellow-800
          },
          tool: {
            bg: "rgb(243, 232, 255)", // purple-100
            text: "rgb(107, 33, 168)", // purple-800
          },
          developer: {
            bg: "rgb(252, 231, 243)", // pink-100
            text: "rgb(157, 23, 77)", // pink-800
          },
          button: {
            primary: {
              bg: "rgb(37, 99, 235)", // blue-600
              hover: "rgb(29, 78, 216)", // blue-700
              focus: "rgb(59, 130, 246)", // blue-500
              text: "rgb(255, 255, 255)", // white
              disabled: "rgb(156, 163, 175)", // gray-400
            },
            secondary: {
              bg: "rgb(75, 85, 99)", // gray-600
              hover: "rgb(55, 65, 81)", // gray-700
              focus: "rgb(107, 114, 128)", // gray-500
              text: "rgb(255, 255, 255)", // white
            },
          },
        },
      },
    },
  },
  plugins: [],
};
