const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Plus Jakarta Sans', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#5C5FFE',
          hover: '#474AED',
        },
        secondary: {
          DEFAULT: '#DBE6FF',
          hover: '#D2DFFA',
        },
        tertiary: {
          DEFAULT: '#F8F1FD',
          hover: '#f5e9ff',
        },
        text: {
          primary: '#25273D',
          secondary: '#787A9B',
        },
        background: '#FFFFFF',
      },
      borderRadius: {
        default: '0.7rem',
      },
      gridTemplateColumns: {
        autofill: 'repeat(auto-fill, minmax(270px, 1fr))',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
