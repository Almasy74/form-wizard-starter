import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/form-wizard-starter/',   // <- viktig for GitHub Pages
})
