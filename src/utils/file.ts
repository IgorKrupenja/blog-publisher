import { execSync } from 'child_process';

export const getNewArticlePaths = (): string[] => {
  const command = 'git diff HEAD^ HEAD --name-only --diff-filter=A -- "src/articles/**/*.md"';
  const diffOutput = execSync(command).toString();
  return diffOutput.toString().split('\n').filter(Boolean);
};

// todo await in tests?
export const getArticleFileString = (path: string): Promise<string> => {
  try {
    return Bun.file(path).text();
  } catch (error) {
    throw new Error('getArticleFileString: file not found');
  }
};

export const getDirectoryPath = (path: string): string => path.split('/').slice(0, -1).join('/');

export const getImagePath = (path: string, image: string): string => `${path}/${image}`;
