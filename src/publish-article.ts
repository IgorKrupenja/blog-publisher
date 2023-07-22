import 'dotenv/config';

import fs from 'fs';
import matter from 'gray-matter';
import fetch from 'node-fetch';

import { HASHNODE_TAGS } from './data/hashnode-tags.js';
import { HashnodeTag } from './interfaces/hashnode-tag.js';

const getArticle = (): Article => {
  // E.g. articles/2023/nextjs-expo-monorepo.md
  const articlePath = process.argv[2];
  if (!articlePath) throw new Error('No article path provided.');

  const fileContent = fs.readFileSync(articlePath, 'utf-8');
  const parsedContent = matter(fileContent);
  const frontMatter = parsedContent.data as ArticleFrontMatter;

  if (!frontMatter.title) throw new Error('getArticle: No title found in article.');
  if (!frontMatter.tags) throw new Error('getArticle: No tags found in article.');
  if (!parsedContent.content.length) throw new Error('getArticle: No content found in article.');

  if (!frontMatter.coverImageURL) console.warn('getArticle: No cover image found in article.');

  return { frontMatter, ...parsedContent };
};

const publishArticle = async (article: Article): Promise<void> => {
  await Promise.all([publishArticleOnHashnode(article)]);
};

const publishArticleOnHashnode = async ({ frontMatter, content }: Article): Promise<void> => {
  if (!frontMatter.title || !frontMatter.tags) return;

  const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;
  const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;

  if (!HASHNODE_PUBLICATION_ID || !HASHNODE_TOKEN)
    throw new Error('publishArticleOnHashnode: environment variables missing.');

  const hashNodeTags = frontMatter.tags.reduce((tags, frontMatterTag) => {
    const hashNodeTag = HASHNODE_TAGS.find((t) => t.slug === frontMatterTag);
    if (hashNodeTag) return [hashNodeTag, ...tags];
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  }, [] as HashnodeTag[]);

  const requestBody: HashnodeCreatePublicationStoryRequestBody = {
    query: `
        mutation createPublicationStory($input: CreateStoryInput!, $publicationId: String!) {
          createPublicationStory(input: $input, publicationId: $publicationId) {
            code,
            success,
            message
          }
        }
      `,
    variables: {
      publicationId: HASHNODE_PUBLICATION_ID,
      //   hideFromHashnodeFeed: true,
      input: {
        title: frontMatter.title,
        contentMarkdown: content,
        tags: hashNodeTags.map((tag) => ({ _id: tag.objectID })),
        isPartOfPublication: { publicationId: HASHNODE_PUBLICATION_ID },
        coverImageURL: frontMatter.coverImageURL,
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
  const responseBody = (await response.json()) as HashnodeCreatePublicationStoryResponse;

  if (responseBody.errors && responseBody.errors.length > 0)
    throw Error(responseBody.errors.map((e) => e.message).join(', '));

  console.log(`Hashnode: published article '${frontMatter.title}'`);
};

interface HashnodeCreatePublicationStoryRequestBody {
  query: string;
  variables: {
    publicationId: string;
    hideFromHashnodeFeed?: boolean;
    input: {
      title: string;
      contentMarkdown: string;
      tags: { _id: string }[];
      isPartOfPublication: { publicationId: string };
      coverImageURL?: string;
    };
  };
}

interface Article {
  frontMatter: ArticleFrontMatter;
  content: string;
}

interface ArticleFrontMatter {
  title?: string;
  tags?: string[];
  coverImageURL?: string;
}

interface HashnodeCreatePublicationStoryResponse {
  data: {
    createPublicationStory: {
      code: string;
      success: boolean;
      message: string;
    };
  };
  errors: { message: string }[];
}

await publishArticle(getArticle());
// console.log(getArticle());
