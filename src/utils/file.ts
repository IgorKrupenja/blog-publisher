import fs from 'fs';

import matter from 'gray-matter';

import { Article, ArticleFrontMatter } from '../interfaces';

export const getArticle = async (path: string): Promise<Article> => {
  if (!path) throw new Error('No article path provided.');

  const fileName = fs.readdirSync(path).find((file) => file.endsWith('.md'));

  if (!fileName) throw new Error('getArticle: No markdown file found in article path.');

  const file = Bun.file(`${path}/${fileName}`);
  const markdown = matter(await file.text());
  const frontMatter = markdown.data as ArticleFrontMatter;

  if (!frontMatter.title) throw new Error('getArticle: No title found in article.');
  if (!frontMatter.tags) throw new Error('getArticle: No tags found in article.');
  if (!frontMatter.coverImage) throw new Error('getArticle: No cover image found in article.');
  if (!markdown.content.length) throw new Error('getArticle: No content found in article.');

  return {
    ...(frontMatter as Required<ArticleFrontMatter>),
    ...markdown,
    coverImagePath: `${path}/${frontMatter.coverImage}`,
  };
};
