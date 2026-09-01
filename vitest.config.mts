import { defineConfig, configDefaults } from 'vitest/config'
import { fileURLToPath } from 'url'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// 프로젝트는 각자 독립된 vite 설정이라 플러그인과 alias를 상속받지 않는다.
const shared = () => ({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // Next가 런타임에 제공하는 가상 모듈이라 테스트에서는 해석되지 않는다.
      'server-only': fileURLToPath(
        new URL('./test/server-only-stub.ts', import.meta.url)
      ),
    },
  },
})

const BROWSER_TESTS = '**/*.browser.test.{ts,tsx}'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    ...shared(),
    test: {
      projects: [
        {
          ...shared(),
          test: {
            name: 'unit',
            environment: 'jsdom',
            env,
            exclude: [...configDefaults.exclude, BROWSER_TESTS],
          },
        },
        {
          ...shared(),
          test: {
            name: 'browser',
            env,
            include: [BROWSER_TESTS],
            browser: {
              provider: 'playwright',
              enabled: true,
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }
})
