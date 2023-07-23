import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import matter from 'gray-matter';
import mime from 'mime';
import fetch from 'node-fetch';

import { HASHNODE_TAGS } from './data/hashnode-tags.js';
import { CreateDevToArticleRequest } from './interfaces/create-dev-to-article-request.js';
import { CreateDevToArticleResponse } from './interfaces/create-dev-to-article-response.js';

const publishArticle = async (): Promise<void> => {
  const article = getArticle();
  await uploadCoverImage(article);
  const slug = await publishArticleOnHashnode(article);
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    await publishArticleOnDevTo({ ...article, canonicalUrl }),
    await publishArticleOnMedium({ ...article, canonicalUrl }),

    // TODO: temporary for testing
    // await publishArticleOnDevTo({
    //   ...article,
    //   canonicalUrl: 'https://blog.igorkrupenja.com/nextjs-expo-monorepo-with-pnpm',
    // });
    // publishArticleOnMedium({
    //   ...article,
    //   canonicalUrl: 'https://blog.igorkrupenja.com/nextjs-expo-monorepo-with-pnpm',
    // }),
  ]);
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
}: Article): Promise<string> => {
  const { HASHNODE_PUBLICATION_ID, HASHNODE_TOKEN } = process.env;

  const hashNodeTags = tags.map((frontMatterTag) => {
    const hashNodeTag = HASHNODE_TAGS.find((tag) => tag.slug === frontMatterTag);
    if (hashNodeTag) return hashNodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });

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

const publishArticleOnDevTo = async ({
  content,
  canonicalUrl,
  coverImagePath,
  tags,
  title,
}: Required<Article>): Promise<void> => {
  if (tags.length > 4)
    console.warn('publishArticleOnDevTo: more than 4 tags, publishing only first 4');

  const requestBody: CreateDevToArticleRequest = {
    title,
    body_markdown: insertCanonicalUrlText(content, canonicalUrl),
    published: false,
    main_image: getCoverImageUrl(coverImagePath),
    canonical_url: canonicalUrl,
    tags: tags.map((tag) => tag.replace(/-/g, '')).slice(0, 4),
  };

  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': process.env.DEV_TO_KEY,
      accept: 'application/vnd.forem.api-v1+json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ article: requestBody }),
  });
  const responseJson = (await response.json()) as CreateDevToArticleResponse;

  if (responseJson.error) throw new Error(`Dev.to: ${responseJson.status} ${responseJson.error}`);

  console.log(`Dev.to: published draft article '${title}'`);
};

const publishArticleOnMedium = async ({
  title,
  content,
  tags,
  canonicalUrl,
  coverImagePath,
}: Required<Article>): Promise<void> => {
  const requestBody: CreateMediumArticleRequest = {
    title,
    contentFormat: 'markdown',
    content: insertCanonicalUrlText(insertCoverImage(title, content, coverImagePath), canonicalUrl),
    tags: tags.map((tag) => tag.replace(/-/g, ' ')),
    canonicalUrl,
    publishStatus: 'draft',
    notifyFollowers: true,
  };

  const response = await fetch(
    `https://api.medium.com/v1/users/${process.env.MEDIUM_AUTHOR_ID}/posts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MEDIUM_INTEGRATION_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (response.status !== 201) throw Error(`Medium: ${response.status} ${response.statusText}`);

  console.log(`Medium: published draft article '${title}'`);
};

interface CreateMediumArticleRequest {
  title: string;
  contentFormat: 'markdown' | 'html';
  content: string;
  tags?: string[];
  canonicalUrl?: string;
  publishStatus?: 'draft' | 'public' | 'unlisted';
  notifyFollowers?: boolean;
}

const getCoverImageUrl = (coverImagePath: string): string => {
  const { SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = process.env;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${coverImagePath}`;
};

const insertCoverImage = (title: string, markdown: string, coverImagePath: string): string => {
  const string = `\n![${title}](${getCoverImageUrl(coverImagePath)})\n`;
  return `${string}${markdown}`;
};

const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
};

const insertCanonicalUrlText = (markdown: string, url: string): string => {
  const string = `\n*This article was originally published on [my blog](${url}).*\n`;
  return `${string}${markdown}`;
};

interface Article {
  title: string;
  content: string;
  coverImagePath: string;
  tags: string[];
  canonicalUrl?: string;
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
      post: { slug: string };
    };
  };
  errors?: { message: string }[];
}

await publishArticle();
