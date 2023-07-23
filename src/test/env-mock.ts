import { afterAll, beforeAll } from 'vitest';

beforeAll(() => {
  import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
});

afterAll(() => {
  delete import.meta.env.HASHNODE_URL;
});
