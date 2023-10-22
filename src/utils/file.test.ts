import * as child_process from 'child_process';

import { describe, expect, it, vi } from 'vitest';

import { getNewArticlePaths } from './file';

vi.mock('child_process', () => {
  return {
    execSync: () => 'src/articles/2023/01/01-article.md\nsrc/articles/2023/02/02-article.md\n',
  };
});

describe('getNewArticlePaths', () => {
  it('should return an array of new article paths', () => {
    const diffOutput = 'src/articles/2023/01/01-article.md\nsrc/articles/2023/02/02-article.md\n';
    const execSyncSpy = vi.spyOn(child_process, 'execSync').mockReturnValueOnce(diffOutput);

    expect(getNewArticlePaths()).toEqual([
      'src/articles/2023/01/01-article.md',
      'src/articles/2023/02/02-article.md',
    ]);

    expect(execSyncSpy).toHaveBeenCalledWith(
      'git diff main HEAD --name-only -- "src/articles/**/*.md"'
    );
  });
});
