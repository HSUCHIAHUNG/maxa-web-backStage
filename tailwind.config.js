/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from '@iconify/tailwind';
// console.log(addDynamicIconSelectors)
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      mainorange: '#0F1C31'
    },
    screens: {
      'xl': '1200px',
      'md': '768px',
    },
    extend: {
      fontFamily: {
        'Noto Sans TC': ['Noto Sans TC', 'sans-serif'],
      },
    }
  },
  plugins: [
    addDynamicIconSelectors(),
  ],
}

