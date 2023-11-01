import { describe, expect, it } from 'bun:test';

import { getCanonicalUrl } from './hashnode';

describe('getCanonicalUrl', () => {
  it('should return correct URL', () => {
    expect(getCanonicalUrl('foo')).toEqual('https://blog.IgorKrpenja.com/foo');
  });
});
