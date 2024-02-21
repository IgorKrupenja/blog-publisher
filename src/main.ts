import { publishArticle } from './utils/publish';

export const publishArticles = async (): Promise<void> => {
  const paths = ['src/articles/2024/02-nextjs-expo-monorepo/nextjs-expo-monorepo.md'];
  if (!paths.length) {
    console.debug('publishArticles: No new articles to publish.');
    return;
  }

  await Promise.all(paths.map((path) => publishArticle(path)));
};

await publishArticles();
