import { execSync } from 'child_process';
import fs from 'fs';

export const getNewArticlePaths = (): string[] => {
  const command = 'git diff main HEAD --name-only -- "src/articles/**/*.md"';
  const diffOutput = execSync(command).toString();
  return diffOutput.toString().split('\n').filter(Boolean);
};

export const getArticleFileString = (path: string): string => {
  try {
    return fs.readFileSync(path).toString();
  } catch (error) {
    throw new Error('getArticleFileString: file not found');
  }
};

export const getImagePath = (path: string, image: string): string => {
  return `${path}/${image}`;
};
