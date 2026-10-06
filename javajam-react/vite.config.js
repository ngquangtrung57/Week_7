import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // files on a Windows drive under WSL don't emit change events, so poll
  server: {watch: {usePolling: true}},
})
