/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LegallyUp Logo-Matched Theme Colors
        primary: '#1B365D',   // Dark Blue from logo shield
        accent: '#22C55E',    // Green from logo (matching the "Up" and arrow)
        secondary: '#1F2937', // Dark Gray - sophisticated text
        textColor: '#1F2937', // Dark Gray
        lightGray: '#F8FAFC', // Very Light Gray - clean backgrounds
        mediumGray: '#E2E8F0', // Medium Gray - subtle borders
        success: '#22C55E',   // Green - same as accent for consistency
        warning: '#D97706',   // Orange - attention
        danger: '#DC2626',    // Red - errors/delete
        white: '#FFFFFF',     // Pure White
        // Logo-inspired gradient colors for hero sections
        heroStart: '#1B365D', // Dark blue from logo
        heroEnd: '#2563EB',   // Slightly lighter blue for gradient
        logoGreen: '#22C55E', // Exact green from logo
        logoBlue: '#1B365D',  // Exact dark blue from logo
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