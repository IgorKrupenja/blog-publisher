import { beforeAll, describe, expect, it } from 'vitest';

import { getCoverImageUrl } from './supabase';

beforeAll(() => {
  import.meta.env.SUPABASE_URL = 'https://supabase.IgorKrpenja.com';
  import.meta.env.SUPABASE_STORAGE_BUCKET = 'images';
});

describe('getCoverImageUrl', () => {
  it('should return correct URL', () => {
    expect(getCoverImageUrl('foo')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/foo'
    );
  });
});
