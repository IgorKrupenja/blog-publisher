import { beforeAll, describe, expect, it } from 'bun:test';

import { PartialArticleFrontMatter } from '../interfaces';
import {
  getArticleFileString,
  getDirectoryPath,
  getImagePath,
  getNewArticlePaths,
} from '../utils/file';
import { getArticleContent, getArticleFrontMatter, getMarkdownImagePaths } from '../utils/markdown';

describe('articles', () => {
  // todo can use article interfacd?
  let articles: { path: string; frontMatter: PartialArticleFrontMatter; content: string }[] = [];

  beforeAll(async () => {
    const paths = getNewArticlePaths('test');
    const articleFileStrings = await Promise.all(paths.map(getArticleFileString));

    articles = await Promise.all(
      paths.map((path, index) => {
        return {
          path,
          frontMatter: getArticleFrontMatter(articleFileStrings[index]),
          content: getArticleContent(articleFileStrings[index]),
        };
      })
    );
  });

  it('should should have frontmatter with title, tags and cover image', () => {
    articles.forEach(({ frontMatter }) => {
      expect(frontMatter).toBeDefined();
      expect(frontMatter?.title).toBeDefined();
      expect(frontMatter?.tags).toBeDefined();
      expect(frontMatter?.coverImage).toBeDefined();
    });
  });

  it('should have a valid cover image file', async () => {
    for (const { path, frontMatter } of articles) {
      if (!frontMatter?.coverImage) continue;

      const imagePath = getImagePath(getDirectoryPath(path), frontMatter?.coverImage);
      expect(await Bun.file(imagePath).exists()).toBeTrue();
    }
  });

  it('should have a valid article content image file', async () => {
    for (const { path, content } of articles) {
      const articleImagePaths = getMarkdownImagePaths(getDirectoryPath(path), content);

      for (const imagePath of articleImagePaths) {
        expect(await Bun.file(imagePath).exists()).toBeTrue();
      }
    }
  });
});
