import * as child_process from 'child_process';
import fs from 'fs';

import { describe, expect, it, vi } from 'vitest';

import { getArticleFileString, getNewArticlePaths } from './file';

vi.mock('child_process', () => {
  return {
    execSync: () => 'src/articles/2023/01/01-article.md\nsrc/articles/2023/02/02-article.md\n',
  };
});

vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    readFileSync: () => 'This is the file contents.',
  };
});

describe('getNewArticlePaths', () => {
  it('should return an array of new article paths', () => {
    const execSyncSpy = vi.spyOn(child_process, 'execSync');

    expect(getNewArticlePaths()).toEqual([
      'src/articles/2023/01/01-article.md',
      'src/articles/2023/02/02-article.md',
    ]);
    expect(execSyncSpy).toHaveBeenCalledWith(
      'git diff main HEAD --name-only -- "src/articles/**/*.md"'
    );
  });

  it('should return an empty array when there is no diff', () => {
    const diffOutput = '';
    const execSyncSpy = vi.spyOn(child_process, 'execSync').mockReturnValueOnce(diffOutput);

    expect(getNewArticlePaths()).toEqual([]);
    expect(execSyncSpy).toHaveBeenCalledWith(
      'git diff main HEAD --name-only -- "src/articles/**/*.md"'
    );
  });
});

describe('getArticleFileString', () => {
  it('should return the contents of the file as a string', () => {
    const fileContents = 'This is the file contents.';
    const path = '/path/to/file.txt';
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(fileContents);

    expect(getArticleFileString(path)).toEqual(fileContents);
    expect(readFileSyncSpy).toHaveBeenCalledWith(path);
  });
});
