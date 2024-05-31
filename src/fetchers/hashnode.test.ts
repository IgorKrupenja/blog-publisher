import { AnyFunction } from 'bun';
import { Mock, describe, expect, it, mock, spyOn } from 'bun:test';

import {
  Article,
  CreateHashnodeArticleRequest,
  CreateHashnodeArticleResponse,
} from '../interfaces';
import * as supabaseUtil from '../utils/supabase';

import * as hashnode from './hashnode';
import {
  createHashnodeArticle,
  getCreateHashnodeArticleRequest,
  getHashnodeTags,
} from './hashnode';

describe('createHashnodeArticle', () => {
  it('should send a create article request to Hashnode and return slug', async () => {
    const mockArticle: Article = {
      title: 'Test Article',
      content: 'This is a test article.',
      coverImagePath: 'path/to/image.jpg',
      tags: ['test'],
    };
    const mockResponse: CreateHashnodeArticleResponse = {
      data: {
        publishPost: {
          post: {
            slug: 'test-article',
          },
        },
      },
    };

    const fetchSpy = spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => {
        return { json: () => Promise.resolve(mockResponse) };
      }) as Mock<AnyFunction>
    );
    const getCreateHashnodeArticleRequestSpy = spyOn(
      hashnode,
      'getCreateHashnodeArticleRequest'
    ).mockReturnValueOnce({} as CreateHashnodeArticleRequest);
    const consoleDebugSpy = spyOn(console, 'debug').mockImplementationOnce(() => {});

    const slug = await createHashnodeArticle(mockArticle);

    expect(fetchSpy).toHaveBeenCalledWith('https://gql.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Bun.env.HASHNODE_TOKEN,
      },
      body: JSON.stringify({}),
    });
    expect(slug).toBe('test-article');
    expect(getCreateHashnodeArticleRequestSpy).toHaveBeenCalledWith(mockArticle);
    expect(consoleDebugSpy).toHaveBeenCalledWith("Hashnode: published article 'Test Article'");
  });

  it('should throw an error if error response was received from Hashnode', () => {
    const mockArticle: Article = {
      title: 'Test Article',
      content: 'This is a test article.',
      coverImagePath: 'path/to/image.jpg',
      tags: ['test'],
    };
    const mockResponse: CreateHashnodeArticleResponse = {
      errors: [{ message: 'test error' }],
    };

    spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => {
        return { json: () => Promise.resolve(mockResponse) };
      }) as Mock<AnyFunction>
    );
    spyOn(hashnode, 'getCreateHashnodeArticleRequest').mockReturnValueOnce(
      {} as CreateHashnodeArticleRequest
    );

    expect(() => createHashnodeArticle(mockArticle)).toThrow('Hashnode: test error');
  });

  it('should throw an error if no data and no error was received from Hashnode', () => {
    const mockArticle: Article = {
      title: 'Test Article',
      content: 'This is a test article.',
      coverImagePath: 'path/to/image.jpg',
      tags: ['test'],
    };
    const mockResponse: CreateHashnodeArticleResponse = {};

    spyOn(global, 'fetch').mockImplementationOnce(
      mock(() => {
        return { json: () => Promise.resolve(mockResponse) };
      }) as Mock<AnyFunction>
    );
    spyOn(hashnode, 'getCreateHashnodeArticleRequest').mockReturnValueOnce(
      {} as CreateHashnodeArticleRequest
    );

    expect(async () => createHashnodeArticle(mockArticle)).toThrow(
      'Hashnode: no response data or errors received. Check if the article was published.'
    );
  });
});

describe('getCreateHashnodeArticleRequest', () => {
  it('should return the correct request object', () => {
    const article = {
      title: 'Test Article',
      content: 'This is a test article.',
      coverImagePath: 'path/to/image.jpg',
      tags: ['test'],
    };

    const expectedRequest = {
      query: `#graphql
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post { slug }
          }
        }
      `,
      variables: {
        input: {
          publicationId: Bun.env.HASHNODE_PUBLICATION_ID,
          title: article.title,
          contentMarkdown: article.content,
          tags: [
            {
              id: 'dummy',
            },
          ],
          coverImageOptions: {
            coverImageURL:
              'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg',
          },
        },
      },
    };

    spyOn(supabaseUtil, 'getSupabaseUrl').mockReturnValueOnce(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg'
    );
    spyOn(hashnode, 'getHashnodeTags').mockReturnValueOnce([
      {
        name: 'test',
        slug: 'test',
        objectID: 'dummy',
      },
    ]);

    const request = getCreateHashnodeArticleRequest(article);

    expect(request).toEqual(expectedRequest);
  });
});

describe('getHashnodeTags', () => {
  it('should return an array of Hashnode tags', () => {
    const frontMatterTags = ['test', 'tensorflow'];
    const expectedHashnodeTags = [
      { name: 'test', slug: 'test', objectID: '56744722958ef13879b951d6' },
      { name: 'tensorflow', slug: 'tensorflow', objectID: '56744722958ef13879b9518a' },
    ];

    const hashnodeTags = getHashnodeTags(frontMatterTags);

    expect(hashnodeTags).toEqual(expectedHashnodeTags);
  });

  it('should throw an error if an invalid tag is provided', () => {
    const frontMatterTags = ['test', 'invalid', 'hashnode'];

    expect(() => getHashnodeTags(frontMatterTags)).toThrow(
      'publishArticleOnHashnode: invalid tag: invalid'
    );
  });

  it('should throw an error if less than 1 tag is provided', () => {
    const frontMatterTags: string[] = [];

    expect(() => getHashnodeTags(frontMatterTags)).toThrow(
      'publishArticleOnHashnode: must have between 1 and 5 tags'
    );
  });

  it('should throw an error if more than 5 tags are provided', () => {
    const frontMatterTags = [
      'test',
      'hashnode',
      'javascript',
      'typescript',
      'tensorflow',
      'nodejs',
    ];

    expect(() => getHashnodeTags(frontMatterTags)).toThrow(
      'publishArticleOnHashnode: must have between 1 and 5 tags'
    );
  });
});
