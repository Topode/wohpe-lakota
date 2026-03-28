/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',    // Black
        accent: '#C9A84C',     // Subtle gold accent
        background: '#000000', // Deep black
        surface: '#121212',    // Dark grey card
        surfaceHover: '#1c1c1e', // Lighter grey
        dark: '#F5F5F7',       // Apple White
        muted: '#86868B',      // Apple Grey
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}
