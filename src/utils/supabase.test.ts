import { describe, expect, it } from 'vitest';

import { getUploadPath, getUrl } from './supabase';

describe('getUrl', () => {
  it('should return correct URL for file', () => {
    expect(getUrl('src/articles/foo/bar.jpg')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo/bar.jpg'
    );
  });

  it('should return correct URL for directory', () => {
    expect(getUrl('src/articles/foo')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo'
    );
  });
});

describe('getUploadPath', () => {
  it('should return correct path', () => {
    expect(getUploadPath('public/images/articles/foo/bar.jpg')).toEqual(
      'images/articles/foo/bar.jpg'
    );
  });

  it('should handle empty string', () => {
    expect(getUploadPath('')).toEqual('');
  });
});
