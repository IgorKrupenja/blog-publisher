import 'dotenv/config';

import { getNewArticlePaths } from './utils';
import { publishArticle } from './utils/publish';

export const publishArticles = async (): Promise<void> => {
  await Promise.all(getNewArticlePaths().map((path) => publishArticle(path)));
};

await publishArticles();
