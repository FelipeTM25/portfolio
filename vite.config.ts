import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths: the same build works on felipetm25.github.io/portfolio/
  // and on a custom domain at the root.
  base: './',
  plugins: [react(), tailwindcss()],
})
