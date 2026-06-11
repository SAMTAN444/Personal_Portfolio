import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Treat the Lanyard's GLB model as a static asset (hashed + emitted to dist).
  assetsInclude: ['**/*.glb'],
})
