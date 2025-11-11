/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        tradehub: {
          blue: "#2563EB",
          dark: "#111827",
          light: "#EFF6FF",
          gray: "#6B7280"
        }
      }
    }
  },
  plugins: []
};
