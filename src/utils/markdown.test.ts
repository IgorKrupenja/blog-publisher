import { beforeAll, describe, expect, it, vi } from 'vitest';

import { setup } from '../test/setup-tests';
import { getCanonicalUrl, insertCanonicalUrl, insertCoverImage } from './markdown';
import * as supabase from './supabase';

beforeAll(() => {
  setup();
});

describe('getCanonicalUrl', () => {
  it('should return correct URL', () => {
    expect(getCanonicalUrl('foo')).eq('https://blog.IgorKrpenja.com/foo');
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

    const spy = vi
      .spyOn(supabase, 'getCoverImageUrl')
      .mockReturnValueOnce(
        'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg'
      );

    expect(insertCoverImage(title, content, coverImagePath)).eq(
      '\n![title](https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg)\n## Heading'
    );
    expect(spy).toHaveBeenCalled();
  });
});
