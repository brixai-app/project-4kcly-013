export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F6F2',
          surface: '#FFFFFF',
          'surface-hover': '#F4EFE8',
          border: '#D9D1C7',
          primary: '#2E2B28',
          muted: '#6F675E',
          accent: '#8B0000',
          'accent-hover': '#6F0000',
          'accent-text': '#ffffff',
        },
        bg: '#F9F6F2',
        surface: '#FFFFFF',
        'surface-hover': '#F4EFE8',
        accent: '#8B0000',
        'accent-hover': '#6F0000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '16px',
      },
    },
  },
  plugins: [],
};