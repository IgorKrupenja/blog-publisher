import { createDevToArticle } from '../fetchers/dev-to';
import { createHashnodeArticle } from '../fetchers/hashnode';
import { createMediumArticle } from '../fetchers/medium';
import { uploadImage } from '../fetchers/supabase';
import { Article } from '../interfaces';

import { getArticleFileString, getDirectoryPath, getImagePath } from './file';
import { getCanonicalUrl } from './hashnode';
import {
  getArticleContent,
  getArticleFrontMatterOrFail,
  getMarkdownImagePaths,
  replaceMarkdownImagePaths,
} from './markdown';
import { getSupabaseUrl } from './supabase';

export const publishArticle = async (filePath: string): Promise<void> => {
  const articleFile = await getArticleFileString(filePath);
  const directoryPath = getDirectoryPath(filePath);

  const frontMatter = getArticleFrontMatterOrFail(articleFile);
  const coverImagePath = getImagePath(directoryPath, frontMatter.coverImage);
  const imagePaths = getMarkdownImagePaths(directoryPath, articleFile);
  const content = replaceMarkdownImagePaths(
    getSupabaseUrl(directoryPath),
    getArticleContent(articleFile)
  );

  await Promise.all([coverImagePath, ...imagePaths].map(uploadImage));

  const article: Article = { ...frontMatter, content, coverImagePath };

  const slug = await createHashnodeArticle(article);
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    createDevToArticle({ ...article, canonicalUrl }),
    createMediumArticle({ ...article, canonicalUrl }),
  ]);
};
