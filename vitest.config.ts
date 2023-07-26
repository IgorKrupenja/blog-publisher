/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './src/test/setup-tests.ts',
    coverage: {
      provider: 'v8', // or 'v8'
      reporter: [['lcov', { projectRoot: './src' }], ['json', { file: 'coverage.json' }], ['text']],
      // reporter: ['lcov'],
    },
    // globals: true,
    // reporters: ['verbose'],
    // coverage: {
    //   all: true,
    //   provider: 'v8',
    //   reporter: ['text', 'html', 'lcov', 'cobertura', 'json'],
    //   include: ['**/src/**/*.{js,jsx,ts,tsx}'],
    //   exclude: [
    //     '**/src/main.{js,jsx,ts,tsx}',
    //     '**/*.types.{ts,tsx}',
    //     '**/*.test.{js,jsx,ts,tsx}',
    //     '**/src/vite-env*',
    //   ],
    //   statements: 0,
    //   branches: 0,
    //   functions: 0,
    //   lines: 0,
    // },
  },
});
