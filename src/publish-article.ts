import 'dotenv/config';

import {
  createDevToArticle,
  createHashnodeArticle,
  createMediumArticle,
  uploadImage,
} from './api/index.js';
import { getArticle, getCanonicalUrl } from './utils/index.js';

const publishArticle = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  const article = getArticle(path);

  await uploadImage(article.coverImagePath);
  const slug = await createHashnodeArticle(article);
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    await createDevToArticle({ ...article, canonicalUrl }),
    await createMediumArticle({ ...article, canonicalUrl }),

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

await publishArticle();
