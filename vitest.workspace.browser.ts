import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.mts',
    test: {
      include: ['**/*.browser.test.{ts,tsx}'],
      browser: {
        provider: 'playwright',
        enabled: true,
        headless: true,
        instances: [
          {
            browser: 'chromium',
          },
        ],
      },
    },
  },
])
