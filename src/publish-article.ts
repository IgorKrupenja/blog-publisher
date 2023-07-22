import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import matter from 'gray-matter';
import mime from 'mime';
import fetch from 'node-fetch';

import { HASHNODE_TAGS } from './data/hashnode-tags.js';

const getArticle = (): Article => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  if (!path) throw new Error('No article path provided.');

  const files = fs.readdirSync(path);
  const markdownFile = files.find((file) => file.endsWith('.md'));

  if (!markdownFile) throw new Error('getArticle: No markdown file found in article path.');

  const fileContent = fs.readFileSync(`${path}/${markdownFile}`, 'utf-8');
  const parsedContent = matter(fileContent);
  const frontMatter = parsedContent.data as ArticleFrontMatter;

  if (!frontMatter.title) throw new Error('getArticle: No title found in article.');
  if (!frontMatter.tags) throw new Error('getArticle: No tags found in article.');
  if (!parsedContent.content.length) throw new Error('getArticle: No content found in article.');

  if (!frontMatter.coverImage) console.warn('getArticle: No cover image found in article.');

  return { frontMatter, ...parsedContent, coverImagePath: `${path}/${frontMatter.coverImage}` };
};

const uploadCoverImage = async ({ coverImagePath, frontMatter }: Article): Promise<void> => {
  if (!frontMatter.coverImage) return;

  const { SUPABASE_URL, SUPABASE_KEY, SUPABASE_STORAGE_BUCKET } = process.env;
  if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_STORAGE_BUCKET)
    throw new Error('uploadCoverImage: environment variables missing.');

  const file = fs.readFileSync(coverImagePath);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const { error } = await supabase.storage.from('images').upload(coverImagePath, file, {
    cacheControl: '604800',
    contentType: mime.getType(coverImagePath) ?? 'image/jpg',
  });

  if (error) throw new Error(`uploadCoverImage: ${JSON.stringify(error)}`);
  console.log(`uploadCoverImage: uploaded image '${coverImagePath}'`);
};

const publishArticle = async (): Promise<void> => {
  const article = getArticle();
  await Promise.all([
    uploadCoverImage(article),
    // TODO: Other platforms
    publishArticleOnHashnode(article),
  ]);
};

const publishArticleOnHashnode = async ({
  frontMatter,
  content,
  coverImagePath,
}: Article): Promise<void> => {
  if (!frontMatter.title || !frontMatter.tags) return;

  const { HASHNODE_PUBLICATION_ID, HASHNODE_TOKEN, SUPABASE_URL, SUPABASE_STORAGE_BUCKET } =
    process.env;
  if (!HASHNODE_PUBLICATION_ID || !HASHNODE_TOKEN)
    throw new Error('publishArticleOnHashnode: environment variables missing.');

  const hashNodeTags = frontMatter.tags.map((frontMatterTag) => {
    const hashNodeTag = HASHNODE_TAGS.find((t) => t.slug === frontMatterTag);
    if (hashNodeTag) return hashNodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });

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
      // todo disable this
      hideFromHashnodeFeed: true,
      input: {
        title: frontMatter.title,
        contentMarkdown: content,
        tags: hashNodeTags.map((tag) => ({ _id: tag.objectID })),
        isPartOfPublication: { publicationId: HASHNODE_PUBLICATION_ID },
        coverImageURL: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${coverImagePath}`,
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

  console.log(`publishArticleOnHashnode: published article '${frontMatter.title}'`);
};

interface Article {
  frontMatter: ArticleFrontMatter;
  content: string;
  coverImagePath: string;
}

interface ArticleFrontMatter {
  title?: string;
  tags?: string[];
  coverImage?: string;
}

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

await publishArticle();
