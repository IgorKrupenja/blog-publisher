import * as child_process from 'child_process';

import { AnyFunction } from 'bun';
import { Mock, describe, expect, it, mock, spyOn } from 'bun:test';

import { expectToHaveBeenCalledWith } from '../test/test-util';

import { getArticleFileString, getDirectoryPath, getImagePath, getNewArticlePaths } from './file';

// TODO: no types yet
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
void mock.module('child_process', () => {
  return {
    execSync: () => 'src/articles/2023/01/01-article.md\nsrc/articles/2023/02/02-article.md\n',
  };
});

describe('getNewArticlePaths', () => {
  it('should return an array of new article paths', () => {
    const execSyncSpy = spyOn(child_process, 'execSync');

    expect(getNewArticlePaths()).toEqual([
      'src/articles/2023/01/01-article.md',
      'src/articles/2023/02/02-article.md',
    ]);
    expectToHaveBeenCalledWith(
      execSyncSpy,
      'git diff HEAD^ HEAD --name-only --diff-filter=A -- "src/articles/**/*.md"'
    );
  });

  it('should return an empty array when there is no diff', () => {
    const diffOutput = '';
    const execSyncSpy = spyOn(child_process, 'execSync').mockReturnValueOnce(diffOutput);

    expect(getNewArticlePaths()).toEqual([]);
    expectToHaveBeenCalledWith(
      execSyncSpy,
      'git diff HEAD^ HEAD --name-only --diff-filter=A -- "src/articles/**/*.md"'
    );
  });
});

describe('getArticleFileString', () => {
  it('should return the contents of the file as a string', async () => {
    const fileContents = 'This is the file contents.';
    const path = '/path/to/file.txt';
    const bunFileSpy = spyOn(Bun, 'file').mockImplementationOnce(
      mock((_: string) => {
        return {
          text: () => Promise.resolve(fileContents),
        };
      }) as Mock<AnyFunction>
    );

    expect(await getArticleFileString(path)).toEqual(fileContents);
    expectToHaveBeenCalledWith(bunFileSpy, path);
  });

  // TODO: broken, maybe https://github.com/oven-sh/bun/issues/1546
  // it('should throw an error when the file is not found', async () => {
  //   const path = '/path/to/nonexistent/file.txt';
  //   //   throw new Error('getArticleFileString: file not found');
  //   // const readFileSyncSpy = spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
  //   // });

  //   const bunFileSpy = spyOn(Bun, 'file').mockImplementationOnce(
  //     mock((_: string) => {
  //       return {
  //         text: () => {
  //           throw new Error('getArticleFileString: file not found');
  //         },
  //       };
  //     }) as Mock<AnyFunction>
  //   );

  //   expect(await getArticleFileString(path)).toThrow('getArticleFileString: file not found');
  //   expectToHaveBeenCalledWith(bunFileSpy, [path]);
  // });
});

describe('getImagePath', () => {
  it('should return the correct image path', () => {
    const path = '/path/to/images';
    const image = 'my-image.jpg';
    const expected = '/path/to/images/my-image.jpg';
    expect(getImagePath(path, image)).toEqual(expected);
  });
});

describe('getDirectoryPath', () => {
  it('should return the correct directory path for a file path', () => {
    const path = '/etc/blog/src/utils/file.ts';
    const expected = '/etc/blog/src/utils';
    expect(getDirectoryPath(path)).toEqual(expected);
  });

  it('should return the correct directory path for a relative file path', () => {
    const path = './blog/src/utils';
    const expected = './blog/src';
    expect(getDirectoryPath(path)).toEqual(expected);
  });

  it('should return an empty string for an empty path', () => {
    const path = '';
    const expected = '';
    expect(getDirectoryPath(path)).toEqual(expected);
  });
});
