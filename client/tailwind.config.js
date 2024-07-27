/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blue: colors.blue,
      black: colors.black,
      red: colors.red,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      'dark-indigo': '#050E1F',
      'silver': '#D2D2D2'
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '0.5': '0.5px',
      '1': '1px',
      '2': '2px',
      '2.5': '2.5px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    }
  },
  plugins: [],
}

