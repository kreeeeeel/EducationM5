// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        'neon-blue-pink': '0 0 5px rgba(0, 0, 255, 0.3), 0 0 10px rgba(255, 0, 255, 0.3), 0 0 15px rgba(0, 0, 255, 0.2), 0 0 20px rgba(255, 0, 255, 0.2)',
      },
      animation: {
        progress: 'progress 5s linear forwards',
        pumpjack: 'pumpjack 2s ease-in-out infinite',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        pumpjack: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-15deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};
