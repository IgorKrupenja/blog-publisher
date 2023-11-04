import { describe, expect, it, spyOn } from 'bun:test';

import { Article } from '../interfaces';
import * as markdownUtil from '../utils/markdown';
import * as supabaseUtil from '../utils/supabase';
import { expectToHaveBeenCalledWith } from '../utils/test';

import { getCreateDevToArticleRequest } from './dev-to';

describe('getCreateDevToArticleRequest', () => {
  it('should return correct request object', () => {
    const article: Required<Article> = {
      title: 'My Article',
      content: 'This is my article content',
      tags: ['tag1', 'tag2'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
      coverImagePath: '/path/to/cover/image.jpg',
    };
    const expectedRequest = {
      article: {
        title: article.title,
        body_markdown:
          'Canonical dummy![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content',
        published: false,
        main_image:
          'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg',
        canonical_url: article.canonicalUrl,
        tags: ['tag1', 'tag2'],
      },
    };

    const insertCanonicalUrlSpy = spyOn(markdownUtil, 'insertCanonicalUrl').mockReturnValueOnce(
      'Canonical dummy![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content'
    );
    const getSupabaseUrlSpy = spyOn(supabaseUtil, 'getSupabaseUrl').mockReturnValueOnce(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg'
    );

    const actualRequest = getCreateDevToArticleRequest(article);

    expect(actualRequest).toEqual(expectedRequest);
    expectToHaveBeenCalledWith(insertCanonicalUrlSpy, article.content, article.canonicalUrl);
    expectToHaveBeenCalledWith(getSupabaseUrlSpy, article.coverImagePath);
  });
});
