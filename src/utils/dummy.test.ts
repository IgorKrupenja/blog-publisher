import { describe, expect, it, vi } from 'vitest';

import * as dummy from './dummy-child.js';
import { parent } from './dummy-parent.js';

describe('parent', () => {
  it('should return foobaz', () => {
    const spy = vi.spyOn(dummy, 'child').mockReturnValueOnce('baz');
    expect(parent()).eq('foobaz');
    expect(spy).toHaveBeenCalled();
  });
});
