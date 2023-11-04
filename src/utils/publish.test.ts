import { describe, it, jest, mock, spyOn } from 'bun:test';

import * as devTo from '../fetchers/dev-to';
import * as hashnode from '../fetchers/hashnode';
import * as medium from '../fetchers/medium';
import { expectToHaveBeenCalledWith } from '../test/test-util';
import * as hashnodeUtil from '../utils/hashnode';

import * as file from './file';
import * as markdown from './markdown';
import { publishArticle } from './publish';
import * as supabase from './supabase';

void mock.module('../fetchers/supabase.ts', () => {
  return {
    uploadImage: jest.fn(),
  };
});

describe('publishArticle', () => {
  it('should publish an article', async () => {
    spyOn(hashnodeUtil, 'getCanonicalUrl').mockReturnValueOnce(
      'https://blog.IgorKrpenja.com/test-article'
    );
    spyOn(file, 'getArticleFileString').mockReturnValueOnce(
      Promise.resolve('---\ntitle: Test Article\n---\n\nThis is a test article.')
    );
    spyOn(file, 'getDirectoryPath').mockReturnValueOnce('/path/to/');
    spyOn(markdown, 'getArticleFrontMatter').mockReturnValueOnce({
      title: 'Test Article',
      tags: ['first', 'second'],
      coverImage: 'cover.jpg',
    });

    const getImagePathSpy = spyOn(file, 'getImagePath').mockReturnValueOnce('/path/to/cover.jpg');
    const getMarkdownImagePathsSpy = spyOn(markdown, 'getMarkdownImagePaths').mockReturnValueOnce(
      []
    );
    const getSupabaseUrlSpy = spyOn(supabase, 'getSupabaseUrl').mockReturnValueOnce('');

    const createHashnodeArticleSpy = spyOn(
      hashnode,
      'createHashnodeArticle'
    ).mockImplementationOnce(() => Promise.resolve('dummy'));
    const createDevToArticleSpy = spyOn(devTo, 'createDevToArticle').mockImplementationOnce(() =>
      Promise.resolve()
    );
    const createMediumArticleSpy = spyOn(medium, 'createMediumArticle').mockImplementationOnce(() =>
      Promise.resolve()
    );

    await publishArticle('/path/to/article.md');

    expectToHaveBeenCalledWith(getImagePathSpy, '/path/to/', 'cover.jpg');
    expectToHaveBeenCalledWith(
      getMarkdownImagePathsSpy,
      '/path/to/',
      '---\ntitle: Test Article\n---\n\nThis is a test article.'
    );
    expectToHaveBeenCalledWith(getSupabaseUrlSpy, '/path/to/');

    expectToHaveBeenCalledWith(createHashnodeArticleSpy, {
      title: 'Test Article',
      tags: ['first', 'second'],
      coverImage: 'cover.jpg',
      content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
      coverImagePath: '/path/to/cover.jpg',
    });
    expectToHaveBeenCalledWith(createDevToArticleSpy, {
      title: 'Test Article',
      tags: ['first', 'second'],
      coverImage: 'cover.jpg',
      content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
      coverImagePath: '/path/to/cover.jpg',
      canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
    });
    expectToHaveBeenCalledWith(createMediumArticleSpy, {
      title: 'Test Article',
      tags: ['first', 'second'],
      coverImage: 'cover.jpg',
      content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
      coverImagePath: '/path/to/cover.jpg',
      canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
    });

    getSupabaseUrlSpy.mockRestore();
  });
});
