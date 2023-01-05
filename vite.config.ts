/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: 'http://localhost:3000',
    port: 3000,
  },
  plugins: [react()],
  test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.js',
	},
})
