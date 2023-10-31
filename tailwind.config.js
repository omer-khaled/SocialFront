/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#1877f2",
        secondary:"#f0f2f5",
        like:"#036dc5",
        love:"#fe3c6e",
        haha:"#edcd4d",
        wow:"#edcd4d",
        sad:"#edcd4d",
        angry:"#ff8552",
      },
      
    },
  },
  plugins: [],
}

