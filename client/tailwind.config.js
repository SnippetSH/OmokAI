/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem', // 10px
        'xxl': '1.75rem',  // 28px
        'xxxl': '2rem',    // 32px
      },
      padding: {
        '1.5': '0.4rem'
      }
    },
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
      'silver': '#D2D2D2',
      'button-indigo': '#003572',
      'button-border-indigo': '#003066'
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '0.5': '0.5px',
      '1': '1px',
      '1.5': '1.5px',
      '2': '2px',
      '2.5': '2.5px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    screens: {
      ...defaultTheme.screens,
      'max-sm': {'max': '639px'},
      'max-md': {'max': '767px'},
      'max-lg': {'max': '1023px'},
      'max-xl': {'max': '1279px'},
      'max-2xl': {'max': '1535px'},
      'above-450': "450px",
      'under-450': {'max': '450px'},
      'under-350': {'max': '375px'}
    }
  },
  plugins: [],
}

