import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/**/*.browser.test.ts'],
          name: 'Node',
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/**/*.node.test.ts'],
          name: 'Browser',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
            ui: false,
            screenshotFailures: false,
          },
        },
      },
    ],
  },
})
