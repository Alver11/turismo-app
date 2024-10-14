/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}",
      "./screens/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
      "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'off-white': {
          DEFAULT: '#E3E3E3',
        },
        // dark: {
        //   DEFAULT: '#1C1C1E',
        // },
        darkMode: 'media',
        'soft-dark': {
          DEFAULT: '#2A2A2F',
        },
      },
    },
  },
  plugins: [],
}

