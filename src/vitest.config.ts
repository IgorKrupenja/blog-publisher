/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // TODO: does not work automatically, have to call setup() manually
    // https://stackoverflow.com/questions/76768119/mocking-env-variables-with-vitest
    globalSetup: './test/setup-tests.ts',
  },
});
