export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F5F0E6',
          surface: '#FFF9F0',
          'surface-hover': '#EFE4D2',
          border: '#C9A66B',
          primary: '#2B2B2B',
          muted: '#6F655B',
          accent: '#7B2D26',
          'accent-hover': '#61211C',
          'accent-text': '#ffffff',
        },
        bg: '#F5F0E6',
        surface: '#FFF9F0',
        'surface-hover': '#EFE4D2',
        accent: '#7B2D26',
        'accent-hover': '#61211C',
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