import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // While developing, requests to /api/* get forwarded to your
    // Python backend (Flask/FastAPI) so there's no CORS setup needed.
    // Change the port to whatever your backend runs on.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
