import 'dotenv/config';

import {
  createDevToArticle,
  createDevToArticle,
  createMediumArticle,
  uploadImage,
} from './fetchers';
import { getArticle, getCanonicalUrl, getImagePaths, getUrl, replaceImagePaths } from './utils';

const publish = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  const article = getArticle(path);
  const imagePaths = getImagePaths(path, article.content);

  await Promise.all([article.coverImagePath, ...imagePaths].map(uploadImage));

  const articleWithUploadedImages = {
    ...article,
    content: replaceImagePaths(getUrl(path), article.content),
  };

  // const slug = await createHashnodeArticle(articleWithUploadedImages);
  // // TODO: temporary for testing
  const slug = 'nextjs-expo-monorepo-with-pnpm';
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    await createDevToArticle({ ...articleWithUploadedImages, canonicalUrl }),
    await createMediumArticle({ ...articleWithUploadedImages, canonicalUrl }),
  ]);
};

await publish();
