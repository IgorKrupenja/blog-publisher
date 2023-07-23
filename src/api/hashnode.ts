import fetch from 'node-fetch';
import { title } from 'process';

import { HASHNODE_TAGS } from '../data/index.js';
import { Article } from '../interfaces/article.js';
import { CreateHashnodeArticleRequest } from '../interfaces/create-hashnode-article-request.js';
import { CreateHashnodeArticleResponse } from '../interfaces/create-hashnode-article-response.js';
import { HashnodeTag } from '../interfaces/index.js';
import { getCoverImageUrl } from '../utils/markdown.js';

export const publishArticleOnHashnode = async (article: Article): Promise<string> => {
  const hashNodeTags = getHashnodeTags(article.tags);

  const response = await fetch('https://api.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.HASHNODE_TOKEN,
    },
    body: JSON.stringify(getCreateHashnodeArticleRequest(article, hashNodeTags)),
  });
  const responseJson = (await response.json()) as CreateHashnodeArticleResponse;

  if (responseJson.errors && responseJson.errors.length > 0)
    throw Error(`Hashnode: ${responseJson.errors.map((error) => error.message).join(', ')}`);

  console.log(`Hashnode: published article '${title}'`);

  return responseJson.data.createPublicationStory.post.slug;
};

const getHashnodeTags = (tags: string[]): HashnodeTag[] => {
  const hashNodeTags = tags.map((frontMatterTag) => {
    const hashNodeTag = HASHNODE_TAGS.find((tag) => tag.slug === frontMatterTag);
    if (hashNodeTag) return hashNodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });

  if (hashNodeTags.length < 1 || hashNodeTags.length > 5)
    throw new Error('publishArticleOnHashnode: must have4 between 1 and 5 tags');

  return hashNodeTags;
};

const getCreateHashnodeArticleRequest = (
  { title, content, coverImagePath }: Article,
  hashnodeTags: HashnodeTag[]
): CreateHashnodeArticleRequest => {
  const { HASHNODE_PUBLICATION_ID } = process.env;

  return {
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
        tags: hashnodeTags.map((tag) => ({ _id: tag.objectID })),
        isPartOfPublication: { publicationId: HASHNODE_PUBLICATION_ID },
        coverImageURL: getCoverImageUrl(coverImagePath),
      },
    },
  };
};
