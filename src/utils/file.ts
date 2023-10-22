import { execSync } from 'child_process';
import fs from 'fs';

export const getNewArticlePaths = (): string[] => {
  const command = 'git diff main HEAD --name-only -- "src/articles/**/*.md"';
  const diffOutput = execSync(command).toString();
  return diffOutput.toString().split('\n').filter(Boolean);
};

export const getArticleFileString = (path: string): string => {
  return fs.readFileSync(path).toString();
};

export const getImagePath = (path: string, image: string): string => {
  return `${path}/${image}`;
};
