/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        nexa: ["Nexa", "sans-serif"],
      },
      colors: {
        white: {
          intense: "#FFFFFF",
          broken: "#D9D9D9",
        },
        green: {
          medium: "#336D38",
          dark: "#225126",
          tolerated: "#598E5C",
          light: "#C4E6C9",
        },
        gray: {
          DEFAULT: "#333333",
        },
        red: {
          DEFAULT: "#FF6163",
        }
      },
    },
  },
  plugins: [],
}

