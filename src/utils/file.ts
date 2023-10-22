import { execSync } from 'child_process';
import fs from 'fs';

export const getNewArticlePaths = (): string[] => {
  // const extensionFilter = extension ? `-- '***.${extension}'` : '';
  const command = `git diff HEAD^ HEAD --name-only ${extensionFilter}`;
  const diffOutput = execSync(command).toString();

  return diffOutput.toString().split('\n').filter(Boolean);
};

// TODO: Needs refactor, see #7.
export const getArticleFileString = (path: string): string => {
  if (!path) throw new Error('No article path provided.');

  const fileName = fs.readdirSync(path).find((file) => file.endsWith('.md'));
  if (!fileName) throw new Error('getArticle: No markdown file found in article path.');

  return fs.readFileSync(`${path}/${fileName}`).toString();
};

export const getImagePath = (path: string, image: string): string => {
  return `${path}/${image}`;
};
