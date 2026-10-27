export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#FAF9F6',
          surface: '#F5F1E9',
          'surface-hover': '#EDE5D8',
          border: '#D8CCB9',
          primary: '#1A1A1A',
          muted: '#675F56',
          accent: '#A94720',
          'accent-hover': '#843616',
          'accent-text': '#ffffff',
        },
        bg: '#FAF9F6',
        surface: '#F5F1E9',
        'surface-hover': '#EDE5D8',
        accent: '#A94720',
        'accent-hover': '#843616',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '2px',
      },
    },
  },
  plugins: [],
};