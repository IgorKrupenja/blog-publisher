import { describe, it, jest, mock, spyOn } from 'bun:test';

import { expectToHaveBeenCalledWith } from '../test/test-util';

import * as file from './file';
import { publishArticle } from './publish';

void mock.module('./file', () => {
  return {
    getArticleFileString: () => '---\ntitle: Test Article\n---\n\nThis is a test article.',
    getImagePath: () => '/path/to/cover.jpg',
    getDirectoryPath: () => '/path/to/',
  };
});

void mock.module('./markdown', () => {
  return {
    getArticleFrontMatter: () => ({
      title: 'Test Article',
      tags: ['first', 'second'],
      coverImage: 'cover.jpg',
    }),
    getMarkdownImagePaths: () => [],
    replaceMarkdownImagePaths: () => '---\ntitle: Test Article\n---\n\nThis is a test article.',
  };
});

void mock.module('./hashnode', () => {
  return {
    getCanonicalUrl: () => 'https://blog.IgorKrpenja.com/test-article',
  };
});

void mock.module('./supabase', () => {
  return {
    getSupabaseUrl: jest.fn(),
  };
});

void mock.module('../fetchers/supabase', () => {
  return {
    uploadImage: jest.fn(),
  };
});

void mock.module('../fetchers/hashnode', () => {
  return {
    createHashnodeArticle: jest.fn(),
  };
});

void mock.module('../fetchers/dev-to', () => {
  return {
    createDevToArticle: jest.fn(),
  };
});

void mock.module('../fetchers/medium', () => {
  return {
    createMediumArticle: jest.fn(),
  };
});

// todo try w/o mock.module
describe.only('publishArticle', () => {
  it.only('should publish an article', async () => {
    // const createHashnodeArticleSpy = spyOn(hashnode, 'createHashnodeArticle');
    // const createDevToArticleSpy = spyOn(devTo, 'createDevToArticle');
    // const createMediumArticleSpy = spyOn(medium, 'createMediumArticle');
    const getImagePathSpy = spyOn(file, 'getImagePath').mockReturnValueOnce('/path/to/cover.jpg');
    // const getMarkdownImagePathsSpy = spyOn(markdown, 'getMarkdownImagePaths');
    // const getSupabaseUrlSpy = spyOn(supabase, 'getSupabaseUrl');

    await publishArticle('/path/to/article.md');

    expectToHaveBeenCalledWith(getImagePathSpy, ['/path/to/', 'cover.jpg']);

    // todo old

    // expect(getImagePathSpy).toHaveBeenCalledWith('/path/to/', 'cover.jpg');
    // expect(getMarkdownImagePathsSpy).toHaveBeenCalledWith(
    //   '/path/to/',
    //   '---\ntitle: Test Article\n---\n\nThis is a test article.'
    // );
    // expect(getSupabaseUrlSpy).toHaveBeenCalledWith('/path/to/');

    // expect(createHashnodeArticleSpy).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     title: 'Test Article',
    //     content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
    //     coverImagePath: '/path/to/cover.jpg',
    //     tags: ['first', 'second'],
    //   })
    // );

    // expect(createDevToArticleSpy).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     title: 'Test Article',
    //     content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
    //     coverImagePath: '/path/to/cover.jpg',
    //     tags: ['first', 'second'],
    //     canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
    //   })
    // );

    // expect(createMediumArticleSpy).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     title: 'Test Article',
    //     content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
    //     coverImagePath: '/path/to/cover.jpg',
    //     tags: ['first', 'second'],
    //     canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
    //   })
    // );

    // expect(createHashnodeArticleSpy).toHaveBeenCalled();
    // expect(createDevToArticleSpy).toHaveBeenCalled();
    // expect(createMediumArticleSpy).toHaveBeenCalled();
  });
});
