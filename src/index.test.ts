import { describe, expect, it, vi } from 'vitest';

import * as file from './utils/file';
import * as publish from './utils/publish';

import { publishArticles } from '.';

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
    const getNewArticlePathsSpy = vi.spyOn(file, 'getNewArticlePaths');

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();

    expect(publishArticleMock).toHaveBeenCalledTimes(newArticlePaths.length);
    newArticlePaths.forEach((path) => expect(publishArticleMock).toHaveBeenCalledWith(path));
  });

  it('should log a message when there are no new articles to publish', async () => {
    const getNewArticlePathsSpy = vi.spyOn(file, 'getNewArticlePaths').mockReturnValueOnce([]);
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementationOnce(() => {});

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();
    expect(consoleDebugSpy).toHaveBeenCalledWith('publishArticles: No new articles to publish.');
  });
});
