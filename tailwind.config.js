export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F6F2',
          surface: '#FFFFFF',
          'surface-hover': '#F3EEE6',
          border: '#E6DED3',
          primary: '#2E2B28',
          muted: '#6F675E',
          accent: '#BFA06A',
          'accent-hover': '#A88955',
          'accent-text': '#000000',
        },
        bg: '#F9F6F2',
        surface: '#FFFFFF',
        'surface-hover': '#F3EEE6',
        accent: '#BFA06A',
        'accent-hover': '#A88955',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '16px',
      },
    },
  },
  plugins: [],
};