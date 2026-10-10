import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5175 (kitab) and 5176 (vaken) are taken, so this one runs on 5177
export default defineConfig({
  plugins: [react()],
  server: { port: 5177, strictPort: true },
})
