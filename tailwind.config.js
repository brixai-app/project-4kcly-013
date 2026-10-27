export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F1EB',
          surface: '#FFFDF7',
          'surface-hover': '#EEE5D9',
          border: '#CFC2B2',
          primary: '#2B2B2B',
          muted: '#6F655C',
          accent: '#E07A5F',
          'accent-hover': '#C85F45',
          'accent-text': '#000000',
        },
        bg: '#F5F1EB',
        surface: '#FFFDF7',
        'surface-hover': '#EEE5D9',
        accent: '#E07A5F',
        'accent-hover': '#C85F45',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '6px',
      },
    },
  },
  plugins: [],
};