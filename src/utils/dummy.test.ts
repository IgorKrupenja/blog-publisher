import { describe, expect, it } from 'vitest';

import * as dummy from './dummy.js';

describe('parent', () => {
  it('should return foobar', () => {
    expect(dummy.parent()).eq('foobar');
  });
});

describe('child', () => {
  it('should return bar', () => {
    expect(dummy.child()).eq('bar');
  });
});
