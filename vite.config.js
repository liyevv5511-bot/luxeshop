import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages needs the '/luxeshop/' sub-path; Vercel & local serve from root.
  base: process.env.GITHUB_ACTIONS ? '/luxeshop/' : '/',
})
