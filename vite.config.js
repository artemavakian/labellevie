import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const noIndexHeaders = {
  'X-Robots-Tag': 'noindex, nofollow',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      host: '127.0.0.1',
      clientPort: 3000,
    },
    headers: {
      ...noIndexHeaders,
      'Cache-Control': 'no-store',
    },
  },
  preview: {
    headers: noIndexHeaders,
  },
})
