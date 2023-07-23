import fetch from 'node-fetch';

import { Article } from '../interfaces/article.js';
import { CreateHashnodeArticleRequest } from '../interfaces/create-hashnode-article-request.js';
import { CreateHashnodeArticleResponse } from '../interfaces/create-hashnode-article-response.js';
import { getHashNodeTags } from '../utils/hashnode.js';
import { getCoverImageUrl } from '../utils/markdown.js';

export const publishArticleOnHashnode = async ({
  title,
  content,
  coverImagePath,
  tags,
}: Article): Promise<string> => {
  const { HASHNODE_PUBLICATION_ID, HASHNODE_TOKEN } = process.env;

  const hashNodeTags = getHashNodeTags(tags);

  if (hashNodeTags.length < 1 || hashNodeTags.length > 5)
    throw new Error('publishArticleOnHashnode: must have4 between 1 and 5 tags');

  const requestBody: CreateHashnodeArticleRequest = {
    query: `
          mutation createPublicationStory($input: CreateStoryInput!, $publicationId: String!) {
            createPublicationStory(input: $input, publicationId: $publicationId) {
              post { slug }
            }
          }
        `,
    variables: {
      publicationId: HASHNODE_PUBLICATION_ID,
      // TODO: disable this
      hideFromHashnodeFeed: true,
      input: {
        title,
        contentMarkdown: content,
        tags: hashNodeTags.map((tag) => ({ _id: tag.objectID })),
        isPartOfPublication: { publicationId: HASHNODE_PUBLICATION_ID },
        coverImageURL: getCoverImageUrl(coverImagePath),
      },
    },
  };

  const response = await fetch('https://api.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: HASHNODE_TOKEN,
    },
    body: JSON.stringify(requestBody),
  });
  const responseJson = (await response.json()) as CreateHashnodeArticleResponse;

  if (responseJson.errors && responseJson.errors.length > 0)
    throw Error(`Hashnode: ${responseJson.errors.map((error) => error.message).join(', ')}`);

  console.log(`Hashnode: published article '${title}'`);

  return responseJson.data.createPublicationStory.post.slug;
};
