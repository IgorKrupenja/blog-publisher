import { describe, expect, it, spyOn } from 'bun:test';

import {
  getArticleContent,
  getArticleFrontMatter,
  getMarkdownImagePaths,
  insertCanonicalUrl,
  insertCoverImage,
  replaceMarkdownImagePaths,
} from './markdown';
import * as supabase from './supabase';

describe('getArticleFrontMatter', () => {
  it('should return front matter when given valid markdown', () => {
    const markdown =
      '---\n' +
      'title: My Article\n' +
      'tags: [tag1, tag2]\n' +
      'coverImage: /path/to/image.jpg\n' +
      '---\n' +
      '\n' +
      '# My Article\n' +
      '\n' +
      'This is the body of my article.';

    const expectedFrontMatter = {
      title: 'My Article',
      tags: ['tag1', 'tag2'],
      coverImage: '/path/to/image.jpg',
    };

    expect(getArticleFrontMatter(markdown)).toEqual(expectedFrontMatter);
  });

  it('should throw an error when title is missing', () => {
    const markdown =
      '---\n' +
      'tags: [tag1, tag2]\n' +
      'coverImage: /path/to/image.jpg\n' +
      '---\n' +
      '\n' +
      '# My Article\n' +
      '\n' +
      'This is the body of my article.';

    expect(() => getArticleFrontMatter(markdown)).toThrow('getArticle: No title found in article.');
  });

  it('should throw an error when tags are missing', () => {
    const markdown =
      '---\n' +
      'title: My Article\n' +
      'coverImage: /path/to/image.jpg\n' +
      '---\n' +
      '\n' +
      '# My Article\n' +
      '\n' +
      'This is the body of my article.';

    expect(() => getArticleFrontMatter(markdown)).toThrow('getArticle: No tags found in article.');
  });

  it('should throw an error when coverImage is missing', () => {
    const markdown =
      '---\n' +
      'title: My Article\n' +
      'tags: [tag1, tag2]\n' +
      '---\n' +
      '\n' +
      '# My Article\n' +
      '\n' +
      'This is the body of my article.';

    expect(() => getArticleFrontMatter(markdown)).toThrow(
      'getArticle: No cover image found in article.'
    );
  });

  it('should throw an error when front matter is missing', () => {
    const markdown = '# My Article\n\nThis is the body of my article.';

    expect(() => getArticleFrontMatter(markdown)).toThrow(
      'getArticle: No front matter found in article.'
    );
  });
});

describe('getArticleContent', () => {
  it('should remove front matter from markdown', () => {
    const markdown =
      '---\n' +
      'title: My Article\n' +
      'date: 2022-01-01\n' +
      '---\n' +
      '\n' +
      'This is the content of my article.\n' +
      '\n' +
      'It has multiple lines.';
    const expected = 'This is the content of my article.\n\nIt has multiple lines.';
    expect(getArticleContent(markdown)).toEqual(expected);
  });

  it('should remove front matter from markdown with dashes in front matter and content', () => {
    const markdown =
      '---\n' +
      'title: My Article - With a Dash\n' +
      'date: 2022-01-01\n' +
      '---\n' +
      '\n' +
      'This is the content of my article.\n' +
      '\n' +
      'It has a dash - in it.';
    const expected = 'This is the content of my article.\n\nIt has a dash - in it.';
    expect(getArticleContent(markdown)).toEqual(expected);
  });

  it('should remove front matter from markdown with no front matter', () => {
    const markdown = 'This is the content of my article.';
    const expected = 'This is the content of my article.';
    expect(getArticleContent(markdown)).toEqual(expected);
  });

  it('should remove front matter from markdown with only front matter', () => {
    const markdown = '---\n' + 'title: My Article\n' + 'date: 2022-01-01\n' + '---';
    const expected = '';
    expect(getArticleContent(markdown)).toEqual(expected);
  });
});

describe('insertCanonicalUrl', () => {
  it('should return correct markdown', () => {
    const markdown = 'foo';
    const url = 'bar';
    expect(insertCanonicalUrl(markdown, url)).toEqual(
      '\n*This article was originally published on [my blog](bar).*\nfoo'
    );
  });
});

