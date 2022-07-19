module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Space Grotesk", "sans-serif"],
    },
    extend: {
      colors: {
        'monke-green': '#184623',
        'monke-light-green': '#4a8f5d',
        'monke-cream': '#f3efcd'
      }
    },
  },
  plugins: [],
}