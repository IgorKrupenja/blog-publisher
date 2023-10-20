import { describe, expect, it } from 'vitest';

import { getImageUrl } from './supabase';

describe('getImageUrl', () => {
  it('should return correct URL', () => {
    expect(getImageUrl('foo')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/foo'
    );
  });
});
