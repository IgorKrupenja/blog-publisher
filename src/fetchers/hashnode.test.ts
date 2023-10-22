import process from 'process';

import { describe, expect, it } from 'vitest';

import { Article, CreateHashnodeArticleResponse } from '../interfaces';

import { createHashnodeArticle, getCreateHashnodeArticleRequest } from '.';

describe('createHashnodeArticle', () => {
  const article: Article = {
    title: 'Test Article',
    content: 'This is a test article',
    tags: ['test'],
    coverImagePath: 'https://example.com/image.jpg',
  };

  //   beforeEach(() => {
  //     fetchMocker.resetMocks();
  //   });

  it('should create a new article on Hashnode', async () => {
    const slug = 'test-article';
    const responseJson: CreateHashnodeArticleResponse = {
      data: {
        createPublicationStory: {
          post: {
            slug,
          },
        },
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(responseJson));

    const result = await createHashnodeArticle(article);

    expect(result).toBe(slug);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://api.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.HASHNODE_TOKEN,
      },
      body: JSON.stringify(getCreateHashnodeArticleRequest(article)),
    });
  });

  //   it('should throw an error if there are errors in the response', async () => {
  //     const responseJson: CreateHashnodeArticleResponse = {
  //       errors: [
  //         {
  //           message: 'Error 1',
  //         },
  //         {
  //           message: 'Error 2',
  //         },
  //       ],
  //     };
  //     fetchMock.mockResponseOnce(JSON.stringify(responseJson));

  //     await expect(createHashnodeArticle(article)).rejects.toThrow('Hashnode: Error 1, Error 2');
  //   });
});
