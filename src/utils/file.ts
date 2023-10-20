import fs from 'fs';

import matter from 'gray-matter';

import { Article, ArticleFrontMatter } from '../interfaces';

export const getArticle = (path: string): Article => {
  if (!path) throw new Error('No article path provided.');

  const file = fs.readdirSync(path).find((file) => file.endsWith('.md'));

  if (!file) throw new Error('getArticle: No markdown file found in article path.');

  const markdown = matter(fs.readFileSync(`${path}/${file}`, 'utf-8'));
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
