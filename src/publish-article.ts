import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import matter from 'gray-matter';
import mime from 'mime';
import fetch from 'node-fetch';

import { HASHNODE_TAGS } from './data/hashnode-tags.js';

const publishArticle = async (): Promise<void> => {
  const article = getArticle();
  // await uploadCoverImage(article);
  const slug = await publishArticleOnHashnode(article);
  const canonicalUrl = getCanonicalUrl(slug);
  console.log(canonicalUrl);

  // TODO: Other platforms
  // await Promise.allSettled([
  // ]);
};

const getArticle = (): Article => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  if (!path) throw new Error('No article path provided.');

  const markdown = fs.readdirSync(path).find((file) => file.endsWith('.md'));

  if (!markdown) throw new Error('getArticle: No markdown file found in article path.');

  const parsedContent = matter(fs.readFileSync(`${path}/${markdown}`, 'utf-8'));
  const frontMatter = parsedContent.data as ArticleFrontMatter;

  if (!frontMatter.title) throw new Error('getArticle: No title found in article.');
  if (!frontMatter.tags) throw new Error('getArticle: No tags found in article.');
  if (!frontMatter.coverImage) throw new Error('getArticle: No cover image found in article.');
  if (!parsedContent.content.length) throw new Error('getArticle: No content found in article.');

  return {
    ...(frontMatter as Required<ArticleFrontMatter>),
    ...parsedContent,
    coverImagePath: `${path}/${frontMatter.coverImage}`,
  };
};

const uploadCoverImage = async ({ coverImagePath }: Article): Promise<void> => {
  const { SUPABASE_URL, SUPABASE_KEY, SUPABASE_STORAGE_BUCKET } = process.env;

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(coverImagePath, fs.readFileSync(coverImagePath), {
      cacheControl: '604800',
      contentType: mime.getType(coverImagePath) ?? 'image/jpg',
    });

  if (error) throw new Error(`uploadCoverImage: ${JSON.stringify(error)}`);
  console.log(`uploadCoverImage: uploaded image '${coverImagePath}'`);
};

const publishArticleOnHashnode = async ({
  title,
  content,
  coverImagePath,
  tags,
}: Required<Article>): Promise<string> => {
  const { HASHNODE_PUBLICATION_ID, HASHNODE_TOKEN, SUPABASE_URL, SUPABASE_STORAGE_BUCKET } =
    process.env;

  const hashNodeTags = tags.map((frontMatterTag) => {
    const hashNodeTag = HASHNODE_TAGS.find((tag) => tag.slug === frontMatterTag);
    if (hashNodeTag) return hashNodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });

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
      // todo disable this
      hideFromHashnodeFeed: true,
      input: {
        title,
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
  const responseJson = (await response.json()) as CreateHashnodeArticleResponse;

  if (responseJson.errors && responseJson.errors.length > 0)
    throw Error(responseJson.errors.map((error) => error.message).join(', '));

  console.log(`publishArticleOnHashnode: published article '${title}'`);

  return responseJson.data.createPublicationStory.post.slug;
};

const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
};

const getCanonicalUrlText = (url: string): string => {
  return `*This article was originally published on [${url}](${url}).*`;
};

interface Article {
  title: string;
  content: string;
  coverImagePath: string;
  tags: string[];
  // todo unused?
  // coverImage: string;
}

interface ArticleFrontMatter {
  title?: string;
  tags?: string[];
  coverImage?: string;
}

interface CreateHashnodeArticleRequest {
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

interface CreateHashnodeArticleResponse {
  data: {
    createPublicationStory: {
      // code: string;
      // success: boolean;
      // message: string;
      post: { slug: string };
    };
  };
  errors: { message: string }[];
}

interface CreateDevToArticleRequest {
  title: string;
  body_markdown: string;
  published: boolean;
  main_image?: string;
  canonical_url?: string;
  description: string;
  tags: string[];
  // organization_id?: number;
}

await publishArticle();
