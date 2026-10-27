export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#FAF9F6',
          surface: '#FFFFFF',
          'surface-hover': '#F2EDE4',
          border: '#D8CDBB',
          primary: '#2B2B2B',
          muted: '#6E665C',
          accent: '#9A7135',
          'accent-hover': '#765326',
          'accent-text': '#000000',
        },
        bg: '#FAF9F6',
        surface: '#FFFFFF',
        'surface-hover': '#F2EDE4',
        accent: '#9A7135',
        'accent-hover': '#765326',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '2px',
      },
    },
  },
  plugins: [],
};