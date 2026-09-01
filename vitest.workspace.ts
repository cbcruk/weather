import { defineWorkspace, configDefaults } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.mts',
    test: {
      // 브라우저가 필요한 테스트는 vitest.workspace.browser.ts에서 실행한다.
      exclude: [...configDefaults.exclude, '**/*.browser.test.{ts,tsx}'],
    },
  },
])
