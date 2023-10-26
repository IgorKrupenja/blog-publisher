import {
  createDevToArticle,
  createHashnodeArticle,
  createMediumArticle,
  uploadImage,
} from '../fetchers';
import { Article } from '../interfaces';

import {
  getArticleFileString,
  getArticleFrontMatter,
  getCanonicalUrl,
  getDirectoryPath,
  getImagePath,
  getMarkdownImagePaths,
  getSupabaseUrl,
  replaceMarkdownImagePaths,
} from '.';

export const publishArticle = async (filePath: string): Promise<void> => {
  const articleFile = getArticleFileString(filePath);
  const directoryPath = getDirectoryPath(filePath);

  const frontMatter = getArticleFrontMatter(articleFile);
  const coverImagePath = getImagePath(directoryPath, frontMatter.coverImage);
  const imagePaths = getMarkdownImagePaths(directoryPath, articleFile);
  const content = replaceMarkdownImagePaths(getSupabaseUrl(directoryPath), articleFile);

  await Promise.all([coverImagePath, ...imagePaths].map(uploadImage));

  const article: Article = { ...frontMatter, content, coverImagePath };

  const slug = await createHashnodeArticle(article);
  // TODO: temporary for testing
  // const slug = 'nextjs-expo-monorepo-with-pnpm';
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    createDevToArticle({ ...article, canonicalUrl }),
    createMediumArticle({ ...article, canonicalUrl }),
  ]);
};
