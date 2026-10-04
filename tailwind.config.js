export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F1EB',
          surface: '#FFFCF7',
          'surface-hover': '#EEE7DE',
          border: '#D8CFC3',
          primary: '#2B2B2B',
          muted: '#665E54',
          accent: '#8B0000',
          'accent-hover': '#650000',
          'accent-text': '#ffffff',
        },
        bg: '#F5F1EB',
        surface: '#FFFCF7',
        'surface-hover': '#EEE7DE',
        accent: '#8B0000',
        'accent-hover': '#650000',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '4px',
      },
    },
  },
  plugins: [],
};