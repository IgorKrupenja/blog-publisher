import { HASHNODE_TAGS } from '../data/hashnode-tags';
import {
  Article,
  CreateHashnodeArticleRequest,
  CreateHashnodeArticleResponse,
  HashnodeTag,
} from '../interfaces';
import { getSupabaseUrl } from '../utils/supabase';

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

  if (!responseJson.data)
    throw Error(
      'Hashnode: no response data or errors received. Check if the article was published.'
    );

  console.debug(`Hashnode: published article '${article.title}'`);

  return responseJson.data.createPublicationStory.post.slug;
};

export const getCreateHashnodeArticleRequest = ({
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
      hideFromHashnodeFeed: false,
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

export const getHashnodeTags = (tags: string[]): HashnodeTag[] => {
  const hashnodeTags = tags.map((frontMatterTag) => {
    const hashnodeTag = HASHNODE_TAGS.find((tag) => tag.slug === frontMatterTag);
    if (hashnodeTag) return hashnodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });

  if (hashnodeTags.length < 1 || hashnodeTags.length > 5)
    throw new Error('publishArticleOnHashnode: must have between 1 and 5 tags');

  return hashnodeTags;
};
