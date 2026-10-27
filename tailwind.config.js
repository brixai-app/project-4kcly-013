export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F1EB',
          surface: '#FFFCF7',
          'surface-hover': '#EEE6DA',
          border: '#D8CDBE',
          primary: '#2B2B2B',
          muted: '#6E665D',
          accent: '#C9A66B',
          'accent-hover': '#B38A4E',
          'accent-text': '#000000',
        },
        bg: '#F5F1EB',
        surface: '#FFFCF7',
        'surface-hover': '#EEE6DA',
        accent: '#C9A66B',
        'accent-hover': '#B38A4E',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '8px',
      },
    },
  },
  plugins: [],
};