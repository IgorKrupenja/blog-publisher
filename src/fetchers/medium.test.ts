import { describe, expect, it, spyOn } from 'bun:test';

import { Article, CreateMediumArticleRequest } from '../interfaces';
import * as markdown from '../utils/markdown';
import { expectToHaveBeenCalledWith } from '../utils/test';

import { getCreateMediumArticleRequest } from './medium';

describe('getCreateMediumArticleRequest', () => {
  it('should return correct request object', () => {
    const article: Required<Article> = {
      title: 'My Article',
      content: 'This is my article content',
      tags: ['tag1', 'tag2'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
      coverImagePath: '/path/to/cover/image.jpg',
    };
    const expectedRequest: CreateMediumArticleRequest = {
      title: 'My Article',
      contentFormat: 'markdown',
      content: `Canonical dummy![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content`,
      tags: ['tag1', 'tag2'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
      publishStatus: 'draft',
      notifyFollowers: true,
    };

    const insertCoverImageSpy = spyOn(markdown, 'insertCoverImage').mockReturnValueOnce(
      `![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content`
    );
    const insertCanonicalUrlSpy = spyOn(markdown, 'insertCanonicalUrl').mockReturnValueOnce(
      `Canonical dummy![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content`
    );

    const actualRequest = getCreateMediumArticleRequest(article);

    expect(actualRequest).toEqual(expectedRequest);
    expectToHaveBeenCalledWith(
      insertCoverImageSpy,
      article.title,
      article.content,
      article.coverImagePath
    );
    expectToHaveBeenCalledWith(
      insertCanonicalUrlSpy,
      `![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content`,
      article.canonicalUrl
    );
  });
});
