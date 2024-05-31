import { getNewArticlePaths } from './utils/file';
import { publishArticle } from './utils/publish';

export const publishArticles = async (): Promise<void> => {
  const paths = getNewArticlePaths();

  if (!paths.length) {
    console.debug('publishArticles: No new articles to publish.');
    return;
  }

  await Promise.all(paths.map((path) => publishArticle(path)));
};

await publishArticles();
