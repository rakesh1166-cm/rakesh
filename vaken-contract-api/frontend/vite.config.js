import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5173-5175 are used by the rangmanch, dabbawala and kitab UIs, so this one runs on 5176
export default defineConfig({
  plugins: [react()],
  server: { port: 5176, strictPort: true },
})
