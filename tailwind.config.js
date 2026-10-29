export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F7F0E3',
          surface: '#FFFDFC',
          'surface-hover': '#EFE2CF',
          border: '#CDBB9D',
          primary: '#211A17',
          muted: '#6F6258',
          accent: '#741F2B',
          'accent-hover': '#561620',
          'accent-text': '#ffffff',
        },
        bg: '#F7F0E3',
        surface: '#FFFDFC',
        'surface-hover': '#EFE2CF',
        accent: '#741F2B',
        'accent-hover': '#561620',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        display: ['Bodoni Moda', 'sans-serif'],
      },
      borderRadius: {
        theme: '4px',
      },
    },
  },
  plugins: [],
};