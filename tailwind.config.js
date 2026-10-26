export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F6F0E5',
          surface: '#FFFDF8',
          'surface-hover': '#EFE3D2',
          border: '#CBBCA7',
          primary: '#17130F',
          muted: '#6F6254',
          accent: '#A8472A',
          'accent-hover': '#84351F',
          'accent-text': '#ffffff',
        },
        bg: '#F6F0E5',
        surface: '#FFFDF8',
        'surface-hover': '#EFE3D2',
        accent: '#A8472A',
        'accent-hover': '#84351F',
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