describe('insertCoverImage', () => {
  it('should return correct markdown', () => {
    const title = 'title';
    const content = '## Heading';
    const coverImagePath = 'path/to/image.jpg';

    const spy = spyOn(supabase, 'getSupabaseUrl').mockReturnValueOnce(
      'https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg'
    );

    expect(insertCoverImage(title, content, coverImagePath)).toEqual(
      '\n![title](https://supabase.IgorKrpenja.com/storage/v1/object/public/images/path/to/image.jpg)\n## Heading'
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('getMarkdownImagePaths', () => {
  it('should return an empty array when there are no images', () => {
    const markdown = 'This is some text without images.';
    expect(getMarkdownImagePaths('/path/to', markdown)).toEqual([]);
  });

  it('should return an array with one image when there is one image', () => {
    const markdown = 'This is some text with an image: ![alt text](image.jpg)';
    expect(getMarkdownImagePaths('/path/to', markdown)).toEqual(['/path/to/image.jpg']);
  });

  it('should return only one path for multiple occurrences of the same image name', () => {
    const markdown =
      'This is an image: ![alt text](image.jpg) This is another image: ![alt text](image.jpg) This is yet another image: ![alt text](image.jpg)';
    expect(getMarkdownImagePaths('/path/to', markdown)).toEqual(['/path/to/image.jpg']);
  });

  it('should return an array with multiple images when there are multiple images', () => {
    const markdown =
      'This is some text with two images:\n![alt text 1](image1.jpg)\n![alt text 2](image2.jpg)';
    expect(getMarkdownImagePaths('/path/to', markdown)).toEqual([
      '/path/to/image1.jpg',
      '/path/to/image2.jpg',
    ]);
  });

  it('should return an array with images when there are images with different formats', () => {
    const markdown =
      'This is some text with images: ![alt text 1](image1.jpg)\nSome more text.\n![alt text 2](image2.png)\n## Title\n![alt text 3](image3.gif)';
    expect(getMarkdownImagePaths('/path/to', markdown)).toEqual([
      '/path/to/image1.jpg',
      '/path/to/image2.png',
      '/path/to/image3.gif',
    ]);
  });

  it('should return an empty array if the only image is the cover from front matter', () => {
    const markdown =
      '\n---\n' +
      'title: Next.js + Expo monorepo with pnpm\n' +
      'tags: [nextjs, expo, typescript, react-native]\n' +
      'coverImage: cover.jpg\n' +
      '---\n\n' +
      '## Test';
    expect(getMarkdownImagePaths('/path/to/', markdown)).toEqual([]);
  });
});

describe('replaceMarkdownImagePaths', () => {
  it('should replace image paths in markdown', () => {
    const path = 'www.example.com/path/to/images';
    const markdown = 'This is an image: ![alt text](image.jpg)';
    const expected = 'This is an image: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should replace image paths that start with /', () => {
    const path = 'www.example.com/path/to/images';
    const markdown = 'This is an image: ![alt text](/image.jpg)';
    const expected = 'This is an image: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths if it is an URL already', () => {
    const path = 'www.example.com/path/to/images';
    const markdown =
      'This is an image: ![alt text](http://www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(markdown);
  });

  it('should replace multiple image paths in markdown', () => {
    const path = 'www.example.com/path/to/images';
    const markdown =
      'This is an image: ![alt text](image1.jpg)\nAnd this is another image: ![alt text](image2.jpg)';
    const expected =
      'This is an image: ![alt text](www.example.com/path/to/images/image1.jpg)\nAnd this is another image: ![alt text](www.example.com/path/to/images/image2.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths in code blocks', () => {
    const path = 'www.example.com/path/to/images';
    const markdown =
      'This is a code block:\n\n```\n![alt text](image.jpg)\n\n```\n\nThis is not a code block: ![alt text](image.jpg)';
    const expected =
      'This is a code block:\n\n```\n![alt text](image.jpg)\n\n```\n\nThis is not a code block: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths in inline code', () => {
    const path = 'www.example.com/path/to/images';
    const markdown =
      'This is inline code: `![alt text](image.jpg)`\nThis is not inline code: ![alt text](image.jpg)';
    const expected =
      'This is inline code: `![alt text](image.jpg)`\nThis is not inline code: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should replace image paths in links', () => {
    const path = 'www.example.com/path/to/images';
    const markdown = 'This is a link: [![alt text](image.jpg)](https://example.com)';
    const expected =
      'This is a link: [![alt text](www.example.com/path/to/images/image.jpg)](https://example.com)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths in YAML front matter', () => {
    const path = 'www.example.com/path/to/images';
    const markdown = '---\nimage: image.jpg\n---\n\nThis is not an image: ![alt text](image.jpg)';
    const expected =
      '---\nimage: image.jpg\n---\n\nThis is not an image: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths in TOML front matter', () => {
    const path = 'www.example.com/path/to/images';
    const markdown =
      '+++\nimage = "image.jpg"\n+++\n\nThis is not an image: ![alt text](image.jpg)';
    const expected =
      '+++\nimage = "image.jpg"\n+++\n\nThis is not an image: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths in JSON front matter', () => {
    const path = 'www.example.com/path/to/images';
    const markdown = '{"image": "image.jpg"}\n\nThis is not an image: ![alt text](image.jpg)';
    const expected =
      '{"image": "image.jpg"}\n\nThis is not an image: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });

  it('should not replace image paths in comments', () => {
    const path = 'www.example.com/path/to/images';
    const markdown =
      'This is a comment: <!-- ![alt text](image.jpg) -->\nThis is not a comment: ![alt text](image.jpg)';
    const expected =
      'This is a comment: <!-- ![alt text](image.jpg) -->\nThis is not a comment: ![alt text](www.example.com/path/to/images/image.jpg)';
    expect(replaceMarkdownImagePaths(path, markdown)).toEqual(expected);
  });
});
