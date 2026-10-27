export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F0E6',
          surface: '#FFFBF4',
          'surface-hover': '#EADFCC',
          border: '#C9A66B',
          primary: '#2B2B2B',
          muted: '#6D6257',
          accent: '#B04E2C',
          'accent-hover': '#8F3C22',
          'accent-text': '#ffffff',
        },
        bg: '#F5F0E6',
        surface: '#FFFBF4',
        'surface-hover': '#EADFCC',
        accent: '#B04E2C',
        'accent-hover': '#8F3C22',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '18px',
      },
    },
  },
  plugins: [],
};