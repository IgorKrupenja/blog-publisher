import fetch from 'node-fetch';

import { HASHNODE_TAGS } from '../data';
import {
  Article,
  CreateHashnodeArticleRequest,
  CreateHashnodeArticleResponse,
  HashnodeTag,
} from '../interfaces';
import { getSupabaseUrl } from '../utils';

export const createHashnodeArticle = async (article: Article): Promise<string> => {
  const response = await fetch('https://api.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Bun.env.HASHNODE_TOKEN,
    },
    body: JSON.stringify(getCreateHashnodeArticleRequest(article)),
  });
  const responseJson = (await response.json()) as CreateHashnodeArticleResponse;

  if (responseJson.errors && responseJson.errors.length > 0)
    throw Error(`Hashnode: ${responseJson.errors.map((error) => error.message).join(', ')}`);

  console.log(`Hashnode: published article '${article.title}'`);

  return responseJson.data.createPublicationStory.post.slug;
};

const getCreateHashnodeArticleRequest = ({
  title,
  content,
  coverImagePath,
  tags,
}: Article): CreateHashnodeArticleRequest => {
  const { HASHNODE_PUBLICATION_ID } = Bun.env;

  const hashnodeTags = getHashnodeTags(tags);

  return {
    query: `#graphql
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
        coverImageURL: getSupabaseUrl(coverImagePath),
      },
    },
  };
};

const getHashnodeTags = (tags: string[]): HashnodeTag[] => {
  const hashnodeTags = tags.map((frontMatterTag) => {
    const hashnodeTag = HASHNODE_TAGS.find((tag) => tag.slug === frontMatterTag);
    if (hashnodeTag) return hashnodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });

  if (hashnodeTags.length < 1 || hashnodeTags.length > 5)
    throw new Error('publishArticleOnHashnode: must have between 1 and 5 tags');

  return hashnodeTags;
};
