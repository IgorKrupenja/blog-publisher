import 'dotenv/config';

import { createDevToArticle, createHashnodeArticle, createMediumArticle, uploadImage } from './api';
import { getArticle, getCanonicalUrl } from './utils';

const publish = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  const article = getArticle(path);

  await uploadImage(article.coverImagePath);
  const slug = await createHashnodeArticle(article);
  // TODO: temporary for testing
  // const slug = 'nextjs-expo-monorepo-with-pnpm';
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    await createDev ToArticle({ ...article, canonicalUrl }),
    await createMediumArticle({ ...article, canonicalUrl }),
  ]);
};

await publish();
