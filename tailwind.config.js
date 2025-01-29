/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Inclure le fichier HTML de Vite.js
    "./src/**/*.{js,jsx,ts,tsx}", // Inclure tous les fichiers React
  ],
  theme: {
    extend: {}, // Ajoutez ici vos personnalisations si besoin
  },
  plugins: [],
};