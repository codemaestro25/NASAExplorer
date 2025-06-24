import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/neo': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/eonet': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/mars': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
