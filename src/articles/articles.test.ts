import { beforeAll, describe, expect, it } from 'bun:test';

import { PartialArticleFrontMatter } from '../interfaces';
import { getArticleFileString, getNewArticlePaths } from '../utils/file';
import { getArticleFrontMatter } from '../utils/markdown';

describe('articles', () => {
  let articlesFrontMatter: PartialArticleFrontMatter[] = [];

  beforeAll(async () => {
    const paths = getNewArticlePaths();
    articlesFrontMatter = await Promise.all(
      paths.map(async (path) => getArticleFrontMatter(await getArticleFileString(path)))
    );
  });

  it('should should have frontmatter with title, tags and cover image', () => {
    articlesFrontMatter.forEach((frontMatter) => {
      expect(frontMatter).toBeDefined();
      expect(frontMatter).toHaveProperty('title');
      expect(frontMatter).toHaveProperty('tags');
      expect(frontMatter).toHaveProperty('coverImage');
    });
  });
});
