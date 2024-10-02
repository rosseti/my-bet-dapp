/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adicione isso para escanear arquivos no diretório src
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // Adicione o DaisyUI aqui
}

