export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F5F0',
          surface: '#FFFDFC',
          'surface-hover': '#F1E8DE',
          border: '#D8CBBB',
          primary: '#2B2B2B',
          muted: '#6D6259',
          accent: '#BFA06E',
          'accent-hover': '#A88650',
          'accent-text': '#000000',
        },
        bg: '#F9F5F0',
        surface: '#FFFDFC',
        'surface-hover': '#F1E8DE',
        accent: '#BFA06E',
        'accent-hover': '#A88650',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bodoni Moda', 'sans-serif'],
      },
      borderRadius: {
        theme: '4px',
      },
    },
  },
  plugins: [],
};