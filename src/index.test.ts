import { describe, expect, it, jest, mock, spyOn } from 'bun:test';

import * as file from './utils/file';
import * as publish from './utils/publish';

import { publishArticles } from '.';

mock.module('./utils/publish', () => {
  return {
    publishArticle: jest.fn(),
  };
});

mock.module('./utils/file', () => {
  return {
    getNewArticlePaths: () => ['path/to/article1', 'path/to/article2'],
  };
});

describe('publishArticles', () => {
  it('should call publishArticle for each new article path', async () => {
    const publishArticleMock = spyOn(publish, 'publishArticle');
    const newArticlePaths = ['path/to/article1', 'path/to/article2'];
    const getNewArticlePathsSpy = spyOn(file, 'getNewArticlePaths');

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();

    expect(publishArticleMock).toHaveBeenCalledTimes(newArticlePaths.length);
    newArticlePaths.forEach((path) => expect(publishArticleMock.mock.calls[0]).toEqual([path]));
  });

  it('should log a message when there are no new articles to publish', async () => {
    const getNewArticlePathsSpy = spyOn(file, 'getNewArticlePaths').mockReturnValueOnce([]);
    const consoleDebugSpy = spyOn(console, 'debug').mockImplementationOnce(() => {});

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();
    expect(consoleDebugSpy).toHaveBeenCalledWith('publishArticles: No new articles to publish.');
  });
});
