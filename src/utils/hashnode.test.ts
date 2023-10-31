import { describe, expect, it } from 'vitest';

import { getCanonicalUrl } from '.';

describe('getCanonicalUrl', () => {
  it('should return correct URL', () => {
    expect(getCanonicalUrl('foo')).eq('https://blog.IgorKrpenja.com/foo');
  });
});
