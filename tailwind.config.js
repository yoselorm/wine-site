/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3E6',
        forest: {
          DEFAULT: '#2F3A2C',
          dark: '#232B20',
        },
        gold: {
          DEFAULT: '#C08A34',
          light: '#D9A855',
        },
        wine: '#8C2F39',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}