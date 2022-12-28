import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: 'http://localhost:3000',
    port: 3000,
  },
  plugins: [react()],
})
