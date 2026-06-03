import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/heart/',
  server: {
    allowedHosts: ['lab.eduaix.com'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
})
