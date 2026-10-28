export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F5F0',
          surface: '#FFFDF9',
          'surface-hover': '#F1E8DD',
          border: '#CDBB9B',
          primary: '#2E2B28',
          muted: '#6E6258',
          accent: '#C1440E',
          'accent-hover': '#963308',
          'accent-text': '#ffffff',
        },
        bg: '#F9F5F0',
        surface: '#FFFDF9',
        'surface-hover': '#F1E8DD',
        accent: '#C1440E',
        'accent-hover': '#963308',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bodoni Moda', 'sans-serif'],
      },
      borderRadius: {
        theme: '6px',
      },
    },
  },
  plugins: [],
};