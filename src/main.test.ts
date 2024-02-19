import { describe, expect, it, spyOn } from 'bun:test';

import { publishArticles } from './main';
import * as file from './utils/file';
import * as publish from './utils/publish';

describe('publishArticles', () => {
  it('should call publishArticle for each new article path', async () => {
    const newArticlePaths = ['path/to/article1', 'path/to/article2'];
    const getNewArticlePathsSpy = spyOn(file, 'getNewArticlePaths').mockReturnValue(
      newArticlePaths
    );
    const publishArticleSpy = spyOn(publish, 'publishArticle').mockReturnValue(Promise.resolve());

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();
    expect(publishArticleSpy).toHaveBeenCalledTimes(newArticlePaths.length);
    newArticlePaths.forEach((path) => expect(publishArticleSpy).toHaveBeenCalledWith(path));

    getNewArticlePathsSpy.mockRestore();
    publishArticleSpy.mockRestore();
  });

  it('should log a message when there are no new articles to publish', async () => {
    const getNewArticlePathsSpy = spyOn(file, 'getNewArticlePaths').mockReturnValueOnce([]);
    const consoleDebugSpy = spyOn(console, 'debug').mockImplementationOnce(() => {});

    await publishArticles();

    expect(getNewArticlePathsSpy).toHaveBeenCalled();
    expect(consoleDebugSpy).toHaveBeenCalledWith('publishArticles: No new articles to publish.');
  });
});
