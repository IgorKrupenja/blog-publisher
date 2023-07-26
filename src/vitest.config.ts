/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // setupFiles: ['./test/env-mock.ts'],
    globalSetup: './test/global-setup.ts',
  },
});
