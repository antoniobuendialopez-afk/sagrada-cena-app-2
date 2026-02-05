import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Esto le dice a Netlify: "Si no encuentras lucide, no te detengas"
      external: ['lucide-react']
    }
  }
})
