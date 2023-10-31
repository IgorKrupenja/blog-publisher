import { describe, expect, it, vi } from 'vitest';

import * as devTo from '../fetchers/dev-to';
import * as hashnode from '../fetchers/hashnode';
import * as medium from '../fetchers/medium';

import * as file from './file';
import * as markdown from './markdown';
import { publishArticle } from './publish';
import * as supabase from './supabase';

vi.mock('./file', () => {
  return {
    getArticleFileString: () => '---\ntitle: Test Article\n---\n\nThis is a test article.',
    getImagePath: () => '/path/to/cover.jpg',
    getDirectoryPath: () => '/path/to/',
  };
});

vi.mock('./markdown', () => {
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

vi.mock('./hashnode', () => {
  return {
    getCanonicalUrl: () => 'https://blog.IgorKrpenja.com/test-article',
  };
});

vi.mock('./supabase', () => {
  return {
    getSupabaseUrl: vi.fn(),
  };
});

vi.mock('../fetchers/supabase', () => {
  return {
    uploadImage: vi.fn(),
  };
});

vi.mock('../fetchers/hashnode', () => {
  return {
    createHashnodeArticle: vi.fn(),
  };
});

vi.mock('../fetchers/dev-to', () => {
  return {
    createDevToArticle: vi.fn(),
  };
});

vi.mock('../fetchers/medium', () => {
  return {
    createMediumArticle: vi.fn(),
  };
});

describe('publishArticle', () => {
  it('should publish an article', async () => {
    const createHashnodeArticleSpy = vi.spyOn(hashnode, 'createHashnodeArticle');
    const createDevToArticleSpy = vi.spyOn(devTo, 'createDevToArticle');
    const createMediumArticleSpy = vi.spyOn(medium, 'createMediumArticle');
    const getImagePathSpy = vi.spyOn(file, 'getImagePath');
    const getMarkdownImagePathsSpy = vi.spyOn(markdown, 'getMarkdownImagePaths');
    const getSupabaseUrlSpy = vi.spyOn(supabase, 'getSupabaseUrl');

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
