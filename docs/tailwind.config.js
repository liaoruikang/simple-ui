/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        '50px': '50px'
      },
      width: {
        '50px': '50px'
      },
      color: {
        cyan: '#249FD4'
      },
      margin: {
        '10px': '0 10px'
      },
      padding: {
        '10px': '0 10px'
      },
      lineHeight: {
        '50px': '50px'
      }
    }
  },
  plugins: []
}
