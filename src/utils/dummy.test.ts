import { describe, expect, it, vi } from 'vitest';

import * as dummy from './dummy.js';

describe('parent', () => {
  it('should return foobar', () => {
    const spy = vi.spyOn(dummy, 'child').mockReturnValueOnce('bar');
    expect(dummy.parent()).eq('foobar');
    expect(spy).toHaveBeenCalled();
  });
});

describe('child', () => {
  it('should return bar', () => {
    expect(dummy.child()).eq('bar');
  });
});
