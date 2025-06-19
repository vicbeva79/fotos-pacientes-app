const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const basicSsl = require('@vitejs/plugin-basic-ssl')

module.exports = defineConfig({
  base: '/fotos-pacientes-app/', // <-- ¡Esto es clave!
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    host: true,
    https: true,
  }
})