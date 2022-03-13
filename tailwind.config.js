module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px'
      },
      fontSize: {
        '6px': '6px',
        '7px': '7px',
        '8px': '8px',
        '9px': '9px',
        '10px': '10px'
      },
      screens: {
        '230-270px': { 'min': '230px', 'max': '270px' },
        '271-300px': { 'min': '271px', 'max': '300px' },
        '301-330px': { 'min': '301px', 'max': '330px' },
        '331-360px': { 'min': '331px', 'max': '360px' }

      }
    },
  },
  plugins: [require("daisyui")],
}