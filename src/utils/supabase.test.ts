import { describe, expect, it } from 'vitest';

import { getImageUrl } from './supabase';

describe('getImageUrl', () => {
  it('should return correct URL', () => {
    expect(getImageUrl('src/articles/foo/bar.jpg')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo/bar.jpg'
    );
  });
});
