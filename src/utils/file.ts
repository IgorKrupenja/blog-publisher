import fs from 'fs';

import { Article } from '../interfaces';

import { getArticleContent, getArticleFrontMatter } from '.';

// TODO: Needs refactor, see #7.
// TODO: Consider calling getArticleFrontMatter() and getArticleContent() outside of this.
export const getArticle = (path: string): Article => {
  if (!path) throw new Error('No article path provided.');

  const file = fs.readdirSync(path).find((file) => file.endsWith('.md'));

  if (!file) throw new Error('getArticle: No markdown file found in article path.');

  const markdown = fs.readFileSync(`${path}/${file}`).toString();
  const frontMatter = getArticleFrontMatter(markdown);
  const content = getArticleContent(markdown);

  return {
    ...frontMatter,
    content,
    coverImagePath: `${path}/${frontMatter.coverImage}`,
  };
};
