import { describe, expect, it, vi } from 'vitest';

import { getCanonicalUrl, getImagePaths, insertCanonicalUrl, insertCoverImage } from './markdown';
import * as supabase from './supabase';

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
      .spyOn(supabase, 'getImageUrl')
      .mockReturnValueOnce(
        'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg'
      );

    expect(insertCoverImage(title, content, coverImagePath)).eq(
      '\n![title](https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg)\n## Heading'
    );
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('getImagePaths', () => {
  it('should return an empty array when there are no images', () => {
    const markdown = 'This is some text without images.';
    expect(getImagePaths('/path/to', markdown)).toEqual([]);
  });

  it('should return an array with one image when there is one image', () => {
    const markdown = 'This is some text with an image: ![alt text](image.jpg)';
    expect(getImagePaths('/path/to', markdown)).toEqual(['/path/to/image.jpg']);
  });

  it('should return an array with multiple images when there are multiple images', () => {
    const markdown = `
      This is some text with two images:
      ![alt text 1](image1.jpg)
      ![alt text 2](image2.jpg)
    `;
    expect(getImagePaths('/path/to', markdown)).toEqual([
      '/path/to/image1.jpg',
      '/path/to/image2.jpg',
    ]);
  });

  it('should return an array with images when there are images with different formats', () => {
    const markdown = `
      This is some text with images:
      ![alt text 1](image1.jpg)
      Some more text.
      ![alt text 2](image2.png)
      ## Title
      ![alt text 3](image3.gif)
    `;
    expect(getImagePaths('/path/to', markdown)).toEqual([
      '/path/to/image1.jpg',
      '/path/to/image2.png',
      '/path/to/image3.gif',
    ]);
  });

  it('should return an empty array if the only image is the cover from front matter', () => {
    const markdown = `
      ---
      title: Next.js + Expo monorepo with pnpm
      tags: [nextjs, expo, typescript, react-native]
      coverImage: cover.jpg
      ---

      ## Test
    `;
    expect(getImagePaths('/path/to/', markdown)).toEqual([]);
  });
});
