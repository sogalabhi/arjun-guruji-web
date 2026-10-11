/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Shared brand palette for app bars, home tiles and readers.
      colors: {
        navy: "#010036",
        royal: "#332FFF",
        tile: "#FFD146",
        accent: "#FFA000",
        ink: "#1A1A1A",
        muted: "#5C5045",
        line: "#DDD1BD",
        paper: "#FBF7EF",
      },
      fontFamily: {
        sans: ["Poppins", "Noto Sans Kannada", "system-ui", "sans-serif"],
        kannada: ["Noto Sans Kannada", "sans-serif"],
        "kannada-serif": ["Noto Serif Kannada", "serif"],
        samarkan: ["Samarkan", "serif"],
      },
      backgroundImage: {
        "app-bar": "linear-gradient(to right, #010036, #332FFF)",
      },
      spacing: {
        "safe-t": "env(safe-area-inset-top)",
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-l": "env(safe-area-inset-left)",
        "safe-r": "env(safe-area-inset-right)",
      },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
    },
  },
  plugins: [],
}
