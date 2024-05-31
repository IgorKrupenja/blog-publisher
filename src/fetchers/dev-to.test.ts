import { Mock, describe, expect, it, mock, spyOn } from 'bun:test';

import { Article, CreateDevToArticleRequest, CreateDevToArticleResponse } from '../interfaces';
import * as markdownUtil from '../utils/markdown';
import * as supabaseUtil from '../utils/supabase';

import * as devTo from './dev-to';
import { createDevToArticle, getCreateDevToArticleRequest } from './dev-to';

describe('createDevToArticle', () => {
  const mockArticle: Required<Article> = {
    title: 'Test Article',
    content: 'This is a test article.',
    coverImagePath: 'path/to/image.jpg',
    tags: ['test'],
    canonicalUrl: 'https://blog.IgorKrpenja.com/my-article',
  };

  it('should send a create article request to Dev.to', async () => {
    const fetchSpy = spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => {
        return { json: () => Promise.resolve({ status: 201 }) };
      }) as unknown as Mock<typeof fetch>
    );
    const getCreateDevToArticleRequestSpy = spyOn(
      devTo,
      'getCreateDevToArticleRequest'
    ).mockReturnValueOnce({} as CreateDevToArticleRequest);
    const consoleDebugSpy = spyOn(console, 'debug').mockImplementationOnce(() => {});

    await createDevToArticle(mockArticle);

    expect(fetchSpy).toHaveBeenCalledWith('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'api-key': Bun.env.DEV_TO_KEY,
        accept: 'application/vnd.forem.api-v1+json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    expect(getCreateDevToArticleRequestSpy).toHaveBeenCalledWith(mockArticle);
    expect(consoleDebugSpy).toHaveBeenCalledWith("Dev.to: published draft article 'Test Article'");
  });

  it('should throw an error if error response was received from Hashnode', () => {
    const mockResponse: CreateDevToArticleResponse = {
      status: 400,
      error: 'test error',
    };

    spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => {
        return { json: () => Promise.resolve(mockResponse) };
      }) as unknown as Mock<typeof fetch>
    );
    spyOn(devTo, 'getCreateDevToArticleRequest').mockReturnValueOnce(
      {} as CreateDevToArticleRequest
    );

    expect(() => createDevToArticle(mockArticle)).toThrow('Dev.to: 400 test error');
  });
});

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
    expect(insertCanonicalUrlSpy).toHaveBeenCalledWith(article.content, article.canonicalUrl);
    expect(getSupabaseUrlSpy).toHaveBeenCalledWith(article.coverImagePath);
  });
});
