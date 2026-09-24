import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5173 is used by the 03-rangmanch-review UI, so this one runs on 5174
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true },
})
