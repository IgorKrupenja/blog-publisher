import { beforeAll, describe, expect, it } from 'bun:test';

import { PartialArticleFrontMatter } from '../interfaces';
import { getArticleFileString, getNewArticlePaths } from '../utils/file';
import { getArticleFrontMatter } from '../utils/markdown';

describe('articles', () => {
  let articles: { path: string; frontMatter: PartialArticleFrontMatter }[] = [];

  beforeAll(async () => {
    const paths = getNewArticlePaths();
    articles = await Promise.all(
      paths.map(async (path) => {
        return {
          path,
          frontMatter: getArticleFrontMatter(await getArticleFileString(path)),
        };
      })
    );
  });

  it('should should have frontmatter with title, tags and cover image', () => {
    articles.forEach(({ frontMatter }) => {
      expect(frontMatter).toBeDefined();
      expect(frontMatter).toHaveProperty('title');
      expect(frontMatter).toHaveProperty('tags');
      expect(frontMatter).toHaveProperty('coverImage');
    });
  });

  it('should have a valid cover image file', () => {
    const articlePath = 'src/articles/2021/01/01-article.md';
    articles.forEach((frontMatter) => {
      // expect
      // expect(frontMatter.coverImage).toBeDefined();
      // expect(frontMatter.coverImage).toMatch(/\/images\/articles\/.*\.(jpg|png)/);
    });
  });
});
