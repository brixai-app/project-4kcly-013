export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#FAF7F0',
          surface: '#FFFFFF',
          'surface-hover': '#F1EBDD',
          border: '#B8AD9D',
          primary: '#1F1E1C',
          muted: '#514B43',
          accent: '#C9A66B',
          'accent-hover': '#D8BC89',
          'accent-text': '#000000',
        },
        bg: '#FAF7F0',
        surface: '#FFFFFF',
        'surface-hover': '#F1EBDD',
        accent: '#C9A66B',
        'accent-hover': '#D8BC89',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '4px',
      },
    },
  },
  plugins: [],
};