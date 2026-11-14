import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base './' permite publicar em qualquer caminho (Vercel, Netlify, GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
