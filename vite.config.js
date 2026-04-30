import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    // Proxy para backend local (opcional)
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // ou http://127.0.0.1:8000
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Se for publicar em subpasta, muda aqui:
  // base: '/app/',
})
