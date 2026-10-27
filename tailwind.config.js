export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F5F0',
          surface: '#FFFDFC',
          'surface-hover': '#F1E8E2',
          border: '#BFA6A0',
          primary: '#2B2B2B',
          muted: '#6F625D',
          accent: '#D9381E',
          'accent-hover': '#B92B17',
          'accent-text': '#ffffff',
        },
        bg: '#F9F5F0',
        surface: '#FFFDFC',
        'surface-hover': '#F1E8E2',
        accent: '#D9381E',
        'accent-hover': '#B92B17',
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