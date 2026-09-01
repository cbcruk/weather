import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  return {
    plugins: [tsconfigPaths(), react()],
    resolve: {
      alias: {
        'server-only': fileURLToPath(
          new URL('./test/server-only-stub.ts', import.meta.url)
        ),
      },
    },
    test: {
      environment: 'jsdom',
      env: loadEnv(mode, process.cwd(), ''),
    },
  }
})
