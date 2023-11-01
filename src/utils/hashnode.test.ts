import { describe, expect, it } from 'bun:test';

import { getCanonicalUrl } from '.';

describe('getCanonicalUrl', () => {
  it('should return correct URL', () => {
    expect(getCanonicalUrl('foo')).toEqual('https://blog.IgorKrpenja.com/foo');
  });
});
