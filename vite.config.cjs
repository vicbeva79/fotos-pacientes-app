const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const basicSsl = require('@vitejs/plugin-basic-ssl')

module.exports = defineConfig({
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    host: true, // Necesario para acceder desde dispositivos móviles en la red local
    https: true, // Habilitar HTTPS
  }
}) 