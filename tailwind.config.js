/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design Theme Colors
        primary: '#1F3B4D', // Navy Blue
        accent: '#4A90E2',  // Soft Blue
        textColor: '#2C2C2C', // Dark Charcoal
        lightGray: '#F5F7FA', // Light Gray
        white: '#FFFFFF', // Pure White
      },
      spacing: {
         '18': '4.5rem',
         '22': '5.5rem',
         '26': '6.5rem',
         '30': '7.5rem',
         '100': '25rem',
         '128': '32rem',
         '144': '36rem',
      },
      borderRadius: {
         'xl': '0.75rem',
         '2xl': '1rem',
         '3xl': '1.5rem',
         '4xl': '2rem',
      },
       fontFamily: {
         sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
       }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),

  ],
}