import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/products': 'http://localhost:3001',
      '/cartItems': 'http://localhost:3001',
      '/orders': 'http://localhost:3001',
      '/reviews': 'http://localhost:3001',
    },
  },
})
