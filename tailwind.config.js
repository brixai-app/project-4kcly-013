export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F1EB',
          surface: '#FFFCF7',
          'surface-hover': '#EAE2D7',
          border: '#C9BFB1',
          primary: '#302D29',
          muted: '#71695F',
          accent: '#6B1E1E',
          'accent-hover': '#501515',
          'accent-text': '#ffffff',
        },
        bg: '#F5F1EB',
        surface: '#FFFCF7',
        'surface-hover': '#EAE2D7',
        accent: '#6B1E1E',
        'accent-hover': '#501515',
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