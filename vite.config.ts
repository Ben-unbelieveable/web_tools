import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Project Pages: https://Ben-unbelieveable.github.io/web_tools/
export default defineConfig({
  plugins: [react()],
  base: '/web_tools/',
})
