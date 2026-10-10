import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5173-5177 are used by the other UIs in this series, so this one runs on 5178
export default defineConfig({
  plugins: [react()],
  server: { port: 5178, strictPort: true },
})
