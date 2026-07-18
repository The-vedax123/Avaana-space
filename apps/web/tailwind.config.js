/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9fb',
          100: '#d3eef2',
          200: '#a9dde6',
          300: '#72c5d5',
          400: '#1fa6b8',
          500: '#0b5c73',
          600: '#095061',
          700: '#063f52',
          800: '#083242',
          900: '#0e1726',
        },
        primary: '#0B5C73',
        secondary: '#063F52',
        accent: '#1FA6B8',
        surface: '#F4FBFD',
        ink: '#0E1726',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,92,115,0.04), 0 8px 24px -8px rgba(11,92,115,0.12)',
        glow: '0 0 0 1px rgba(31,166,184,0.15), 0 20px 60px -20px rgba(31,166,184,0.45)',
        card: '0 1px 3px rgba(14,23,38,0.06), 0 12px 32px -12px rgba(14,23,38,0.10)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0B5C73 0%, #1FA6B8 100%)',
        'hero-gradient':
          'radial-gradient(1200px 600px at 10% -10%, rgba(31,166,184,0.18), transparent), radial-gradient(1000px 500px at 90% 0%, rgba(11,92,115,0.18), transparent)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-24px) rotate(6deg)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-20px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.95)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        blob: 'blob 14s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
