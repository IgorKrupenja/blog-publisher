import * as child_process from 'child_process';
import fs from 'fs';

import { describe, expect, it, vi } from 'vitest';

import { getArticleFileString, getImagePath, getNewArticlePaths } from './file';

vi.mock('child_process', () => {
  return {
    execSync: () => 'src/articles/2023/01/01-article.md\nsrc/articles/2023/02/02-article.md\n',
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
      'git diff HEAD^ HEAD --name-only -- "src/articles/**/*.md"'
    );
  });

  it('should return an empty array when there is no diff', () => {
    const diffOutput = '';
    const execSyncSpy = vi.spyOn(child_process, 'execSync').mockReturnValueOnce(diffOutput);

    expect(getNewArticlePaths()).toEqual([]);
    expect(execSyncSpy).toHaveBeenCalledWith(
      'git diff HEAD^ HEAD --name-only -- "src/articles/**/*.md"'
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

  it('should throw an error when the file is not found', () => {
    const path = '/path/to/nonexistent/file.txt';
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('getArticleFileString: file not found');
    });

    expect(() => getArticleFileString(path)).toThrow('getArticleFileString: file not found');
    expect(readFileSyncSpy).toHaveBeenCalledWith(path);
  });
});

describe('getImagePath', () => {
  it('should return the correct image path', () => {
    const path = '/path/to/images';
    const image = 'my-image.jpg';
    const expected = '/path/to/images/my-image.jpg';
    expect(getImagePath(path, image)).toEqual(expected);
  });
});
