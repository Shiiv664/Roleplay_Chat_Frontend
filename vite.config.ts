import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      host: env.VITE_DEV_HOST || '0.0.0.0', // Allow external connections
      port: parseInt(env.VITE_DEV_PORT) || 5173,      // Configurable port
    },
    define: {
      // Make environment variables available at build time
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'),
    },
  }
})
