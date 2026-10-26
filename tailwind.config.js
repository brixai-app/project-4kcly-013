export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F7F0E4',
          surface: '#FFFDF8',
          'surface-hover': '#EFE2CF',
          border: '#CDBB9F',
          primary: '#2B1715',
          muted: '#765F55',
          accent: '#741F2B',
          'accent-hover': '#57151F',
          'accent-text': '#ffffff',
        },
        bg: '#F7F0E4',
        surface: '#FFFDF8',
        'surface-hover': '#EFE2CF',
        accent: '#741F2B',
        'accent-hover': '#57151F',
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