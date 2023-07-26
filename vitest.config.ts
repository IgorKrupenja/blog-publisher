/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './src/test/setup-tests.ts',
    reporters: ['verbose'],
    coverage: {
      reporter: [['lcov', { projectRoot: './src' }], ['text']],
      all: true,
      include: ['**/src/**/*.ts'],
      exclude: ['**/interfaces/*', '**/data/*', '**/test/*', '**/src/*.d.ts'],
    },
  },
});
