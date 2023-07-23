import { beforeAll, describe, expect, it } from 'vitest';

import { getCanonicalUrl } from './index.js';

beforeAll(() => {
  import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
});

describe('getCanonicalUrl', () => {
  it('foo', () => {
    expect(getCanonicalUrl('foo')).eq('https://blog.IgorKrpenja.com/foo');
  });
});
