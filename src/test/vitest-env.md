I want to mock env variables with Vitest. For now, I was able to do it this way:

```ts
// test
beforeAll(() => {
  import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
});

// tested function using an env variable
export const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
};
```

However, this a bit cumbersome as I would need to do this in every test suite for same env variables.

I also tried using `setup files` this way but it didn't work:

```ts
// vitest.config.ts
/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test/env-mock.ts'],
  },
});
 
// test/env-mock.ts
beforeAll(() => {
  import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
});

afterAll(() => {
  delete import.meta.env.HASHNODE_URL;
});
```

And could not get this to work with `globalSetup` either:

```ts
// In same vitest.config.ts
globalSetup: './test/global-setup.ts',

// test/global-setup.ts
export function setup(): void {
  import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
}

export function teardown(): void {}
```
