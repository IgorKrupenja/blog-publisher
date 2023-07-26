import { beforeAll, describe, expect, it } from 'vitest';

import {
  getCanonicalUrl,
  getCoverImageUrl,
  insertCanonicalUrl,
  insertCoverImage,
} from './markdown';

beforeAll(() => {
  import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
  import.meta.env.SUPABASE_URL = 'https://supabase.IgorKrpenja.com';
  import.meta.env.SUPABASE_STORAGE_BUCKET = 'images';
});

describe('getCanonicalUrl', () => {
  it('should return correct URL', () => {
    expect(getCanonicalUrl('foo')).eq('https://blog.IgorKrpenja.com/foo');
  });
});

describe('getCoverImageUrl', () => {
  it('should return correct URL', () => {
    expect(getCoverImageUrl('foo')).eq(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/foo'
    );
  });
});

describe('insertCanonicalUrl', () => {
  it('should return correct markdown', () => {
    const markdown = 'foo';
    const url = 'bar';
    expect(insertCanonicalUrl(markdown, url)).eq(
      '\n*This article was originally published on [my blog](bar).*\nfoo'
    );
  });
});

describe('insertCoverImage', () => {
  it('should return correct markdown', () => {
    const title = 'title';
    const content = '## Heading';
    const coverImagePath = 'path/to/image.jpg';
    expect(insertCoverImage(title, content, coverImagePath)).eq(
      '\n![title](https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg)\n## Heading'
    );
  });
});
