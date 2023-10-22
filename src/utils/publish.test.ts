import { describe, expect, it, vi } from 'vitest';

import * as devTo from '../fetchers/dev-to';
import * as hashnode from '../fetchers/hashnode';
import * as medium from '../fetchers/medium';

import { publishArticle } from './publish';

vi.mock('./file', () => {
  return {
    getArticleFileString: () => '---\ntitle: Test Article\n---\n\nThis is a test article.',
    getImagePath: () => '/path/to/image.jpg',
  };
});

vi.mock('./markdown', () => {
  return {
    getArticleFrontMatter: () => ({ title: 'Test Article', tags: ['first', 'second'] }),
    getMarkdownImagePaths: () => [],
    replaceMarkdownImagePaths: () => '---\ntitle: Test Article\n---\n\nThis is a test article.',
  };
});

vi.mock('./hashnode', () => {
  return {
    getCanonicalUrl: () => 'https://blog.IgorKrpenja.com/test-article',
  };
});

vi.mock('../fetchers/supabase', () => {
  return {
    uploadImage: vi.fn(),
  };
});

vi.mock('../fetchers/hashnode', () => {
  return {
    createHashnodeArticle: () => 'test-article',
  };
});

vi.mock('../fetchers/dev-to', () => {
  return {
    createDevToArticle: () => Promise.resolve(),
  };
});

vi.mock('../fetchers/medium', () => {
  return {
    createMediumArticle: () => Promise.resolve(),
  };
});

describe('publishArticle', () => {
  it('should publish an article', async () => {
    const createHashnodeArticleSpy = vi.spyOn(hashnode, 'createHashnodeArticle');
    const createDevToArticleSpy = vi.spyOn(devTo, 'createDevToArticle');
    const createMediumArticleSpy = vi.spyOn(medium, 'createMediumArticle');

    await publishArticle('/path/to/article.md');

    expect(createHashnodeArticleSpy).toHaveBeenCalledWith({
      title: 'Test Article',
      content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
      coverImagePath: '/path/to/image.jpg',
      tags: ['first', 'second'],
    });

    expect(createDevToArticleSpy).toHaveBeenCalledWith({
      title: 'Test Article',
      content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
      coverImagePath: '/path/to/image.jpg',
      tags: ['first', 'second'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
    });

    expect(createMediumArticleSpy).toHaveBeenCalledWith({
      title: 'Test Article',
      content: '---\ntitle: Test Article\n---\n\nThis is a test article.',
      coverImagePath: '/path/to/image.jpg',
      tags: ['first', 'second'],
      canonicalUrl: 'https://blog.IgorKrpenja.com/test-article',
    });

    expect(createHashnodeArticleSpy).toHaveBeenCalled();
    expect(createDevToArticleSpy).toHaveBeenCalled();
    expect(createMediumArticleSpy).toHaveBeenCalled();
  });
});
