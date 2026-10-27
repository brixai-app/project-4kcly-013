export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#FAF7F0',
          surface: '#FFFDF8',
          'surface-hover': '#F2EBDD',
          border: '#D8CCB8',
          primary: '#2B2B2B',
          muted: '#6D6257',
          accent: '#9A7440',
          'accent-hover': '#76562E',
          'accent-text': '#000000',
        },
        bg: '#FAF7F0',
        surface: '#FFFDF8',
        'surface-hover': '#F2EBDD',
        accent: '#9A7440',
        'accent-hover': '#76562E',
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