import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Dialectic-Artifacts-3D/', // Bắt buộc phải có 2 dấu gạch chéo trước và sau
})
