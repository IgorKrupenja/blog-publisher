/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // TODO: broken
    setupFiles: ['./test/env-mock.ts'],
  },
});
