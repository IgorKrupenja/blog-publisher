import { getNewArticlePaths } from './utils/file';
import { publishArticle } from './utils/publish';

export const publishArticles = async (): Promise<void> => {
  const paths = getNewArticlePaths();

  console.log(paths);

  if (!paths.length) {
    console.debug('publishArticles: No new articles to publish.');
    return;
  }

  console.log('new are there');

  await Promise.all(paths.map((path) => publishArticle(path)));

  console.log('published');
};

await publishArticles();
