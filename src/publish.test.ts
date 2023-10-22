import { describe, expect, it, vi } from 'vitest';

import { publishArticles } from './publish';
import * as publish from './utils/publish';

vi.mock('./utils/publish', () => {
  return {
    publishArticle: vi.fn(),
  };
});

vi.mock('./utils/file', () => {
  return {
    getNewArticlePaths: () => ['path/to/article1', 'path/to/article2'],
  };
});

describe('publishArticles', () => {
  it('should call publishArticle for each new article path', async () => {
    const publishArticleMock = vi.spyOn(publish, 'publishArticle');
    const newArticlePaths = ['path/to/article1', 'path/to/article2'];

    await publishArticles();

    expect(publishArticleMock).toHaveBeenCalledTimes(newArticlePaths.length);
    newArticlePaths.forEach((path) => {
      expect(publishArticleMock).toHaveBeenCalledWith(path);
    });
  });
});
