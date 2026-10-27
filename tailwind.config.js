export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F1E9',
          surface: '#FFFCF6',
          'surface-hover': '#EDE5D8',
          border: '#CFC1AD',
          primary: '#2E2E2E',
          muted: '#6F675D',
          accent: '#8B0000',
          'accent-hover': '#650000',
          'accent-text': '#ffffff',
        },
        bg: '#F5F1E9',
        surface: '#FFFCF6',
        'surface-hover': '#EDE5D8',
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