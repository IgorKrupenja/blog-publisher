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
  getImagePath,
  getMarkdownImagePaths,
  getSupabaseUrl,
  replaceMarkdownImagePaths,
} from '.';

export const publishArticle = async (path: string): Promise<void> => {
  const articleFile = getArticleFileString(path);

  const frontMatter = getArticleFrontMatter(articleFile);
  const coverImagePath = getImagePath(path, frontMatter.coverImage);
  const imagePaths = getMarkdownImagePaths(path, articleFile);
  const content = replaceMarkdownImagePaths(getSupabaseUrl(path), articleFile);

  await Promise.all([coverImagePath, ...imagePaths].map(uploadImage));

  const article: Article = { ...frontMatter, content, coverImagePath };

  // TODO: temporary for testing
  const slug = await createHashnodeArticle(article);
  // const slug = 'nextjs-expo-monorepo-with-pnpm';
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    createDevToArticle({ ...article, canonicalUrl }),
    createMediumArticle({ ...article, canonicalUrl }),
  ]);
};
