import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'client',
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/breathing-sessions': 'http://localhost:3000'
    }
  }
})
