/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ['0.625rem', {
          lineHeight: '1.5rem',

        }],
      },
      gridTemplateColumns: {
        'auto-fit-250px': 'repeat(auto-fill, minmax(225px, 1fr))',
        'auto-fill-300px': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fill-200px': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fit-400px': 'repeat(auto-fit, minmax(400px, 1fr))',
        'auto-fit-500px': 'repeat(auto-fit, minmax(500px, 1fr))',
        'auto-fit-600px': 'repeat(auto-fit, minmax(600px, 1fr))',
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'repeat-4-fill': 'repeat(4, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        16: 'repeat(16, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',

      },
      screens: {
        customXl: '1024px',
        customXXl: '1277px',
      },
      colors: {
        'button-red': '#E94560',
        'primary': '#3743AE',
        'custom-gray': '#C6C7CB',
        'button-green': '#42B430',
        'custom-button-red': '#DC2626',
        'button-yellow': '#FFC700',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridRow: {
        'span-7': 'span 7 / span 7',
        'span-11': 'span 11 / span 11',
      },
      keyframes: {
        slideDown: {
          from: { height: 0 },
          to: { height: '100%' },
        },
        slideUp: {
          from: { height: '100%' },
          to: { height: 0 },
        },
        closeSidebar: {
          from: { left: 0 },
          to: { left: '-350px' },
        },
        openSidebar: {
          from: { left: '-350px' },
          to: { left: 0 },
        },
      },
      animation: {
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        closeSidebar: 'closeSidebar 350ms ease-in',
        openSidebar: 'openSidebar 350ms ease-in',
      },
    },
  },
  plugins: [],
}
