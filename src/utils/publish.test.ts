import { describe, expect, it, jest, mock, spyOn } from 'bun:test';

import * as devTo from '../fetchers/dev-to';
import * as hashnode from '../fetchers/hashnode';
import * as medium from '../fetchers/medium';

import * as file from './file';
import * as markdown from './markdown';
import { publishArticle } from './publish';
import * as supabase from './supabase';

mock.module('./file', () => {
  return {
    getArticleFileString: () => '---\ntitle: Test Article\n---\n\nThis is a test article.',
    getImagePath: () => '/path/to/cover.jpg',
    getDirectoryPath: () => '/path/to/',
  };
});

mock.module('./markdown', () => {
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

mock.module('./hashnode', () => {
  return {
    getCanonicalUrl: () => 'https://blog.IgorKrpenja.com/test-article',
  };
});

mock.module('./supabase', () => {
  return {
    getSupabaseUrl: jest.fn(),
  };
});

mock.module('../fetchers/supabase', () => {
  return {
    uploadImage: jest.fn(),
  };
});

mock.module('../fetchers/hashnode', () => {
  return {
    createHashnodeArticle: jest.fn(),
  };
});

mock.module('../fetchers/dev-to', () => {
  return {
    createDevToArticle: jest.fn(),
  };
});

mock.module('../fetchers/medium', () => {
  return {
    createMediumArticle: jest.fn(),
  };
});

describe('publishArticle', () => {
  it('should publish an article', async () => {
    const createHashnodeArticleSpy = spyOn(hashnode, 'createHashnodeArticle');
    const createDevToArticleSpy = spyOn(devTo, 'createDevToArticle');
    const createMediumArticleSpy = spyOn(medium, 'createMediumArticle');
    const getImagePathSpy = spyOn(file, 'getImagePath');
    const getMarkdownImagePathsSpy = spyOn(markdown, 'getMarkdownImagePaths');
    const getSupabaseUrlSpy = spyOn(supabase, 'getSupabaseUrl');

    await publishArticle('/path/to/article.md');

    expect(getImagePathSpy).toHaveBeenCalledWith('/path/to/', 'cover.jpg');
    expect(getMarkdownImagePathsSpy).toHaveBeenCalledWith(
      '/path/to/',
      '---\ntitle: Test Article\n---\n\nThis is a test article.'
    );
    expect(getSupabaseUrlSpy).toHaveBeenCalledWith('/path/to/');

    expect(createHashnodeArticleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Article',
        content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
        coverImagePath: '/path/to/cover.jpg',
        tags: ['first', 'second'],
      })
    );

    expect(createDevToArticleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Article',
        content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
        coverImagePath: '/path/to/cover.jpg',
        tags: ['first', 'second'],
        canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
      })
    );

    expect(createMediumArticleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Article',
        content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
        coverImagePath: '/path/to/cover.jpg',
        tags: ['first', 'second'],
        canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
      })
    );

    expect(createHashnodeArticleSpy).toHaveBeenCalled();
    expect(createDevToArticleSpy).toHaveBeenCalled();
    expect(createMediumArticleSpy).toHaveBeenCalled();
  });
});
