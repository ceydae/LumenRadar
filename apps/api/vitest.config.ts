import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
    testTimeout: 10_000,
    hookTimeout: 20_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/test/**'],
      reporter: ['text', 'html'],
    },
  },
});
