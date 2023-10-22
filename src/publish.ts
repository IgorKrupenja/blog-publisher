import 'dotenv/config';

import { createDevToArticle, createMediumArticle, uploadImage } from './fetchers';
import {
  getArticleFile,
  getCanonicalUrl,
  getMarkdownImagePaths,
  getSupabaseUrl,
  replaceMarkdownImagePaths,
} from './utils';

const publishArticle = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  const articleFile = getArticleFile(path);
  const imagePaths = getMarkdownImagePaths(path, articleFile.content);

  await Promise.all([articleFile.coverImagePath, ...imagePaths].map(uploadImage));

  const articleWithUploadedImages = {
    ...articleFile,
    content: replaceMarkdownImagePaths(getSupabaseUrl(path), articleFile.content),
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
