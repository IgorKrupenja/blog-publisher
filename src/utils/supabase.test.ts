import { beforeAll, describe, expect, it } from 'vitest';

import { setup } from '../test/setup-tests';
import { getCoverImageUrl } from './supabase';

beforeAll(() => {
  setup();
});

describe('getCoverImageUrl', () => {
  it('should return correct URL', () => {
    expect(getCoverImageUrl('foo')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/foo'
    );
  });
});
