/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        starjedi: ["'Star Jedi'", "sans-serif"],
        exo: ["'Exo 2'", "sans-serif"],
        distantgalaxy: ["'SF Distant Galaxy'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        orbitron: ["'Orbitron'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
