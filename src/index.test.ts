import { describe, expect, it, spyOn } from 'bun:test';

import { expectToHaveBeenCalledWith } from './test/test-util';
import * as file from './utils/file';
import * as publish from './utils/publish';

import { publishArticles } from '.';

describe('publishArticles', () => {
  it('should call publishArticle for each new article path', async () => {
    const newArticlePaths = ['path/to/article1', 'path/to/article2'];
    const getNewArticlePathsSpy = spyOn(file, 'getNewArticlePaths').mockReturnValue(
      newArticlePaths
    );
    const publishArticleSpy = spyOn(publish, 'publishArticle').mockResolvedValue(undefined);

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();

    expect(publishArticleSpy).toHaveBeenCalledTimes(newArticlePaths.length);
    newArticlePaths.forEach((path) => expectToHaveBeenCalledWith(publishArticleSpy, [path]));

    getNewArticlePathsSpy.mockRestore();
    publishArticleSpy.mockRestore();
  });

  it('should log a message when there are no new articles to publish', async () => {
    const getNewArticlePathsSpy = spyOn(file, 'getNewArticlePaths').mockReturnValueOnce([]);
    const consoleDebugSpy = spyOn(console, 'debug').mockImplementationOnce(() => {});

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();
    expectToHaveBeenCalledWith(consoleDebugSpy, ['publishArticles: No new articles to publish.']);
  });
});
