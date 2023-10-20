import { describe, expect, it } from 'vitest';

import { getImageUploadPath, getImageUrl } from './supabase';

describe('getImageUrl', () => {
  it('should return correct URL', () => {
    expect(getImageUrl('src/articles/foo/bar.jpg')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo/bar.jpg'
    );
  });
});

describe('getImageUploadPath', () => {
  it('should return correct path', () => {
    expect(getImageUploadPath('public/images/articles/foo/bar.jpg')).toEqual(
      'images/articles/foo/bar.jpg'
    );
  });

  it('should handle empty string', () => {
    expect(getImageUploadPath('')).toEqual('');
  });
});
