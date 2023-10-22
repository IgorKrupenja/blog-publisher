import { describe, expect, it, vi } from 'vitest';

import { getNewArticlePaths } from './file';

vi.mock('child_process', () => {
  return {
    execSync: () => 'src/articles/2023/01/01-article.md\nsrc/articles/2023/02/02-article.md\n',
  };
});

describe('getNewArticlePaths', () => {
  it('should return an array of new article paths', () => {
    // Mock the output of the `git diff` command
    // const diffOutput = 'src/articles/article1.md\nsrc/articles/article2.md\n';
    // const execSyncSpy = vi.spyOn(child_process, 'execSync').mockReturnValueOnce(diffOutput);

    // Call the function and expect the output
    expect(getNewArticlePaths()).toEqual([
      'src/articles/2023/01/01-article.md',
      'src/articles/2023/02/02-article.md',
    ]);

    // Verify that the `git diff` command was called with the correct arguments
    // expect(execSyncSpy).toHaveBeenCalledWith(
    //   'git diff main HEAD --name-only -- "src/articles/**/*.md"',
    //   expect.anything()
    // );
  });
});
