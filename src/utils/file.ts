import fs from 'fs';

// TODO: Needs refactor, see #7.
export const getArticleFileString = (path: string): string => {
  if (!path) throw new Error('No article path provided.');

  const fileName = fs.readdirSync(path).find((file) => file.endsWith('.md'));
  if (!fileName) throw new Error('getArticle: No markdown file found in article path.');

  return fs.readFileSync(`${path}/${fileName}`).toString();
};

export const getArticleCoverImagePath = (path: string, coverImage: string): string => {
  return `${path}/${coverImage}`;
};
