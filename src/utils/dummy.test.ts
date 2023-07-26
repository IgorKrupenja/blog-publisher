import { describe, expect, it, vi } from 'vitest';

import { parent } from './dummy-parent.js';

vi.mock('./dummy-child.js', () => {
  return {
    child: () => 'baz',
  };
});

describe('parent', () => {
  it('should return foobaz', () => {
    expect(parent()).eq('foobaz');
  });
});

// describe('child', () => {
//   it('should return bar', () => {
//     expect(dummy.child()).eq('bar');
//   });
// });
