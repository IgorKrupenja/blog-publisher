import { AnyFunction } from 'bun';
import { Mock, describe, expect, it, mock, spyOn } from 'bun:test';

import * as supabase from '../utils/supabase';
import { expectToHaveBeenCalledWith } from '../utils/test';

import * as hashnode from './hashnode';
import { createHashnodeArticle, getCreateHashnodeArticleRequest } from './hashnode';

describe('createHashnodeArticle', () => {
  it.todo('should create an article on Hashnode', async () => {
    const mockArticle = {
      title: 'Test Article',
      content: 'This is a test article.',
      coverImage: 'image.jpg',
      coverImagePath: 'path/to/image.jpg',
      tags: ['test'],
    };

    const mockResponse = {
      data: {
        createPublicationStory: {
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

    const slug = await createHashnodeArticle(mockArticle);

    expectToHaveBeenCalledWith(fetchSpy, 'https://api.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Bun.env.HASHNODE_TOKEN,
      },
      //   todo mock this crap?
      body: {
        query: JSON.stringify(
          `#graphql
        mutation CreatePublicationStory($input: CreateStoryInput!, $publicationId: String!) {
          createPublicationStory(input: $input, publicationId: $publicationId) {
            post { slug }
          }
        }
        `
        ),
        variables: JSON.stringify({
          publicationId: Bun.env.HASHNODE_PUBLICATION_ID,
          hideFromHashnodeFeed: false,
          input: {
            title: mockArticle.title,
            contentMarkdown: mockArticle.content,
            coverImage: mockArticle.coverImage,
            tags: mockArticle.tags,
          },
        }),
      },
    });
    expect(slug).toBe('test-article');
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

    spyOn(supabase, 'getSupabaseUrl').mockReturnValueOnce(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg'
    );
    spyOn(hashnode, 'getHashnodeTags').mockReturnValueOnce([
      {
        name: 'test',
        slug: 'test',
        objectID: 'dummy',
      },
    ]);

    const expectedRequest = {
      query: `#graphql
        mutation createPublicationStory($input: CreateStoryInput!, $publicationId: String!) {
          createPublicationStory(input: $input, publicationId: $publicationId) {
            post { slug }
          }
        }
      `,
      variables: {
        publicationId: Bun.env.HASHNODE_PUBLICATION_ID,
        hideFromHashnodeFeed: false,
        input: {
          title: article.title,
          contentMarkdown: article.content,
          // todo wtf?
          tags: [
            {
              _id: 'dummy',
            },
          ],
          isPartOfPublication: { publicationId: Bun.env.HASHNODE_PUBLICATION_ID },
          coverImageURL:
            'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg',
        },
      },
    };

    const request = getCreateHashnodeArticleRequest(article);

    console.log(JSON.stringify(request));
    console.log();
    console.log(JSON.stringify(expectedRequest));

    expect(request).toEqual(expectedRequest);
  });
});
