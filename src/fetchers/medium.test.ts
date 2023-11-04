import { AnyFunction } from 'bun';
import { Mock, describe, expect, it, mock, spyOn } from 'bun:test';

import { Article, CreateMediumArticleRequest } from '../interfaces';
import * as markdownUtils from '../utils/markdown';
import { expectToHaveBeenCalledWith } from '../utils/test';

import * as medium from './medium';
import { createMediumArticle, getCreateMediumArticleRequest } from './medium';

describe('createMediumArticle', () => {
  const article: Required<Article> = {
    title: 'My Article',
    content: 'This is my article content',
    tags: ['tag1', 'tag2'],
    canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
    coverImagePath: '/path/to/cover/image.jpg',
  };

  it('should make a POST request to Medium API with correct parameters', async () => {
    const fetchSpy = spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => ({ status: 201 })) as Mock<AnyFunction>
    );
    const getCreateMediumArticleRequestSpy = spyOn(
      medium,
      'getCreateMediumArticleRequest'
    ).mockReturnValueOnce({} as CreateMediumArticleRequest);
    const consoleDebugSpy = spyOn(console, 'debug').mockImplementationOnce(() => {});

    await createMediumArticle(article);

    expectToHaveBeenCalledWith(
      fetchSpy,
      `https://api.medium.com/v1/users/${Bun.env.MEDIUM_AUTHOR_ID}/posts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Bun.env.MEDIUM_INTEGRATION_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Charset': 'utf-8',
        },
        body: JSON.stringify({}),
      }
    );
    expectToHaveBeenCalledWith(getCreateMediumArticleRequestSpy, article);
    expectToHaveBeenCalledWith(
      consoleDebugSpy,
      `Medium: published draft article '${article.title}'`
    );
  });

  it('should throw an error if the response status is not 201', () => {
    spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => ({ status: 400, statusText: 'Bad Request' })) as Mock<AnyFunction>
    );
    spyOn(medium, 'getCreateMediumArticleRequest').mockReturnValueOnce(
      {} as CreateMediumArticleRequest
    );

    expect(() => createMediumArticle(article)).toThrow('Medium: 400 Bad Request');
  });
});

describe('getCreateMediumArticleRequest', () => {
  it('should return correct request object', () => {
    const article: Required<Article> = {
      title: 'My Article',
      content: 'This is my article content',
      tags: ['tag-multi', 'tag2'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
      coverImagePath: '/path/to/cover/image.jpg',
    };
    const expectedRequest: CreateMediumArticleRequest = {
      title: 'My Article',
      contentFormat: 'markdown',
      content: `Canonical dummy![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content`,
      tags: ['tag multi', 'tag2'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
      publishStatus: 'draft',
      notifyFollowers: true,
    };

    const insertCoverImageSpy = spyOn(markdownUtils, 'insertCoverImage').mockReturnValueOnce(
      `![My Article Cover Image](https://blog.IgorKrpenja.com/path/to/cover/image.jpg)\n\nThis is my article content`
    );
    const insertCanonicalUrlSpy = spyOn(markdownUtils, 'insertCanonicalUrl').mockReturnValueOnce(
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
