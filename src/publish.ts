import 'dotenv/config';

import { createDevToArticle, createMediumArticle, uploadImage } from './fetchers';
import {
  getArticle,
  getCanonicalUrl,
  getMarkdownImagePaths,
  getSupabaseUrl,
  replaceMarkdownImagePaths,
} from './utils';

const publishArticle = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  const article = getArticle(path);
  const imagePaths = getMarkdownImagePaths(path, article.content);

  await Promise.all([article.coverImagePath, ...imagePaths].map(uploadImage));

  const articleWithUploadedImages = {
    ...article,
    content: replaceMarkdownImagePaths(getSupabaseUrl(path), article.content),
  };

  // TODO: temporary for testing
  // const slug = await createHashnodeArticle(articleWithUploadedImages);
  const slug = 'nextjs-expo-monorepo-with-pnpm';
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    createDevToArticle({ ...articleWithUploadedImages, canonicalUrl }),
    createMediumArticle({ ...articleWithUploadedImages, canonicalUrl }),
  ]);
};

await publishArticle();
