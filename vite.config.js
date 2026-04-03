import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/vocabulary1/', // <-- AÑADE ESTA LÍNEA (con las barras a los lados)
})