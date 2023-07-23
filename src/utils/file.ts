import fs from 'fs';
import matter from 'gray-matter';

import { Article } from '../interfaces/article.js';
import { ArticleFrontMatter } from '../interfaces/article-front-matter.js';

export const getArticle = (): Article => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];
  if (!path) throw new Error('No article path provided.');

  const markdown = fs.readdirSync(path).find((file) => file.endsWith('.md'));

  if (!markdown) throw new Error('getArticle: No markdown file found in article path.');

  const parsedContent = matter(fs.readFileSync(`${path}/${markdown}`, 'utf-8'));
  const frontMatter = parsedContent.data as ArticleFrontMatter;

  if (!frontMatter.title) throw new Error('getArticle: No title found in article.');
  if (!frontMatter.tags) throw new Error('getArticle: No tags found in article.');
  if (!frontMatter.coverImage) throw new Error('getArticle: No cover image found in article.');
  if (!parsedContent.content.length) throw new Error('getArticle: No content found in article.');

  return {
    ...(frontMatter as Required<ArticleFrontMatter>),
    ...parsedContent,
    coverImagePath: `${path}/${frontMatter.coverImage}`,
  };
};
