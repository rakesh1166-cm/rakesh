import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 5173 / 5174 are used by the rangmanch and dabbawala UIs, so this one runs on 5175
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: true },
})
