import { describe, expect, it } from 'bun:test';

import { getSupabaseUploadPath, getSupabaseUrl } from './supabase';

describe.skip('getUrl', () => {
  it('should return correct URL for file', () => {
    expect(getSupabaseUrl('src/articles/foo/bar.jpg')).toEqual(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo/bar.jpg'
    );
  });

  it('should return correct URL for directory', () => {
    expect(getSupabaseUrl('src/articles/foo')).toEqual(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo'
    );
  });
});

describe.skip('getUploadPath', () => {
  it('should return correct path', () => {
    expect(getSupabaseUploadPath('public/images/articles/foo/bar.jpg')).toEqual(
      'images/articles/foo/bar.jpg'
    );
  });

  it('should handle empty string', () => {
    expect(getSupabaseUploadPath('')).toEqual('');
  });
});
