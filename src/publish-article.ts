import 'dotenv/config';

import {
  publishArticleOnDevTo,
  publishArticleOnHashnode,
  publishArticleOnMedium,
  uploadCoverImage,
} from './api/index.js';
import { getArticle, getCanonicalUrl } from './utils/index.js';

const publishArticle = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  const article = getArticle(path);

  await uploadCoverImage(article.coverImagePath);
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

await publishArticle();
