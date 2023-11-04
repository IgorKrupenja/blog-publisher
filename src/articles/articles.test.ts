import { beforeAll, describe, expect, it } from 'bun:test';

import { ArticleFrontMatter } from '../interfaces';
import { getArticleFileString, getNewArticlePaths } from '../utils/file';
import { getArticleFrontMatter } from '../utils/markdown';

describe('articles', () => {
  let articleFrontMatter: ArticleFrontMatter[] = [];

  beforeAll(async () => {
    const paths = getNewArticlePaths();
    console.log('paths', paths);

    articleFrontMatter = await Promise.all(
      paths.map(async (path) => getArticleFrontMatter(await getArticleFileString(path)))
    );
  });

  it.only('should should have frontmatter with title, tags and cover image', () => {
    articleFrontMatter.forEach((frontMatter) => {
      //   console.log(frontMatter);
      expect(frontMatter).toBeDefined();
      expect(frontMatter).toHaveProperty('title');
      expect(frontMatter).toHaveProperty('tags');
      expect(frontMatter).toHaveProperty('coverImage');
    });
  });
});
