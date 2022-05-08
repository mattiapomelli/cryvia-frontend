module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a84f5',
          hover: '#0270d6',
          light: '#dbeafe',
        },
      },
      borderRadius: {
        default: '50px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
