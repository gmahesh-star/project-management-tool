/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['0.9375rem', { lineHeight: '1.5rem' }],
      'lg': ['1.0625rem', { lineHeight: '1.75rem' }],
      'xl': ['1.1875rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.4375rem', { lineHeight: '2rem' }],
      '3xl': ['1.8125rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.1875rem', { lineHeight: '2.5rem' }],
      '5xl': ['2.8125rem', { lineHeight: '1' }],
      '6xl': ['3.5rem', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        vintage: {
          cream: '#F5F1E8',
          paper: '#FBF8F1',
          brown: '#6B4423',
          darkbrown: '#3E2723',
          maroon: '#7C2D12',
          navy: '#1E3A5F',
          mustard: '#D4A574',
          gold: '#B8860B',
          ink: '#1A1A1A',
          green: '#2F4F2F',
        }
      },
      fontFamily: {
        typewriter: ['"Courier New"', 'Courier', 'monospace'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        handwritten: ['"Brush Script MT"', 'cursive'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.05\" /%3E%3C/svg%3E')",
        'lined-paper': "repeating-linear-gradient(transparent, transparent 31px, #E8DCC4 31px, #E8DCC4 32px)",
      },
      boxShadow: {
        'vintage': '4px 4px 0px 0px rgba(107, 68, 35, 0.3)',
        'card': '2px 2px 8px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fold': 'fold 0.3s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        fold: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        }
      }
    },
  },
  plugins: [],
}
