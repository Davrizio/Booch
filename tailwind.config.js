/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js,ejs}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      animation: {
        rotationalwave: "wave 2s ease-in-out infinite",
        fadeinup: "fadeinup 0.6s ease-in-out"
      },
      keyframes: {
        wave: {
          "0%": {transform: "rotate(0deg)"},
          "25%": {transform: "rotate(10deg)"},
          "50%": {transform: "rotate(-10deg)"},
          "75%": {transform: "rotate(10deg)"},
          "100%": {transform: "rotate(0deg)"}
        },
        fadeinup: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      }
    },
  },
  
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-3d')
  ],
}

